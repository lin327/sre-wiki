import { useState, useEffect, useRef } from "react";

export interface MermaidApi {
  initialize: (options: { startOnLoad: boolean; theme: string; fontFamily: string }) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
}

declare global {
  interface Window {
    mermaid?: MermaidApi;
  }
}

export const MERMAID_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.min.js";
// SHA-384 computed from the pinned jsDelivr artifact; changing the release requires re-verifying it.
export const MERMAID_SCRIPT_INTEGRITY = "sha384-EOXBFmc3gx5mb+vn0vPvvGqACToJD24hhacX5Yx+8NUUQrHIle/Qi5Bg9o3zKwW2";

let mermaidLoadPromise: Promise<MermaidApi> | null = null;
let initializedTheme = "";

export function loadMermaid(): Promise<MermaidApi> {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (mermaidLoadPromise) return mermaidLoadPromise;

  mermaidLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = MERMAID_SCRIPT_URL;
    script.integrity = MERMAID_SCRIPT_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.dataset.mermaidRuntime = "true";
    script.onload = () => {
      if (window.mermaid) resolve(window.mermaid);
      else {
        mermaidLoadPromise = null;
        script.remove();
        reject(new Error("Mermaid library loaded without exposing its API"));
      }
    };
    script.onerror = () => {
      mermaidLoadPromise = null;
      script.remove();
      reject(new Error("Mermaid library failed to load or did not pass integrity verification"));
    };
    document.head.appendChild(script);
  });
  return mermaidLoadPromise;
}

function initializeMermaid(mermaid: MermaidApi) {
  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";
  if (initializedTheme === theme) return;
  mermaid.initialize({
    startOnLoad: false,
    theme,
    fontFamily: "var(--font-mono)",
  });
  initializedTheme = theme;
}

interface MermaidProps {
  code: string;
}

export default function Mermaid({ code }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadMermaid().then((mermaid) => {
      if (cancelled) return;
      initializeMermaid(mermaid);
      setLoaded(true);
    }).catch((cause: Error) => {
      if (!cancelled) setError(cause.message || "Mermaid library failed to load");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !code.trim()) return;
    const mermaid = window.mermaid;
    if (!mermaid) return;

    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    void mermaid.render(id, code).then((result) => {
      if (cancelled) return;
      setSvg(result.svg);
      setError("");
    }).catch((cause: Error) => {
      if (!cancelled) setError(cause.message || "Failed to render diagram");
    });
    return () => {
      cancelled = true;
    };
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
