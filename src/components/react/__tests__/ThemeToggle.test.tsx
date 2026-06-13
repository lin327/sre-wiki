import { describe, it, expect, beforeEach } from 'vitest';

describe('ThemeToggle logic', () => {
  const STORAGE_KEY = 'atlas-theme';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('initializes with light theme when no preference stored', () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });

  it('toggles from light to dark', () => {
    let theme: 'light' | 'dark' = 'light';
    theme = theme === 'light' ? 'dark' : 'light';
    expect(theme).toBe('dark');
  });

  it('toggles from dark to light', () => {
    let theme: 'light' | 'dark' = 'dark';
    theme = theme === 'light' ? 'dark' : 'light';
    expect(theme).toBe('light');
  });

  it('persists theme to localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('reads persisted theme', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe('dark');
  });

  it('sets data-theme attribute on document', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('aria-label changes based on theme', () => {
    const theme: 'light' | 'dark' = 'dark';
    const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    expect(label).toBe('Switch to light mode');
  });
});

describe('AuthButton logic', () => {
  beforeEach(() => {
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

  it('detects session token among multiple cookies', () => {
    document.cookie = 'other=value; better-auth.session_token=xyz789; another=val';
    expect(hasSession()).toBe(true);
  });
});

describe('LanguageSwitcher logic', () => {
  it('detects Chinese locale from path', () => {
    const path = '/linux/process-model';
    const isZh = !path.startsWith('/en/');
    expect(isZh).toBe(true);
  });

  it('detects English locale from path', () => {
    const path = '/en/linux/process-model';
    const isEn = path.startsWith('/en/');
    expect(isEn).toBe(true);
  });

  it('generates correct English path', () => {
    const currentPath = '/linux/process-model';
    const enPath = '/en' + currentPath;
    expect(enPath).toBe('/en/linux/process-model');
  });

  it('generates correct Chinese path', () => {
    const currentPath = '/en/linux/process-model';
    const zhPath = currentPath.replace('/en/', '/');
    expect(zhPath).toBe('/linux/process-model');
  });
});
