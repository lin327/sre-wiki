import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { isDiscoverable, loadDiscoveryRoutes, prepareSearchHtml } from '../discovery-policy.mjs';

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true });
});

function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'sre-discovery-'));
  temporaryDirectories.push(root);
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  return join(root, 'src/pages');
}

describe('discovery routes', () => {
  it('requires boolean true and maps directory indexes without scanning inbox', () => {
    const pages = fixture({
      'src/pages/linux/index.astro': '<BaseLayout><main>Linux</main></BaseLayout>',
      'src/pages/linux/process-model.mdx': '---\ncanonical: true\n---\nProcess',
      'src/pages/docker/index.md': '---\ncanonical: true\n---\nDocker',
      'src/pages/linux/index-guide.mdx': '---\ncanonical: true\n---\nGuide',
      'src/pages/linux/rejected.mdx': '---\ncanonical: false\n---\nRejected',
      'src/pages/linux/missing.mdx': '---\ntitle: Pending\n---\ncanonical: true',
      'src/pages/linux/string.mdx': '---\ncanonical: "true"\n---\nPending',
      'src/inbox/linux/draft.mdx': '---\ncanonical: true\n---\nDraft',
    });
    const expected = ['/', '/about', '/privacy', '/linux', '/linux/process-model', '/docker', '/linux/index-guide'];
    expect([...loadDiscoveryRoutes(pages)].sort()).toEqual(expected.sort());
    expect(loadDiscoveryRoutes(pathToFileURL(pages))).toEqual(loadDiscoveryRoutes(pages));
  });

  it('fails on malformed frontmatter instead of silently including content', () => {
    const pages = fixture({ 'src/pages/broken.mdx': '---\ncanonical: [true\n---\nBroken' });
    expect(() => loadDiscoveryRoutes(pages)).toThrow();
  });

  it('normalizes URL encoding, trailing slash, query and hash with exact matches', () => {
    const pages = fixture({
      'src/pages/linux/网络.mdx': '---\ncanonical: true\n---\nNetwork',
      'src/pages/linux/index.mdx': '---\ncanonical: true\n---\nLinux',
    });
    const routes = loadDiscoveryRoutes(pages);
    for (const url of ['/linux/', '/%6Cinux?source=nav#top', 'https://pineapple-user.site/linux/', '/linux/网络/', '/linux/%E7%BD%91%E7%BB%9C?x=1']) {
      expect(isDiscoverable(url, routes), url).toBe(true);
    }
    for (const url of ['/linux/pending', '/linux-extra', '/linux%2F网络', '/inbox/linux', '/linux/%ZZ']) {
      expect(isDiscoverable(url, routes), url).toBe(false);
    }
  });
});

describe('generated search HTML', () => {
  const routes = new Set(['/', '/about', '/privacy', '/linux', '/linux/process-model']);

  it('marks pending links while retaining visible content and all existing attributes', () => {
    const input = '<main class="prose" id="article" title="x > y"><a class="entry" href="/linux/pending"><span>待整理文章</span></a><a href="/linux/process-model/?a=1&amp;b=2#top">精选</a></main>';
    const output = prepareSearchHtml(input, routes);
    expect(output).toBe(input.replace('title="x > y">', 'title="x > y" data-pagefind-body>')
      .replace('href="/linux/pending">', 'href="/linux/pending" data-pagefind-ignore="all">'));
    expect(prepareSearchHtml(output, routes)).toBe(output);
  });

  it('leaves external, protocol-relative, fragment and relative links unchanged', () => {
    const links = '<a href="https://example.com/history">外部</a><a href="//example.com/history">外部</a><a href="#details">锚点</a><a href="./pending">相对</a>';
    expect(prepareSearchHtml(`<main>${links}</main>`, routes))
      .toBe(`<main data-pagefind-body>${links}</main>`);
  });

  it('reads HTML entities in href without rewriting them or duplicating markers', () => {
    const input = '<main data-pagefind-body><a href="&#47;linux/pending">草稿</a><a href="/pending" data-pagefind-ignore="all">已忽略</a></main>';
    const output = prepareSearchHtml(input, routes);
    expect(output).toBe(input.replace('href="&#47;linux/pending">', 'href="&#47;linux/pending" data-pagefind-ignore="all">'));
    expect(prepareSearchHtml(output, routes)).toBe(output);
  });

  it('ignores tag-shaped text inside comments and scripts', () => {
    const prefix = '<!-- <main><a href="/pending">example</a></main> --><script>const example = \'<a href="/pending">example</a>\';</script>';
    expect(prepareSearchHtml(`${prefix}<main>精选内容</main>`, routes))
      .toBe(`${prefix}<main data-pagefind-body>精选内容</main>`);
    expect(() => prepareSearchHtml(prefix, routes)).toThrow('missing a <main>');
  });

  it('rejects a page with no main instead of permitting full-page indexing', () => {
    expect(() => prepareSearchHtml('<html><body>内容</body></html>', routes)).toThrow('missing a <main>');
  });
});
