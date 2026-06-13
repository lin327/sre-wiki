import { useState, useEffect, useRef } from "react";

interface MermaidProps {
  code: string;
}

export default function Mermaid({ code }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load mermaid from CDN
    if ((window as any).mermaid) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      const m = (window as any).mermaid;
      if (m) {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        m.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          fontFamily: "var(--font-mono)",
        });
        setLoaded(true);
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !code.trim()) return;
    const m = (window as any).mermaid;
    if (!m) return;

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    try {
      m.render(id, code).then((result: { svg: string }) => {
        setSvg(result.svg);
        setError("");
      }).catch((err: Error) => {
        setError(err.message || "Failed to render diagram");
      });
    } catch (err: any) {
      setError(err.message || "Failed to render diagram");
    }
  }, [loaded, code]);

  if (error) {
    return (
      <div style={styles.error}>
        <span style={styles.errorLabel}>Mermaid Error</span>
        <pre style={styles.errorText}>{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div style={styles.loading}>Loading diagram...</div>;
  }

  return (
    <div
      ref={containerRef}
      style={styles.container}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    overflow: "auto",
  },
  loading: {
    padding: "2rem",
    textAlign: "center" as const,
    color: "var(--color-dim)",
    fontSize: "0.875rem",
  },
  error: {
    padding: "1rem",
    background: "var(--color-surface)",
    border: "1px solid var(--color-error)",
    borderRadius: "8px",
  },
  errorLabel: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--color-error)",
    marginBottom: "0.5rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  errorText: {
    fontSize: "0.8rem",
    color: "var(--color-muted)",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
    fontFamily: "var(--font-mono)",
  },
};
