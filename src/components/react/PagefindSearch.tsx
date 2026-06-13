import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  PagefindSearch — Ctrl+K command palette powered by Pagefind       */
/* ------------------------------------------------------------------ */

interface PagefindApi {
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindResultData> }[] }>;
}

interface PagefindResultData {
  url: string;
  meta: { title?: string; section?: string };
  excerpt: string;
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const css = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "min(20vh, 120px)",
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
  },
  dialog: {
    width: "min(620px, calc(100vw - 2rem))",
    maxHeight: "min(520px, 72vh)",
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: "12px",
    border: "1px solid var(--color-surface-3)",
    background: "var(--color-surface)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    borderBottom: "1px solid var(--color-surface-2)",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    lineHeight: "22px",
    color: "var(--color-ink)",
  },
  kbd: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    padding: "0 6px",
    borderRadius: "4px",
    border: "1px solid var(--color-surface-3)",
    background: "var(--color-surface-2)",
    color: "var(--color-dim)",
    fontSize: 11,
    fontWeight: 500,
    fontFamily: "var(--font-mono)",
  },
  results: {
    flex: 1,
    overflowY: "auto" as const,
    padding: 6,
    margin: 0,
    listStyle: "none",
  },
  empty: {
    padding: "40px 16px",
    textAlign: "center" as const,
    color: "var(--color-dim)",
    fontSize: 14,
  },
  resultBtn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
    color: "var(--color-ink)",
    fontSize: 14,
    transition: "background 120ms ease",
  },
  resultTitle: { fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.4 },
  resultExcerpt: {
    fontSize: "0.8rem",
    color: "var(--color-muted)",
    lineHeight: 1.5,
    display: "-webkit-box" as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  resultUrl: {
    fontSize: "0.7rem",
    color: "var(--color-dim)",
    fontFamily: "var(--font-mono)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderTop: "1px solid var(--color-surface-2)",
    fontSize: "0.7rem",
    color: "var(--color-dim)",
  },
  footerKbd: { display: "inline-flex", alignItems: "center", gap: 4 },
  footerKey: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18,
    height: 18,
    padding: "0 4px",
    borderRadius: "4px",
    border: "1px solid var(--color-surface-3)",
    background: "var(--color-surface-2)",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    lineHeight: 1,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PagefindSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pfRef = useRef<PagefindApi | null>(null);

  /* ---- Load Pagefind via script tag ---- */
  useEffect(() => {
    // Already loaded
    if ((window as any).__pagefind) {
      pfRef.current = (window as any).__pagefind;
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "/pagefind/pagefind.js";
    script.async = true;
    script.addEventListener("load", () => {
      // Pagefind sets itself on window after WASM loads
      const check = setInterval(() => {
        const pf = (window as any).pagefind;
        if (pf && typeof pf.search === "function") {
          clearInterval(check);
          (window as any).__pagefind = pf;
          pfRef.current = pf;
          setReady(true);
        }
      }, 100);
      // Timeout after 5s
      setTimeout(() => clearInterval(check), 5000);
    });
    document.head.appendChild(script);
  }, []);

  /* ---- Ctrl+K ---- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) { setQuery(""); setResults([]); }
          return !v;
        });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* ---- Focus ---- */
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  /* ---- Search ---- */
  useEffect(() => {
    if (!pfRef.current) return;
    const trimmed = query.trim();
    if (!trimmed) { setResults([]); setActiveIndex(0); return; }

    let cancel = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await pfRef.current!.search(trimmed);
        const data = await Promise.all(res.results.slice(0, 20).map(r => r.data()));
        if (!cancel) { setResults(data); setActiveIndex(0); }
      } catch { if (!cancel) { setResults([]); setActiveIndex(0); } }
      finally { if (!cancel) setLoading(false); }
    }, 200);
    return () => { cancel = true; clearTimeout(t); };
  }, [query]);

  /* ---- Active scroll ---- */
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* ---- Handlers ---- */
  const close = useCallback(() => { setOpen(false); setQuery(""); setResults([]); }, []);
  const go = useCallback((url: string) => { close(); window.location.href = url; }, [close]);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); if (results[activeIndex]) go(results[activeIndex].url); }
  }, [close, results, activeIndex, go]);

  if (!open) return null;

  return (
    <div style={css.overlay} onClick={(e) => { if (e.target === e.currentTarget) close(); }} role="presentation">
      <div style={css.dialog} role="dialog" aria-modal="true" aria-label="搜索文档" onKeyDown={onKey}>
        <div style={css.inputRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input ref={inputRef} type="text" placeholder={ready ? "搜索文档..." : "加载索引中..."} value={query} onChange={e => setQuery(e.target.value)} style={css.input} autoComplete="off" spellCheck={false} disabled={!ready} />
          <kbd style={css.kbd}>Esc</kbd>
        </div>
        <ul ref={listRef} style={css.results} role="listbox">
          {!ready ? <li style={css.empty}>加载搜索索引中...</li>
          : !query.trim() ? <li style={css.empty}>输入关键词搜索</li>
          : loading ? <li style={css.empty}>搜索中...</li>
          : results.length === 0 ? <li style={css.empty}>未找到「{query.trim()}」的结果</li>
          : results.map((item, i) => (
              <li key={item.url + i} role="option" aria-selected={i === activeIndex}>
                <button type="button" onClick={() => go(item.url)} onMouseEnter={() => setActiveIndex(i)} style={{ ...css.resultBtn, background: i === activeIndex ? "var(--color-surface-2)" : "transparent" }}>
                  <span style={css.resultTitle}>{item.meta.title || item.url}</span>
                  {item.excerpt && <span style={css.resultExcerpt}>{item.excerpt.replace(/<[^>]+>/g, "").trim()}</span>}
                  <span style={css.resultUrl}>{item.url}</span>
                </button>
              </li>
            ))}
        </ul>
        <div style={css.footer}>
          <span style={css.footerKbd}><span style={css.footerKey}>↑↓</span> 导航</span>
          <span style={css.footerKbd}><span style={css.footerKey}>↵</span> 打开</span>
          <span style={css.footerKbd}><span style={css.footerKey}>Esc</span> 关闭</span>
        </div>
      </div>
    </div>
  );
}
