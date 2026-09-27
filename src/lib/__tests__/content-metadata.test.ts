import { describe, expect, it } from 'vitest';
import { getCategoryArticles, readContentMetadata, validateFrontmatter } from '../content-metadata.mjs';

const draft = {
  title: 'Docker 网络排障', description: '容器网络排障流程',
  created: '2026-09-27', updated: '2026-09-27',
  sources: [{ url: 'https://example.com/docker', title: 'Docker 指南' }],
  canonical: false, category: 'docker', type: 'runbook', confidence: 'medium', tags: ['docker'],
};
const mdx = (metadata: object) => `---\n${JSON.stringify(metadata)}\n---\n正文保持原样。`;

describe('new draft contract', () => {
  it('consumes normalized YAML metadata directly in a category list', () => {
    const raw = mdx(draft);
    const metadata = readContentMetadata(raw, 'docker');
    expect(validateFrontmatter(metadata, 'docker-networking')).toEqual(draft);
    expect(getCategoryArticles({ './docker/docker-networking.mdx': raw }, 'docker'))
      .toEqual([{ ...draft, slug: 'docker-networking' }]);
  });

  it('rejects missing or empty title', () => {
    const { title, ...missing } = draft;
    expect(() => validateFrontmatter(missing, 'docker-networking')).toThrow('title');
    expect(() => validateFrontmatter({ ...draft, title: '  ' }, 'docker-networking')).toThrow('title');
    expect(() => readContentMetadata(mdx(missing), 'docker')).toThrow('title');
  });

  it.each(['../escape', '中文标题', '', 'x', 'a'.repeat(61), '-docker', 'docker-', 'docker\n'])('rejects illegal slug %s', (slug) => {
    expect(() => validateFrontmatter(draft, slug)).toThrow('slug');
  });

  it.each([
    { canonical: 'true' }, { created: '2026-02-30' }, { created: '0000-01-01' }, { category: 'runbook' },
    { sources: ['https://example.com'] }, { sources: [{ url: 'javascript:alert(1)', title: 'bad' }] },
    { tags: ['docker', 7] }, { lastUpdated: '2026-09-27' }, { confidence: 'certain' },
  ])('rejects schema drift %j', (change) => {
    expect(() => validateFrontmatter({ ...draft, ...change }, 'docker-networking')).toThrow();
  });

  it.each(['https:example.com', 'https://example.com:bad', 'https://example.com/a b'])('rejects invalid source URL %s', (url) => {
    expect(() => validateFrontmatter({ ...draft, sources: [{ url, title: '来源' }] }, 'docker-networking')).toThrow();
  });

  it('accepts case-insensitive HTTP(S) schemes in source URLs', () => {
    expect(validateFrontmatter({ ...draft, sources: [{ url: 'HTTPS://example.com', title: '来源' }] }, 'docker-networking'))
      .toMatchObject({ sources: [{ url: 'HTTPS://example.com' }] });
  });
});

describe('category lists', () => {
  it('uses changed frontmatter immediately, sorts curated first then title/slug, and skips other categories/index', () => {
    const pages = {
      './docker/zulu.mdx': mdx({ title: '相同标题', canonical: true }),
      './docker/alpha.mdx': mdx({ title: '相同标题', canonical: true }),
      './docker/beta.mdx': mdx({ title: 'A 标题', canonical: false }),
      './docker/index.mdx': mdx({ title: '目录', canonical: true }),
      './linux/other.mdx': mdx({ title: '其他分类', canonical: true }),
    };
    expect(getCategoryArticles(pages, 'docker').map((page) => page.slug)).toEqual(['alpha', 'zulu', 'beta']);
    pages['./docker/beta.mdx'] = mdx({ title: 'A 新标题', canonical: true });
    const articles = getCategoryArticles(pages, 'docker');
    expect(articles.map((page) => page.slug)).toEqual(['beta', 'alpha', 'zulu']);
    expect(articles[0].title).toBe('A 新标题');
  });

  it('reads legacy dates and metadata while retaining historical slugs and path categories', () => {
    const raw = '---\ntitle: 历史稿\nlastUpdated: 2024-01-15\ncategory: 模型随意分类\ncanonical: "true"\nsources:\n  - https://example.com/legacy\n---\n正文';
    const [page] = getCategoryArticles({ './runbooks/历史稿.mdx': raw }, 'runbooks');
    expect(page).toMatchObject({ slug: '历史稿', title: '历史稿', category: 'runbooks', canonical: false,
      created: '2024-01-15', updated: '2024-01-15', type: 'runbook',
      sources: [{ url: 'https://example.com/legacy', title: 'https://example.com/legacy' }] });
    expect(getCategoryArticles({}, 'docker')).toEqual([]);
    expect(() => getCategoryArticles({}, '../escape')).toThrow('Unknown category');
  });
});
