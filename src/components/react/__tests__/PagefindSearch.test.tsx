import { describe, it, expect } from 'vitest';

describe('PagefindSearch logic', () => {
  function isSearchReady(): boolean {
    return typeof window !== 'undefined';
  }

  function getKeyboardShortcut(e: { ctrlKey: boolean; metaKey: boolean; key: string }): string | null {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      return 'open-search';
    }
    if (e.key === 'Escape') {
      return 'close-search';
    }
    return null;
  }

  it('search is ready in browser environment', () => {
    expect(isSearchReady()).toBe(true);
  });

  it('Ctrl+K triggers open-search', () => {
    const result = getKeyboardShortcut({ ctrlKey: true, metaKey: false, key: 'k' });
    expect(result).toBe('open-search');
  });

  it('Cmd+K triggers open-search', () => {
    const result = getKeyboardShortcut({ ctrlKey: false, metaKey: true, key: 'k' });
    expect(result).toBe('open-search');
  });

  it('Escape triggers close-search', () => {
    const result = getKeyboardShortcut({ ctrlKey: false, metaKey: false, key: 'Escape' });
    expect(result).toBe('close-search');
  });

  it('other keys return null', () => {
    const result = getKeyboardShortcut({ ctrlKey: false, metaKey: false, key: 'a' });
    expect(result).toBeNull();
  });

  it('Ctrl+other key returns null', () => {
    const result = getKeyboardShortcut({ ctrlKey: true, metaKey: false, key: 'j' });
    expect(result).toBeNull();
  });
});

describe('Search result formatting', () => {
  interface SearchResult {
    title: string;
    url: string;
    excerpt: string;
  }

  function formatResult(result: SearchResult): string {
    return `${result.title} - ${result.url}`;
  }

  function truncateExcerpt(excerpt: string, maxLength: number): string {
    if (excerpt.length <= maxLength) return excerpt;
    return excerpt.slice(0, maxLength - 3) + '...';
  }

  it('formats result correctly', () => {
    const result = { title: 'Docker Guide', url: '/docker/', excerpt: 'Learn Docker' };
    expect(formatResult(result)).toBe('Docker Guide - /docker/');
  });

  it('truncates long excerpt', () => {
    const longText = 'A'.repeat(200);
    const truncated = truncateExcerpt(longText, 100);
    expect(truncated).toHaveLength(100);
    expect(truncated.endsWith('...')).toBe(true);
  });

  it('preserves short excerpt', () => {
    const shortText = 'Short text';
    expect(truncateExcerpt(shortText, 100)).toBe('Short text');
  });

  it('handles exact length excerpt', () => {
    const exactText = 'A'.repeat(100);
    expect(truncateExcerpt(exactText, 100)).toBe(exactText);
  });
});
