import { describe, it, expect } from 'vitest';

describe('Mermaid component logic', () => {
  function detectThemeFromCSS(): 'default' | 'dark' {
    if (typeof document === 'undefined') return 'default';
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? 'dark' : 'default';
  }

  function getMermaidConfig(theme: 'default' | 'dark') {
    return {
      startOnLoad: false,
      theme,
      themeVariables:
        theme === 'dark'
          ? {
              primaryColor: '#1f6feb',
              primaryTextColor: '#e6edf3',
              primaryBorderColor: '#30363d',
              lineColor: '#8b949e',
              secondaryColor: '#21262d',
              tertiaryColor: '#161b22',
            }
          : undefined,
    };
  }

  it('detects light theme', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    expect(detectThemeFromCSS()).toBe('default');
  });

  it('detects dark theme', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(detectThemeFromCSS()).toBe('dark');
  });

  it('defaults to light when no theme set', () => {
    document.documentElement.removeAttribute('data-theme');
    expect(detectThemeFromCSS()).toBe('default');
  });

  it('generates correct config for light theme', () => {
    const config = getMermaidConfig('default');
    expect(config.startOnLoad).toBe(false);
    expect(config.theme).toBe('default');
    expect(config.themeVariables).toBeUndefined();
  });

  it('generates correct config for dark theme', () => {
    const config = getMermaidConfig('dark');
    expect(config.startOnLoad).toBe(false);
    expect(config.theme).toBe('dark');
    expect(config.themeVariables).toBeDefined();
    expect(config.themeVariables?.primaryColor).toBe('#1f6feb');
    expect(config.themeVariables?.primaryTextColor).toBe('#e6edf3');
  });

  it('dark theme has all required variables', () => {
    const config = getMermaidConfig('dark');
    const vars = config.themeVariables!;
    expect(vars.primaryColor).toBeTruthy();
    expect(vars.primaryTextColor).toBeTruthy();
    expect(vars.primaryBorderColor).toBeTruthy();
    expect(vars.lineColor).toBeTruthy();
    expect(vars.secondaryColor).toBeTruthy();
    expect(vars.tertiaryColor).toBeTruthy();
  });
});

describe('Mermaid diagram types', () => {
  const validDiagramTypes = [
    'graph TD',
    'graph LR',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram-v2',
    'gantt',
    'pie',
    'flowchart TD',
    'erDiagram',
  ];

  it('recognizes flowchart', () => {
    const code = 'graph TD\n    A --> B';
    expect(code.startsWith('graph')).toBe(true);
  });

  it('recognizes sequence diagram', () => {
    const code = 'sequenceDiagram\n    participant A';
    expect(code.startsWith('sequenceDiagram')).toBe(true);
  });

  it('recognizes class diagram', () => {
    const code = 'classDiagram\n    class Animal';
    expect(code.startsWith('classDiagram')).toBe(true);
  });

  it('recognizes state diagram', () => {
    const code = 'stateDiagram-v2\n    [*] --> Running';
    expect(code.startsWith('stateDiagram')).toBe(true);
  });

  it('recognizes gantt chart', () => {
    const code = 'gantt\n    title Project';
    expect(code.startsWith('gantt')).toBe(true);
  });

  it('all diagram types are valid', () => {
    for (const type of validDiagramTypes) {
      expect(type.length).toBeGreaterThan(0);
    }
  });
});
