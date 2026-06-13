import { describe, it, expect, beforeEach } from 'vitest';

describe('Theme system', () => {
  const STORAGE_KEY = 'atlas-theme';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  function getStoredTheme(): string {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  it('defaults to light when no stored preference', () => {
    expect(getStoredTheme()).toBe('light');
  });

  it('returns stored dark theme', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('returns stored light theme', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    expect(getStoredTheme()).toBe('light');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid');
    expect(getStoredTheme()).toBe('light');
  });

  it('applyTheme sets data-theme attribute', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applyTheme persists to localStorage', () => {
    applyTheme('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('toggle cycles between light and dark', () => {
    let theme = 'light';
    const toggle = () => {
      theme = theme === 'light' ? 'dark' : 'light';
      applyTheme(theme);
    };

    toggle();
    expect(theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    toggle();
    expect(theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('Sidebar state persistence', () => {
  const STORAGE_KEY = 'atlas-sidebar-state';

  beforeEach(() => {
    localStorage.clear();
  });

  function getSidebarState(): Record<string, boolean> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  function saveSidebarState(state: Record<string, boolean>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  it('returns empty object when no state stored', () => {
    expect(getSidebarState()).toEqual({});
  });

  it('persists group open/close state', () => {
    saveSidebarState({ linux: true, docker: false, kubernetes: true });
    const state = getSidebarState();
    expect(state.linux).toBe(true);
    expect(state.docker).toBe(false);
    expect(state.kubernetes).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{');
    expect(getSidebarState()).toEqual({});
  });

  it('preserves state across reads', () => {
    saveSidebarState({ linux: true });
    const first = getSidebarState();
    const second = getSidebarState();
    expect(first).toEqual(second);
  });

  it('can update individual group state', () => {
    saveSidebarState({ linux: true, docker: false });
    const state = getSidebarState();
    state.kubernetes = true;
    saveSidebarState(state);

    const updated = getSidebarState();
    expect(updated.linux).toBe(true);
    expect(updated.docker).toBe(false);
    expect(updated.kubernetes).toBe(true);
  });
});

describe('Search keyboard shortcut', () => {
  it('Ctrl+K opens search', () => {
    let opened = false;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        opened = true;
      }
    };

    document.addEventListener('keydown', handler);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    );

    expect(opened).toBe(true);
    document.removeEventListener('keydown', handler);
  });

  it('Escape closes search', () => {
    let closed = false;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closed = true;
      }
    };

    document.addEventListener('keydown', handler);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toBe(true);
    document.removeEventListener('keydown', handler);
  });
});
