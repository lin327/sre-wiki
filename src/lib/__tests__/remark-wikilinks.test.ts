import { describe, it, expect } from 'vitest';

// Test the wikilink regex pattern used in remark-wikilinks.mjs
// We extract the core logic for unit testing

describe('Wikilink parsing', () => {
  // Regex from remark-wikilinks.mjs
  const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  function parseWikilinks(text: string) {
    const links: Array<{ slug: string; label?: string; raw: string }> = [];
    let match;
    while ((match = WIKILINK_RE.exec(text)) !== null) {
      links.push({
        raw: match[0],
        slug: match[1].trim(),
        label: match[2]?.trim(),
      });
    }
    return links;
  }

  it('parses simple wikilink', () => {
    const links = parseWikilinks('See [[docker-basics]] for more');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('docker-basics');
    expect(links[0].label).toBeUndefined();
  });

  it('parses wikilink with custom label', () => {
    const links = parseWikilinks('See [[docker-basics|Docker Guide]]');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('docker-basics');
    expect(links[0].label).toBe('Docker Guide');
  });

  it('parses multiple wikilinks', () => {
    const text = '[[linux]] and [[docker]] and [[kubernetes]]';
    const links = parseWikilinks(text);
    expect(links).toHaveLength(3);
    expect(links.map(l => l.slug)).toEqual(['linux', 'docker', 'kubernetes']);
  });

  it('returns empty for text without wikilinks', () => {
    const links = parseWikilinks('No links here');
    expect(links).toHaveLength(0);
  });

  it('handles wikilinks with spaces in slug', () => {
    const links = parseWikilinks('[[my article]]');
    expect(links[0].slug).toBe('my article');
  });

  it('handles Chinese characters in slug', () => {
    const links = parseWikilinks('[[容器基础]]');
    expect(links[0].slug).toBe('容器基础');
  });
});
