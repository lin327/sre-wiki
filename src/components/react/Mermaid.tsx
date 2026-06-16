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
    if ((window as any).mermaid) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.integrity = "sha384-4S021e0ad7t2kLavrA420+t1O9yEj4t2lNU77jHY37mg21u0P9A4t2lNU77jHY37";
    script.crossOrigin = "anonymous";
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
      <div className="mermaid-error">
        <span className="mermaid-error-label">Mermaid Error</span>
        <pre className="mermaid-error-text">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="mermaid-loading">Loading diagram...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
