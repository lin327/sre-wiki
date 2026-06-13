import { describe, it, expect } from 'vitest';

describe('Wikilink parsing', () => {
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

  it('handles wikilinks at start of text', () => {
    const links = parseWikilinks('[[first]] then more text');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('first');
  });

  it('handles wikilinks at end of text', () => {
    const links = parseWikilinks('text before [[last]]');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('last');
  });

  it('handles adjacent wikilinks', () => {
    const links = parseWikilinks('[[one]][[two]]');
    expect(links).toHaveLength(2);
  });

  it('handles wikilink with label containing special chars', () => {
    const links = parseWikilinks('[[slug|My Label - Part 1]]');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('slug');
    expect(links[0].label).toBe('My Label - Part 1');
  });

  it('handles nested brackets correctly', () => {
    const links = parseWikilinks('[[outer[inner]]');
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe('outer[inner');
  });
});

describe('Frontmatter extraction', () => {
  function extractFrontmatter(content: string) {
    const title = '';
    const category = '';
    if (content.startsWith('---')) {
      const end = content.indexOf('---', 3);
      if (end !== -1) {
        const fm = content.slice(3, end);
        const titleMatch = fm.match(/title:\s*["']?([^"'\n]+)/);
        const categoryMatch = fm.match(/category:\s*["']?([^"'\n]+)/);
        return {
          title: titleMatch?.[1]?.trim() || '',
          category: categoryMatch?.[1]?.trim() || '',
        };
      }
    }
    return { title, category };
  }

  it('extracts title from frontmatter', () => {
    const content = '---\ntitle: "My Article"\n---\nContent';
    const result = extractFrontmatter(content);
    expect(result.title).toBe('My Article');
  });

  it('extracts category from frontmatter', () => {
    const content = '---\ncategory: "Linux"\n---\nContent';
    const result = extractFrontmatter(content);
    expect(result.category).toBe('Linux');
  });

  it('handles unquoted title', () => {
    const content = '---\ntitle: My Article\n---\nContent';
    const result = extractFrontmatter(content);
    expect(result.title).toBe('My Article');
  });

  it('returns empty for missing frontmatter', () => {
    const content = 'No frontmatter here';
    const result = extractFrontmatter(content);
    expect(result.title).toBe('');
    expect(result.category).toBe('');
  });

  it('handles empty frontmatter', () => {
    const content = '---\n---\nContent';
    const result = extractFrontmatter(content);
    expect(result.title).toBe('');
  });
});
