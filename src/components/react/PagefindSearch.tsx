import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    PagefindUI: new (opts: { element: string | HTMLElement; showImages?: boolean; showSubResults?: boolean }) => {
      destroy: () => void;
    };
  }
}

function useIsEnglish() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/en/");
}

export default function PagefindSearch() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pagefindUI = useRef<{ destroy: () => void } | null>(null);
  const isEnglish = useIsEnglish();
  const close = useCallback(() => {
    setOpen(false);
    document.getElementById("search-trigger")?.focus();
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, close]);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    let active = true;
    const controller = new AbortController();
    let focusSearch: number | undefined;
    setStatus("loading");

    const unavailable = () => {
      if (!active) return;
      window.clearTimeout(timeout);
      setStatus("error");
      pagefindUI.current?.destroy();
      pagefindUI.current = null;
      controller.abort();
    };
    const isPagefind = (value: string) => value.includes("/pagefind/");
    const resourceError = (event: Event) => {
      const target = event.target;
      if ((target instanceof HTMLScriptElement && isPagefind(target.src))
        || (target instanceof HTMLLinkElement && isPagefind(target.href))
        || (event instanceof ErrorEvent && isPagefind(event.filename))) unavailable();
    };
    const searchError = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (isPagefind(String(reason?.stack ?? "")) || /pagefind/i.test(String(reason?.message ?? reason))) {
        event.preventDefault();
        unavailable();
      }
    };
    window.addEventListener("error", resourceError, true);
    window.addEventListener("unhandledrejection", searchError);
    const timeout = window.setTimeout(unavailable, 5000);

    const loadScript = () => new Promise<void>((resolve, reject) => {
      if (window.PagefindUI) { resolve(); return; }
      document.querySelectorAll("script[data-pagefind-ui]").forEach((node) => node.remove());
      const script = document.createElement("script");
      script.src = `/pagefind/pagefind-ui.js?retry=${attempt}`;
      script.dataset.pagefindUi = "true";
      const cleanup = () => {
        script.onload = null;
        script.onerror = null;
        controller.signal.removeEventListener("abort", abort);
      };
      const abort = () => { cleanup(); script.remove(); reject(new Error("Pagefind loading aborted")); };
      script.onload = () => {
        cleanup();
        if (window.PagefindUI) resolve();
        else reject(new Error("Pagefind UI is unavailable"));
      };
      script.onerror = () => { cleanup(); script.remove(); reject(new Error("Pagefind script failed")); };
      controller.signal.addEventListener("abort", abort, { once: true });
      document.head.appendChild(script);
    });

    const load = async () => {
      document.querySelectorAll("link[data-pagefind-style]").forEach((node) => node.remove());
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `/pagefind/pagefind-ui.css?retry=${attempt}`;
      link.dataset.pagefindStyle = "true";
      document.head.appendChild(link);
      // Check core/index availability before the UI imports and caches a failed module.
      await Promise.all([
        loadScript(),
        ...["pagefind.js", "pagefind-entry.json"].map(async (name) => {
          const response = await fetch(`/pagefind/${name}`, { signal: controller.signal, cache: "no-store" });
          if (!response.ok) throw new Error(`Pagefind resource failed: ${name}`);
          if (name.endsWith(".json")) {
            const entry = await response.json();
            if (!entry.languages || !Object.keys(entry.languages).length) throw new Error("Pagefind index is unavailable");
          }
        }),
      ]);
      if (!active || controller.signal.aborted || !containerRef.current) return;
      const container = containerRef.current;
      container.replaceChildren();
      pagefindUI.current = new window.PagefindUI({ element: container, showImages: false, showSubResults: true });
      window.clearTimeout(timeout);
      setStatus("ready");
      focusSearch = window.requestAnimationFrame(() => container.querySelector<HTMLInputElement>("input")?.focus());
    };
    load().catch(unavailable);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
      if (focusSearch !== undefined) window.cancelAnimationFrame(focusSearch);
      window.removeEventListener("error", resourceError, true);
      window.removeEventListener("unhandledrejection", searchError);
      pagefindUI.current?.destroy();
      pagefindUI.current = null;
    };
  }, [open, attempt]);

  if (!open) return null;

  const categories = [
    ["linux", "Linux"], ["docker", "Docker"], ["kubernetes", "Kubernetes"],
    ["runbooks", "Runbooks"], ["architectures", "Architecture"],
    ["incidents", "Incidents"], ["comparisons", "Comparisons"],
  ];

  return (
    <div className="search-overlay" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div className="search-header">
          <span className="search-title" id="search-title">{isEnglish ? "Search docs" : "搜索文档"}</span>
          <button type="button" className="search-close" onClick={close} aria-label={isEnglish ? "Close" : "关闭"}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </button>
        </div>
        {status === "loading" && <p className="search-status" role="status">{isEnglish ? "Loading search…" : "搜索加载中…"}</p>}
        {status === "error" && (
          <div className="search-status" role="alert">
            <p>{isEnglish ? "Search is temporarily unavailable" : "搜索暂不可用"}</p>
            <p className="search-status__hint">{isEnglish ? "Retry, or browse a category below." : "可重试加载，或按栏目继续查阅。"}</p>
            <button type="button" className="search-retry" onClick={() => setAttempt((value) => value + 1)}>{isEnglish ? "Retry" : "重试"}</button>
            <nav className="search-categories" aria-label={isEnglish ? "Browse categories" : "按栏目查阅"}>
              {categories.map(([path, label]) => <a key={path} href={`/${path}`} onClick={close}>{label}</a>)}
            </nav>
          </div>
        )}
        <div ref={containerRef} className="search-content" id="pagefind-search" hidden={status !== "ready"} />
      </div>
    </div>
  );
}
