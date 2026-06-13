import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Auth session detection', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = '';
  });

  function hasSession(): boolean {
    return document.cookie.includes('better-auth.session_token');
  }

  it('returns false when no session cookie', () => {
    expect(hasSession()).toBe(false);
  });

  it('returns true when session cookie exists', () => {
    document.cookie = 'better-auth.session_token=abc123';
    expect(hasSession()).toBe(true);
  });

  it('returns true among multiple cookies', () => {
    document.cookie = 'other=value; better-auth.session_token=xyz789; another=val';
    expect(hasSession()).toBe(true);
  });
});

describe('Theme persistence', () => {
  const STORAGE_KEY = 'atlas-theme';

  function getTheme(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    }
    return 'light';
  }

  function setTheme(theme: string): void {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  it('defaults to light theme', () => {
    localStorage.clear();
    expect(getTheme()).toBe('light');
  });

  it('persists dark theme', () => {
    setTheme('dark');
    expect(getTheme()).toBe('dark');
  });

  it('persists light theme', () => {
    setTheme('light');
    expect(getTheme()).toBe('light');
  });
});

describe('Sidebar state persistence', () => {
  const STORAGE_KEY = 'atlas-sidebar-state';

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
    localStorage.clear();
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
});
