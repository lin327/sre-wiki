import { describe, expect, it } from 'vitest';
import { findExecutableMdxNodes, isSafeMdxAllowlisted } from '../../../scripts/check-safe-mdx.mjs';

const frontmatter = '---\ntitle: Test page\n---\n';

describe('safe MDX publication boundary', () => {
  it.each([
    ['import Component from "./Component.astro";', 'mdxjsEsm'],
    ['{globalThis.fetch("https://example.invalid")}', 'mdxFlowExpression'],
    ['text {globalThis.fetch("https://example.invalid")} more', 'mdxTextExpression'],
    ['<Dangerous />', 'mdxJsxFlowElement'],
    ['text <Dangerous /> more', 'mdxJsxTextElement'],
  ])('rejects %s as %s', async (body, type) => {
    await expect(findExecutableMdxNodes('src/pages/test.mdx', frontmatter + body))
      .resolves.toEqual([expect.objectContaining({ type })]);
  });

  it('does not treat code examples or frontmatter strings as executable MDX', async () => {
    const source = [
      '---',
      'title: "Example {value}"',
      '---',
      '```mdx',
      'import X from "x"',
      '{globalThis.fetch("https://example.invalid")}',
      '<X />',
      '```',
    ].join('\n');
    await expect(findExecutableMdxNodes('src/pages/example.mdx', source)).resolves.toEqual([]);
  });

  it('allows only explicitly listed existing component pages', async () => {
    const file = 'src/pages/docker/index.mdx';
    expect(isSafeMdxAllowlisted(file)).toBe(true);
    await expect(findExecutableMdxNodes(file, frontmatter + 'import X from "x";\n\n# Page\n\n<X />'))
      .resolves.toEqual([]);
    expect(isSafeMdxAllowlisted('src/pages/docker/new-topic.mdx')).toBe(false);
  });
});
