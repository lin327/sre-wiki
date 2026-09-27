import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import PagefindSearch from '../PagefindSearch';

describe('PagefindSearch lifecycle', () => {
  let container: HTMLDivElement | undefined;
  let root: ReturnType<typeof createRoot> | undefined;
  const instances: Array<{ element: HTMLElement; destroyed: boolean }> = [];

  afterEach(async () => {
    if (root) await act(async () => root?.unmount());
    container?.remove();
    document.querySelectorAll('script[data-pagefind-ui], link[href="/pagefind/pagefind-ui.css"]').forEach((node) => node.remove());
    Object.defineProperty(window, 'PagefindUI', { configurable: true, value: undefined });
    container = undefined;
    root = undefined;
    instances.length = 0;
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
