import { useEffect, useRef, useState, useCallback } from "react";

interface MermaidProps {
  code: string;
}

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      run: (options: { nodes: HTMLElement[] }) => Promise<void>;
    };
  }
}

let mermaidPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.mermaid) return Promise.resolve();
  if (mermaidPromise) return mermaidPromise;

  mermaidPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Mermaid library"));
    document.head.appendChild(script);
  });

  return mermaidPromise;
}

function getThemeColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const get = (name: string) => styles.getPropertyValue(name).trim();

  return {
    primary: get("--color-primary") || "oklch(0.550 0.105 230.0)",
    primaryLight: get("--color-primary-l") || "oklch(0.650 0.105 230.0)",
    accent: get("--color-accent") || "oklch(0.650 0.150 175.0)",
    ink: get("--color-ink") || "oklch(0.920 0.005 230)",
    muted: get("--color-muted") || "oklch(0.600 0.010 230)",
    surface: get("--color-surface") || "oklch(0.120 0.002 230)",
    surface2: get("--color-surface-2") || "oklch(0.150 0.003 230)",
    surface3: get("--color-surface-3") || "oklch(0.180 0.004 230)",
    bg: get("--color-bg") || "oklch(0.080 0.000 0)",
    success: get("--color-success") || "oklch(0.700 0.180 145.0)",
    warning: get("--color-warning") || "oklch(0.780 0.150 75.0)",
    error: get("--color-error") || "oklch(0.600 0.200 25.0)",
  };
}

function oklchToHex(oklch: string): string {
  if (!oklch || oklch.startsWith("#")) return oklch || "#ffffff";

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#ffffff";

  ctx.fillStyle = oklch;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

let mermaidIdCounter = 0;

export default function Mermaid({ code }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const renderDiagram = useCallback(async () => {
    if (!containerRef.current || !window.mermaid) return;

    const colors = getThemeColors();
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";

    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      themeVariables: {
        primaryColor: oklchToHex(colors.primary),
        primaryTextColor: oklchToHex(colors.ink),
        primaryBorderColor: oklchToHex(colors.surface3),
        lineColor: oklchToHex(colors.muted),
        secondaryColor: oklchToHex(colors.surface2),
        tertiaryColor: oklchToHex(colors.surface),
        background: oklchToHex(colors.bg),
        mainBkg: oklchToHex(colors.surface),
        nodeBorder: oklchToHex(colors.primary),
        clusterBkg: oklchToHex(colors.surface2),
        clusterBorder: oklchToHex(colors.surface3),
        titleColor: oklchToHex(colors.ink),
        edgeLabelBackground: oklchToHex(colors.surface),
        textColor: oklchToHex(colors.ink),
        fontSize: "14px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
      sequence: { mirrorActors: false },
    });

    const container = containerRef.current;
    container.innerHTML = "";

    const el = document.createElement("div");
    el.className = "mermaid";
    el.textContent = code;
    container.appendChild(el);

    try {
      await window.mermaid.run({ nodes: [el] });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Diagram rendering failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    let cancelled = false;

    loadMermaid()
      .then(() => {
        if (cancelled) return;
        return renderDiagram();
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load Mermaid",
          );
          setIsLoading(false);
        }
      });

    // Re-render on theme change
    const observer = new MutationObserver(() => {
      if (!cancelled && window.mermaid) {
        setIsLoading(true);
        renderDiagram();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [renderDiagram]);

  return (
    <div
      style={{
        position: "relative",
        marginBlock: "var(--space-6, 1.5rem)",
        padding: "var(--space-5, 1.25rem)",
        borderRadius: "var(--radius-lg, 8px)",
        backgroundColor: "var(--color-surface, oklch(0.120 0.002 230))",
        border: "1px solid var(--color-surface-2, oklch(0.150 0.003 230))",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      {isLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "4rem",
            color: "var(--color-muted, oklch(0.600 0.010 230))",
            fontSize: "0.85rem",
            fontFamily: "var(--font-sans)",
          }}
        >
          Loading diagram...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "var(--space-4, 1rem)",
            borderRadius: "var(--radius-md, 6px)",
            backgroundColor: "oklch(0.600 0.200 25.0 / 0.1)",
            border: "1px solid var(--color-error, oklch(0.600 0.200 25.0))",
            color: "var(--color-error, oklch(0.600 0.200 25.0))",
            fontSize: "0.85rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          <strong>Mermaid Error:</strong> {error}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          display: isLoading ? "none" : "block",
          textAlign: "center",
        }}
      />
    </div>
  );
}
