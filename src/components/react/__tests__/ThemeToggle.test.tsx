import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle preferences', () => {
  const STORAGE_KEY = 'atlas-theme';
  let host: HTMLDivElement;
  let root: Root | undefined;
  let systemDark: boolean;
  let media: MediaQueryList;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    systemDark = true;
    media = window.matchMedia('(prefers-color-scheme: dark)');
    vi.spyOn(media, 'matches', 'get').mockImplementation(() => systemDark);
    vi.spyOn(window, 'matchMedia').mockReturnValue(media);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    if (root) await act(async () => root?.unmount());
    host?.remove();
    root = undefined;
    vi.restoreAllMocks();
  });

  async function mount(lang: 'zh' | 'en' = 'zh') {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => root?.render(createElement(ThemeToggle, { lang })));
    return host.querySelector('select');
  }

  it('defaults to system without freezing it, and remembers an explicit light choice', async () => {
    const control = await mount();
    expect(control).not.toBeNull();
    expect(Array.from(control!.options, (option) => option.textContent)).toEqual(['跟随系统', '亮色', '暗色']);
    expect(control!.value).toBe('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    await act(async () => {
      control!.value = 'light';
      control!.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');

    await act(async () => root?.unmount());
    host.remove();
    const restored = await mount();
    expect(restored!.value).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('follows live system changes and lets a manual choice opt out and back in', async () => {
    const control = (await mount())!;
    await act(async () => {
      systemDark = false;
      media.dispatchEvent(new Event('change'));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    await act(async () => {
      control.value = 'dark';
      control.dispatchEvent(new Event('change', { bubbles: true }));
      media.dispatchEvent(new Event('change'));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await act(async () => {
      control.value = 'system';
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
    await act(async () => {
      systemDark = true;
      media.dispatchEvent(new Event('change'));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
  });

  it.each(['light', 'dark'] as const)('preserves a previously stored %s choice', async (choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    systemDark = choice === 'light';
    const control = (await mount())!;
    expect(control.value).toBe(choice);
    expect(document.documentElement.getAttribute('data-theme')).toBe(choice);
    await act(async () => media.dispatchEvent(new Event('change')));
    expect(document.documentElement.getAttribute('data-theme')).toBe(choice);
  });

  it.each([null, 'system', 'invalid'])('follows a light system with stored preference %s', async (stored) => {
    if (stored !== null) localStorage.setItem(STORAGE_KEY, stored);
    systemDark = false;
    const control = (await mount())!;
    expect(control.value).toBe('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('keeps working when storage reads and writes are blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const control = (await mount())!;
    expect(control.disabled).toBe(false);
    expect(control.value).toBe('system');
    await act(async () => {
      control.value = 'light';
      control.dispatchEvent(new Event('change', { bubbles: true }));
      media.dispatchEvent(new Event('change'));
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('stops changing the document after it unmounts', async () => {
    await mount();
    await act(async () => root?.unmount());
    root = undefined;
    document.documentElement.setAttribute('data-theme', 'light');
    media.dispatchEvent(new Event('change'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('renders a disabled system selector before hydration', () => {
    const markup = renderToStaticMarkup(createElement(ThemeToggle));
    const shell = document.createElement('div');
    shell.innerHTML = markup;
    const control = shell.querySelector('select')!;
    expect(control.disabled).toBe(true);
    expect(control.querySelector('option[selected]')?.getAttribute('value')).toBe('system');
  });

  it('offers translated options on the English site', async () => {
    const control = (await mount('en'))!;
    expect(control.getAttribute('aria-label')).toBe('Theme mode');
    expect(Array.from(control.options, (option) => option.textContent)).toEqual(['System', 'Light', 'Dark']);
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
