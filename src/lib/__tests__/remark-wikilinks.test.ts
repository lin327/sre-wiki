import { describe, it, expect } from 'vitest';
import remarkWikilinks, { parseWikilinks } from '../remark-wikilinks.mjs';
import { createRouteIndex } from '../route-index.mjs';

describe('Wikilink parsing', () => {
  it('parses simple wikilink', () => {
    const links = parseWikilinks('See [[docker-basics]] for more');
    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('docker-basics');
    expect(links[0].label).toBeUndefined();
  });

  it('parses wikilink with custom label', () => {
    const links = parseWikilinks('See [[docker-basics|Docker Guide]]');
    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('docker-basics');
    expect(links[0].label).toBe('Docker Guide');
  });

  it('parses multiple wikilinks', () => {
    const text = '[[linux]] and [[docker]] and [[kubernetes]]';
    const links = parseWikilinks(text);
    expect(links).toHaveLength(3);
    expect(links.map(l => l.target)).toEqual(['linux', 'docker', 'kubernetes']);
  });

  it('returns empty for text without wikilinks', () => {
    const links = parseWikilinks('No links here');
    expect(links).toHaveLength(0);
  });

  it('handles wikilinks with spaces in slug', () => {
    const links = parseWikilinks('[[my article]]');
    expect(links[0].target).toBe('my article');
  });

  it('handles Chinese characters in slug', () => {
    const links = parseWikilinks('[[容器基础]]');
    expect(links[0].target).toBe('容器基础');
  });

  it('rewrites links using the same route resolver used by PR checks', () => {
    const tree = {
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'text', value: 'See [[process-model|进程模型]]。' }] }],
    };
    const routeIndex = createRouteIndex([{ route: '/linux/process-model', slug: 'process-model' }]);
    remarkWikilinks({ routeIndex })(tree as never);
    expect(tree.children[0].children[1]).toMatchObject({ type: 'link', url: '/linux/process-model' });
    expect(tree.children[0].children[1].children[0].value).toBe('进程模型');
  });
});
