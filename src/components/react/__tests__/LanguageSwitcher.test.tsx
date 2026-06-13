import { describe, it, expect } from 'vitest';

describe('LanguageSwitcher logic', () => {
  function getCurrentLocale(pathname: string): 'zh' | 'en' {
    return pathname.startsWith('/en/') ? 'en' : 'zh';
  }

  function getAlternatePath(pathname: string, targetLocale: 'zh' | 'en'): string {
    if (targetLocale === 'en') {
      if (pathname.startsWith('/en/')) return pathname;
      return '/en' + pathname;
    }
    // zh
    if (pathname.startsWith('/en/')) return pathname.slice(3);
    return pathname;
  }

  describe('getCurrentLocale', () => {
    it('returns zh for root path', () => {
      expect(getCurrentLocale('/')).toBe('zh');
    });

    it('returns zh for Chinese article', () => {
      expect(getCurrentLocale('/linux/process-model')).toBe('zh');
    });

    it('returns en for English root', () => {
      expect(getCurrentLocale('/en/')).toBe('en');
    });

    it('returns en for English article', () => {
      expect(getCurrentLocale('/en/linux/process-model')).toBe('en');
    });

    it('returns zh for category page', () => {
      expect(getCurrentLocale('/docker/')).toBe('zh');
    });

    it('returns en for English category page', () => {
      expect(getCurrentLocale('/en/docker/')).toBe('en');
    });
  });

  describe('getAlternatePath', () => {
    it('converts zh root to en', () => {
      expect(getAlternatePath('/', 'en')).toBe('/en/');
    });

    it('converts zh article to en', () => {
      expect(getAlternatePath('/linux/process-model', 'en')).toBe('/en/linux/process-model');
    });

    it('converts en root to zh', () => {
      expect(getAlternatePath('/en/', 'zh')).toBe('/');
    });

    it('converts en article to zh', () => {
      expect(getAlternatePath('/en/linux/process-model', 'zh')).toBe('/linux/process-model');
    });

    it('preserves path when already in target locale (en)', () => {
      expect(getAlternatePath('/en/docker/', 'en')).toBe('/en/docker/');
    });

    it('preserves path when already in target locale (zh)', () => {
      expect(getAlternatePath('/kubernetes/', 'zh')).toBe('/kubernetes/');
    });

    it('handles mermaid page', () => {
      expect(getAlternatePath('/mermaid/', 'en')).toBe('/en/mermaid/');
    });

    it('handles auth pages', () => {
      expect(getAlternatePath('/auth/login', 'en')).toBe('/en/auth/login');
    });
  });
});
