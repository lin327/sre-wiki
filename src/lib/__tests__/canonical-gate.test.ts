import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createRouteIndex } from '../route-index.mjs';
import { validateDraftPage, validatePublishPage } from '../publish-contract.mjs';

const routeIndex = createRouteIndex([{ route: '/linux/process-model', slug: 'process-model' }]);
const metadata = {
  layout: '../../layouts/BaseLayout.astro', title: '经人工审校的运维指南',
  created: '2026-11-04', updated: '2026-11-04',
  sources: [{ url: 'https://example.com/source', title: '来源' }],
  canonical: true, category: 'docker', domain: 'docker', type: 'guide',
  confidence: 'high', tags: ['docker'],
  reviewed: true, reviewed_by: 'maintainer', reviewed_at: '2026-11-04',
};
const body = '运维'.repeat(400) + ' [[linux/process-model]]';
const source = (data: Record<string, unknown>, text = body) =>
  `---\n${JSON.stringify(data)}\n---\n${text}`;
const check = (data: Record<string, unknown>, text = body, isNew = true) =>
  validatePublishPage('src/pages/docker/reviewed-guide.mdx', source(data, text), { isNew, routeIndex });

describe('canonical acceptance regressions', () => {
  it('accepts a reviewed article without rejecting the review fields', async () => {
    expect((await check(metadata)).errors).toEqual([]);
  });

  it('rejects tbd for canonical articles', async () => {
    expect((await check({ ...metadata, domain: 'tbd' })).errors.join('\n')).toContain('domain');
  });

  it('rejects missing review fields', async () => {
    const { reviewed, reviewed_by, reviewed_at, ...unreviewed } = metadata;
    expect((await check(unreviewed)).errors.join('\n')).toContain('reviewed');
  });

  it('rejects a short body', async () => {
    expect((await check(metadata, '短正文')).errors.join('\n')).toContain('800');
  });

  it('rejects placeholder content even in a long body', async () => {
    expect((await check(metadata, body + '内容待补充')).errors.join('\n')).toContain('内容待补充');
  });

  it.each([
    { reviewed: false }, { reviewed_by: '  ' }, { reviewed_at: '2026-02-30' },
  ])('rejects invalid review evidence %j', async (patch) => {
    expect((await check({ ...metadata, ...patch })).errors.join('\n')).toContain('reviewed');
  });

  it('counts non-whitespace Unicode characters at the 800-character boundary', async () => {
    expect((await check(metadata, '知'.repeat(799) + '\n '.repeat(100))).errors.join('\n')).toContain('800');
    expect((await check(metadata, '知'.repeat(800))).errors).toEqual([]);
  });

  it('also blocks promotion or edits of existing files', async () => {
    expect((await check({ ...metadata, domain: 'tbd' }, body, false)).errors.join('\n')).toContain('domain');
  });

  it('keeps category optional while checking supplied compatibility values', async () => {
    const { category, ...withoutCategory } = metadata;
    expect((await check(withoutCategory)).errors).toEqual([]);
    expect((await check({ ...metadata, category: 'linux' })).errors.join('\n')).toContain('directory');
  });

  it('grandfathers only byte-identical frozen seeds, never modified or newly added content', async () => {
    const file = 'src/pages/linux/filesystem.mdx';
    const raw = readFileSync(file, 'utf8');
    const unchanged = await validatePublishPage(file, raw, { routeIndex });
    expect(unchanged.errors).toEqual([]);
    expect(unchanged.warnings.join('\n')).toContain('frozen');
    expect((await validatePublishPage(file, raw + '\n', { routeIndex })).errors.length).toBeGreaterThan(0);
    expect((await validatePublishPage(file, raw, { isNew: true, routeIndex })).errors.length).toBeGreaterThan(0);
  });

  it('checks inbox domain/type with the same schema and rejects approval in inbox', () => {
    const { layout, reviewed, reviewed_by, reviewed_at, ...draft } = metadata;
    const raw = { ...draft, canonical: false, domain: 'tbd' };
    expect(validateDraftPage('src/inbox/docker/reviewed-guide.mdx', source(raw)).errors).toEqual([]);
    const { domain, ...missingDomain } = raw;
    expect(validateDraftPage('src/inbox/docker/reviewed-guide.mdx', source(missingDomain)).errors.join('\n'))
      .toContain('domain');
    expect(validateDraftPage('src/inbox/docker/reviewed-guide.mdx', source({ ...raw, canonical: true })).errors.join('\n'))
      .toContain('canonical: false');
  });

  it('keeps only the unchanged historical inbox index as reference material', () => {
    const file = 'src/inbox/linux/index.mdx';
    const raw = readFileSync(file, 'utf8');
    expect(validateDraftPage(file, raw).errors).toEqual([]);
    expect(validateDraftPage(file, raw).warnings.join('\n')).toContain('frozen');
    expect(validateDraftPage(file, raw + '\n').errors.length).toBeGreaterThan(0);
  });
});
