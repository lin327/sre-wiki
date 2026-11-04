import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PagefindSearch from '../PagefindSearch';

describe('PagefindSearch lifecycle', () => {
  let container: HTMLDivElement | undefined;
  let root: ReturnType<typeof createRoot> | undefined;
  const instances: Array<{ element: HTMLElement; destroyed: boolean }> = [];

  beforeEach(() => {
    Object.defineProperty(window, 'PagefindUI', { configurable: true, writable: true, value: undefined });
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({ languages: { zh: { hash: 'fixture' } } }), { status: 200 }));
    const append = document.head.appendChild.bind(document.head);
    // Keep external assets inert; each test supplies its own load/error signal.
    vi.spyOn(document.head, 'appendChild').mockImplementation((node: Node) => {
      if (node instanceof HTMLScriptElement && node.dataset.pagefindUi) node.type = 'application/x-test-fixture';
      if (node instanceof HTMLLinkElement && node.dataset.pagefindStyle) node.rel = 'x-test-fixture';
      return append(node);
    });
  });

  afterEach(async () => {
    if (root) await act(async () => root?.unmount());
    container?.remove();
    document.querySelectorAll('script[data-pagefind-ui], link[data-pagefind-style], link[href="/pagefind/pagefind-ui.css"]').forEach((node) => node.remove());
    Object.defineProperty(window, 'PagefindUI', { configurable: true, writable: true, value: undefined });
    container = undefined;
    root = undefined;
    instances.length = 0;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('retries after a script failure without reloading the document', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root?.render(createElement(PagefindSearch)));
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })));
    await act(async () => document.querySelector('script[data-pagefind-ui]')?.dispatchEvent(new Event('error')));
    expect(container.textContent).toContain('搜索暂不可用');
    window.PagefindUI = class {
      constructor({ element }: { element: string | HTMLElement }) {
        if (element instanceof HTMLElement) element.innerHTML = '<input type="search" />';
      }
      destroy() {}
    };
    const retry = Array.from(container.querySelectorAll('button')).find((button) => button.textContent === '重试');
    await act(async () => retry?.click());
    expect(container.textContent).not.toContain('搜索暂不可用');
    expect(container.querySelector('input[type="search"]')).not.toBeNull();
  });

  it('reports a missing index as unavailable instead of zero results', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    vi.mocked(fetch).mockResolvedValue(new Response('not found', { status: 404 }));
    window.PagefindUI = class { constructor() {} destroy() {} };
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root?.render(createElement(PagefindSearch)));
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })));
    expect(container.textContent).toContain('搜索暂不可用');
    expect(container.textContent).not.toMatch(/0 results|无结果|没有结果/);
  });

  it('times out a suspended script and remains closable', async () => {
    vi.useFakeTimers();
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root?.render(createElement(PagefindSearch)));
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })));
    expect(container.textContent).toContain('搜索加载中');
    await act(async () => vi.advanceTimersByTime(5000));
    expect(container.textContent).toContain('搜索暂不可用');
    await act(async () => container?.querySelector<HTMLButtonElement>('.search-close')?.click());
    expect(container.querySelector('.search-dialog')).toBeNull();
  });

  it('shows an unavailable state with retry and category links when the script fails', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root?.render(createElement(PagefindSearch)));
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    const script = document.querySelector('script[data-pagefind-ui]');
    expect(script).not.toBeNull();
    await act(async () => script?.dispatchEvent(new Event('error')));
    expect(container.textContent).toContain('搜索暂不可用');
    expect(Array.from(container.querySelectorAll('button'), (button) => button.textContent)).toContain('重试');
    expect(container.querySelector('a[href="/linux"]')).not.toBeNull();
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(container.querySelector('.search-overlay')).toBeNull();
  });

  it('creates a fresh search UI after closing and reopening, and destroys both instances', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    window.PagefindUI = class {
      private element: HTMLElement;

      constructor({ element }: { element: string | HTMLElement }) {
        this.element = typeof element === 'string' ? document.querySelector<HTMLElement>(element)! : element;
        this.element.innerHTML = '<input type="search" />';
        instances.push({ element: this.element, destroyed: false });
      }

      destroy() {
        const instance = instances.find((entry) => entry.element === this.element);
        if (instance) instance.destroyed = true;
        this.element.replaceChildren();
      }
    };

    container = document.createElement('div');
    document.body.appendChild(container);
    const scriptMarker = document.createElement('script');
    scriptMarker.dataset.pagefindUi = 'true';
    document.head.appendChild(scriptMarker);
    root = createRoot(container);
    await act(async () => root?.render(createElement(PagefindSearch)));

    const press = async (key: string, ctrlKey = false) => act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey }));
    });

    await press('k', true);
    expect(instances).toHaveLength(1);
    expect(instances[0].element.querySelector('input')).not.toBeNull();

    await press('Escape');
    expect(instances[0].destroyed).toBe(true);

    await press('k', true);
    expect(instances).toHaveLength(2);
    expect(instances[1].element.querySelector('input')).not.toBeNull();

    await act(async () => root?.unmount());
    root = undefined;
    expect(instances[1].destroyed).toBe(true);
  });
});
