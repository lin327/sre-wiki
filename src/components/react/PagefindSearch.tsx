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
  const containerRef = useRef<HTMLDivElement>(null);
  const pagefindUI = useRef<{ destroy: () => void } | null>(null);
  const isEnglish = useIsEnglish();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (document.querySelector("script[data-pagefind-ui]")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/pagefind/pagefind-ui.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "/pagefind/pagefind-ui.js";
    script.dataset.pagefindUi = "true";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    let check: number | undefined;
    let stopChecking: number | undefined;
    let focusSearch: number | undefined;

    const initUI = () => {
      const container = containerRef.current;
      if (window.PagefindUI && container && !pagefindUI.current) {
        container.innerHTML = "";
        pagefindUI.current = new window.PagefindUI({
          element: container,
          showImages: false,
          showSubResults: true,
        });
        focusSearch = window.setTimeout(() => {
          container.querySelector<HTMLInputElement>("input")?.focus();
        }, 100);
      }
    };

    if (window.PagefindUI) {
      initUI();
    } else {
      check = window.setInterval(() => {
        if (window.PagefindUI) {
          if (check !== undefined) window.clearInterval(check);
          initUI();
        }
      }, 100);
      stopChecking = window.setTimeout(() => {
        if (check !== undefined) window.clearInterval(check);
      }, 5000);
    }

    return () => {
      if (check !== undefined) window.clearInterval(check);
      if (stopChecking !== undefined) window.clearTimeout(stopChecking);
      if (focusSearch !== undefined) window.clearTimeout(focusSearch);
      pagefindUI.current?.destroy();
      pagefindUI.current = null;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="search-dialog">
        <div className="search-header">
          <span className="search-title">{isEnglish ? "Search docs" : "搜索文档"}</span>
          <button type="button" className="search-close" onClick={close} aria-label={isEnglish ? "Close" : "关闭"}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </button>
        </div>
        <div ref={containerRef} className="search-content" id="pagefind-search" />
      </div>
    </div>
  );
}
