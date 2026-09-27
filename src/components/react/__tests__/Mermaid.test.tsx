import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Mermaid, {
  loadMermaid,
  MERMAID_SCRIPT_INTEGRITY,
  MERMAID_SCRIPT_URL,
  type MermaidApi,
} from '../Mermaid';

describe('Mermaid script loading and rendering', () => {
  let host: HTMLDivElement | undefined;
  let root: Root | undefined;

  afterEach(async () => {
    if (root) await act(async () => root?.unmount());
    host?.remove();
    document.querySelectorAll('script[data-mermaid-runtime]').forEach((script) => script.remove());
    Object.defineProperty(window, 'mermaid', { configurable: true, value: undefined });
    vi.restoreAllMocks();
    host = undefined;
    root = undefined;
  });

  it('pins Mermaid 11.17.2 with a SHA-384 integrity value', () => {
    expect(MERMAID_SCRIPT_URL).toBe('https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.min.js');
    expect(MERMAID_SCRIPT_INTEGRITY).toBe('sha384-EOXBFmc3gx5mb+vn0vPvvGqACToJD24hhacX5Yx+8NUUQrHIle/Qi5Bg9o3zKwW2');
  });

  it('shares one script request and reports load/integrity failures', async () => {
    const scripts: HTMLScriptElement[] = [];
    const append = document.head.appendChild.bind(document.head);
    vi.spyOn(document.head, 'appendChild').mockImplementation((node: Node) => {
      if (node instanceof HTMLScriptElement && node.dataset.mermaidRuntime) {
        scripts.push(node);
        return node;
      }
      return append(node);
    });

    const first = loadMermaid();
    const second = loadMermaid();
    expect(first).toBe(second);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe(MERMAID_SCRIPT_URL);
    expect(scripts[0].integrity).toBe(MERMAID_SCRIPT_INTEGRITY);
    expect(scripts[0].crossOrigin).toBe('anonymous');

    scripts[0].dispatchEvent(new Event('error'));
    await expect(first).rejects.toThrow('integrity verification');
  });

  it('renders a diagram through the loaded Mermaid API', async () => {
    const api: MermaidApi = {
      initialize: vi.fn(),
      render: vi.fn(async () => ({ svg: '<svg data-test="diagram"></svg>' })),
    };
    Object.defineProperty(window, 'mermaid', { configurable: true, value: api });
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    await act(async () => {
      root?.render(createElement(Mermaid, { code: 'graph TD\nA --> B' }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(api.initialize).toHaveBeenCalledWith({
      startOnLoad: false,
      theme: 'default',
      fontFamily: 'var(--font-mono)',
    });
    expect(api.render).toHaveBeenCalledWith(expect.stringMatching(/^mermaid-/), 'graph TD\nA --> B');
    expect(host.querySelector('svg[data-test="diagram"]')).not.toBeNull();
  });
});
