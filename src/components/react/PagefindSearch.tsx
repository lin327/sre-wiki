import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  PagefindSearch — Ctrl+K search using Pagefind UI                  */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    PagefindUI: new (opts: { element: string | HTMLElement; showImages?: boolean; showSubResults?: boolean }) => void;
  }
}

export default function PagefindSearch() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  /* ---- Ctrl+K to open ---- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* ---- Load Pagefind UI script + CSS ---- */
  useEffect(() => {
    if (document.querySelector("script[data-pagefind-ui]")) return;

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/pagefind/pagefind-ui.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "/pagefind/pagefind-ui.js";
    script.dataset.pagefindUi = "true";
    document.head.appendChild(script);
  }, []);

  /* ---- Initialize Pagefind UI when dialog opens ---- */
  useEffect(() => {
    if (!open || !containerRef.current || initialized.current) return;

    const initUI = () => {
      if (window.PagefindUI && containerRef.current && !initialized.current) {
        containerRef.current.innerHTML = "";
        new window.PagefindUI({
          element: containerRef.current,
          showImages: false,
          showSubResults: true,
        });
        initialized.current = true;
        // Focus the input
        setTimeout(() => {
          containerRef.current?.querySelector<HTMLInputElement>("input")?.focus();
        }, 100);
      }
    };

    if (window.PagefindUI) {
      initUI();
    } else {
      const check = setInterval(() => {
        if (window.PagefindUI) {
          clearInterval(check);
          initUI();
        }
      }, 100);
      setTimeout(() => clearInterval(check), 5000);
    }

    // Close on Escape
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <span style={styles.title}>搜索文档</span>
          <button type="button" style={styles.close} onClick={close} aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </button>
        </div>
        <div ref={containerRef} style={styles.content} id="pagefind-search" />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    paddingTop: "min(15vh, 100px)",
    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
  },
  dialog: {
    width: "min(640px, calc(100vw - 2rem))", maxHeight: "min(600px, 80vh)",
    display: "flex", flexDirection: "column",
    borderRadius: 12, border: "1px solid var(--color-surface-3)",
    background: "var(--color-surface)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid var(--color-surface-2)",
  },
  title: { fontSize: 13, fontWeight: 600, color: "var(--color-dim)" },
  close: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, borderRadius: 6, border: "none",
    background: "transparent", color: "var(--color-dim)", cursor: "pointer",
  },
  content: { flex: 1, overflow: "auto", padding: 8 },
};
