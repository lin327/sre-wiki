import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  PagefindSearch — Ctrl+K search dialog using Pagefind script tag   */
/* ------------------------------------------------------------------ */

export default function PagefindSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const pfRef = useRef<any>(null);

  /* ---- Load Pagefind via script tag ---- */
  useEffect(() => {
    if ((window as any).pagefind) {
      pfRef.current = (window as any).pagefind;
      setReady(true);
      return;
    }

    const existing = document.querySelector("script[data-pagefind]");
    if (existing) {
      const poll = setInterval(() => {
        if ((window as any).pagefind) {
          clearInterval(poll);
          pfRef.current = (window as any).pagefind;
          setReady(true);
        }
      }, 100);
      return () => clearInterval(poll);
    }

    const s = document.createElement("script");
    s.src = "/pagefind/pagefind.js";
    s.dataset.pagefind = "true";
    s.onload = () => {
      const poll = setInterval(() => {
        if ((window as any).pagefind) {
          clearInterval(poll);
          pfRef.current = (window as any).pagefind;
          setReady(true);
        }
      }, 100);
    };
    document.head.appendChild(s);
  }, []);

  /* ---- Ctrl+K ---- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(v => { if (!v) { setQuery(""); setResults([]); } return !v; });
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
    if (!pfRef.current || !query.trim()) { setResults([]); setActive(0); return; }
    let cancel = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await pfRef.current.search(query.trim());
        const data = await Promise.all(r.results.slice(0, 15).map((x: any) => x.data()));
        if (!cancel) { setResults(data); setActive(0); }
      } catch { if (!cancel) setResults([]); }
      finally { if (!cancel) setLoading(false); }
    }, 200);
    return () => { cancel = true; clearTimeout(t); };
  }, [query]);

  const close = useCallback(() => { setOpen(false); setQuery(""); setResults([]); }, []);
  const go = useCallback((url: string) => { close(); window.location.href = url; }, [close]);

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div style={s.dialog}>
        <div style={s.inputRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input ref={inputRef} type="text" placeholder={ready ? "搜索文档..." : "加载索引中..."} value={query} onChange={e => setQuery(e.target.value)} style={s.input} autoComplete="off" spellCheck={false} disabled={!ready} />
          <kbd style={s.kbd}>Esc</kbd>
        </div>
        <ul style={s.results}>
          {!ready ? <li style={s.empty}>加载搜索索引中...</li>
          : !query.trim() ? <li style={s.empty}>输入关键词搜索</li>
          : loading ? <li style={s.empty}>搜索中...</li>
          : results.length === 0 ? <li style={s.empty}>未找到「{query.trim()}」的结果</li>
          : results.map((item, i) => (
              <li key={item.url + i}>
                <button type="button" onClick={() => go(item.url)} onMouseEnter={() => setActive(i)}
                  style={{ ...s.btn, background: i === active ? "var(--color-surface-2)" : "transparent" }}>
                  <span style={s.title}>{item.meta?.title || item.url}</span>
                  {item.excerpt && <span style={s.excerpt}>{item.excerpt.replace(/<[^>]+>/g, "").trim()}</span>}
                  <span style={s.url}>{item.url}</span>
                </button>
              </li>
            ))}
        </ul>
        <div style={s.footer}>
          <span><kbd style={s.fk}>↑↓</kbd> 导航</span>
          <span><kbd style={s.fk}>↵</kbd> 打开</span>
          <span><kbd style={s.fk}>Esc</kbd> 关闭</span>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "min(20vh, 120px)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" },
  dialog: { width: "min(620px, calc(100vw - 2rem))", maxHeight: "min(520px, 72vh)", display: "flex", flexDirection: "column", borderRadius: 12, border: "1px solid var(--color-surface-3)", background: "var(--color-surface)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden" },
  inputRow: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--color-surface-2)" },
  input: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: "var(--color-ink)" },
  kbd: { flexShrink: 0, display: "inline-flex", alignItems: "center", height: 22, padding: "0 6px", borderRadius: 4, border: "1px solid var(--color-surface-3)", background: "var(--color-surface-2)", color: "var(--color-dim)", fontSize: 11, fontFamily: "var(--font-mono)" },
  results: { flex: 1, overflowY: "auto", padding: 6, margin: 0, listStyle: "none" },
  empty: { padding: "40px 16px", textAlign: "center", color: "var(--color-dim)", fontSize: 14 },
  btn: { display: "flex", flexDirection: "column", gap: 4, width: "100%", padding: "10px 12px", borderRadius: 6, border: "none", cursor: "pointer", textAlign: "left", color: "var(--color-ink)", fontSize: 14, transition: "background 120ms ease" },
  title: { fontWeight: 600, fontSize: "0.9rem" },
  excerpt: { fontSize: "0.8rem", color: "var(--color-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  url: { fontSize: "0.7rem", color: "var(--color-dim)", fontFamily: "var(--font-mono)" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderTop: "1px solid var(--color-surface-2)", fontSize: "0.7rem", color: "var(--color-dim)" },
  fk: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, padding: "0 4px", borderRadius: 4, border: "1px solid var(--color-surface-3)", background: "var(--color-surface-2)", fontFamily: "var(--font-mono)", fontSize: 10 },
};
