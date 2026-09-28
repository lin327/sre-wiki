import { describe, expect, it } from 'vitest';
import { createRouteIndex, resolveWikilink } from '../route-index.mjs';
import { validatePublishPage } from '../publish-contract.mjs';

const routeIndex = createRouteIndex([
  { route: '/docker/network-guide', slug: 'network-guide' },
  { route: '/docker/networking', slug: 'networking' },
  { route: '/linux/process-model', slug: 'process-model' },
  { route: '/kubernetes/networking', slug: 'networking' },
]);

const page = (metadata: Record<string, unknown>, body = '正文 [[linux/process-model]]。') =>
  `---\n${Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n${body}`;

const validMetadata = {
  layout: '../../layouts/BaseLayout.astro',
  title: 'Docker 网络指南',
  created: '2026-09-28',
  updated: '2026-09-28',
  sources: [{ url: 'https://example.com/docker', title: 'Docker 网络' }],
  canonical: true,
  category: 'docker',
  domain: 'docker',
  type: 'concept',
  confidence: 'high',
  tags: ['docker', 'network'],
};

describe('Wiki publishing contract', () => {
  it('accepts a new, reviewed page with fixed layout, schema, and resolvable wikilinks', async () => {
    const result = await validatePublishPage(
      'src/pages/docker/network-guide.mdx', page(validMetadata), { isNew: true, routeIndex },
    );
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('rejects a missing title, illegal slug, and an unreviewed canonical flag', async () => {
    const { title, ...withoutTitle } = validMetadata;
    const missingTitle = await validatePublishPage(
      'src/pages/docker/network-guide.mdx', page(withoutTitle), { isNew: true, routeIndex },
    );
    const badSlug = await validatePublishPage(
      'src/pages/docker/中文标题.mdx', page(validMetadata), { isNew: true, routeIndex },
    );
    const unreviewed = await validatePublishPage(
      'src/pages/docker/network-guide.mdx', page({ ...validMetadata, canonical: false }), { isNew: true, routeIndex },
    );

    expect(missingTitle.errors.join('\n')).toContain('title');
    expect(badSlug.errors.join('\n')).toContain('slug');
    expect(unreviewed.errors.join('\n')).toContain('canonical: true');
  });

  it('rejects a page outside the fixed BaseLayout and a category mismatch', async () => {
    const result = await validatePublishPage(
      'src/pages/docker/network-guide.mdx',
      page({ ...validMetadata, layout: '../../layouts/OtherLayout.astro', category: 'linux' }),
      { isNew: true, routeIndex },
    );
    expect(result.errors.join('\n')).toContain('BaseLayout.astro');
    expect(result.errors.join('\n')).toContain('match the docker directory');
  });

  it('rejects unresolved links in new pages and warns without blocking legacy pages', async () => {
    const source = page(validMetadata, '正文 [[missing-page]]。');
    const draftResult = await validatePublishPage(
      'src/pages/docker/network-guide.mdx', source, { isNew: true, routeIndex },
    );
    const legacyResult = await validatePublishPage(
      'src/pages/docker/legacy-page.mdx',
      page({ layout: '../../layouts/BaseLayout.astro', title: '历史页' }, '正文 [[missing-page]]。'),
      { routeIndex },
    );

    expect(draftResult.errors.join('\n')).toContain('missing route');
    expect(legacyResult.errors).toEqual([]);
    expect(legacyResult.warnings.join('\n')).toContain('missing route');
  });
});

describe('Wiki route resolution', () => {
  it('resolves explicit category routes and unique legacy slugs', () => {
    expect(resolveWikilink('docker/networking', routeIndex)).toMatchObject({ ok: true, href: '/docker/networking' });
    expect(resolveWikilink('process-model', routeIndex)).toMatchObject({ ok: true, href: '/linux/process-model' });
  });

  it('rejects missing, ambiguous, and traversal targets', () => {
    expect(resolveWikilink('networking', routeIndex)).toMatchObject({ ok: false, reason: 'ambiguous slug' });
    expect(resolveWikilink('docker/missing', routeIndex)).toMatchObject({ ok: false, reason: 'missing route' });
    expect(resolveWikilink('../secret', routeIndex)).toMatchObject({ ok: false, reason: 'invalid target' });
  });
});
