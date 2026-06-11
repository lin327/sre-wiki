import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  PagefindSearch — Ctrl+K command palette powered by Pagefind       */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    pagefind?: {
      search: (query: string) => Promise<{ results: PagefindResult[] }>;
      options: (opts: Record<string, unknown>) => void;
    };
  }
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface PagefindResultData {
  url: string;
  meta: { title?: string; section?: string };
  excerpt: string;
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Styles — all values pulled from design-system.css tokens          */
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
    WebkitBackdropFilter: "blur(8px)",
  },

  dialog: {
    width: "min(620px, calc(100vw - 2rem))",
    maxHeight: "min(520px, 72vh)",
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: "var(--radius-xl, 12px)",
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
    fontFamily: "var(--font-sans)",
  },

  kbd: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 22,
    padding: "0 6px",
    borderRadius: "var(--radius-sm, 4px)",
    border: "1px solid var(--color-surface-3)",
    background: "var(--color-surface-2)",
    color: "var(--color-dim)",
    fontSize: 11,
    fontWeight: 500,
    lineHeight: "20px",
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
    borderRadius: "var(--radius-md, 6px)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
    color: "var(--color-ink)",
    fontSize: 14,
    fontFamily: "var(--font-sans)",
    transition: "background 120ms ease",
  },

  resultTitle: {
    fontWeight: 600,
    fontSize: "0.9rem",
    lineHeight: 1.4,
  },

  resultExcerpt: {
    fontSize: "0.8rem",
    color: "var(--color-muted)",
    lineHeight: 1.5,
    display: "-webkit-box" as const,
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },

  resultMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  resultUrl: {
    fontSize: "0.7rem",
    color: "var(--color-dim)",
    fontFamily: "var(--font-mono)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    maxWidth: 280,
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

  footerKbd: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },

  footerKey: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18,
    height: 18,
    padding: "0 4px",
    borderRadius: "var(--radius-sm, 4px)",
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
  const [pagefindReady, setPagefindReady] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pagefindRef = useRef<typeof window.pagefind>(null);

  /* ---- Load Pagefind on mount via script tag ---- */
  useEffect(() => {
    // Already loaded from a previous mount
    if (window.pagefind) {
      pagefindRef.current = window.pagefind;
      setPagefindReady(true);
      return;
    }

    // Avoid injecting duplicate script tags
    if (document.querySelector('script[data-pagefind]')) {
      const check = setInterval(() => {
        if (window.pagefind) {
          clearInterval(check);
          pagefindRef.current = window.pagefind;
          setPagefindReady(true);
        }
      }, 50);
      return () => clearInterval(check);
    }

    const script = document.createElement("script");
    script.src = "/pagefind/pagefind.js";
    script.dataset.pagefind = "true";
    script.addEventListener("load", () => {
      window.pagefind?.options({ excerptLength: 40 });
      pagefindRef.current = window.pagefind ?? null;
      setPagefindReady(true);
    });
    script.addEventListener("error", () => {
      // Pagefind not available (dev mode without built index)
    });
    document.head.appendChild(script);
  }, []);

  /* ---- Global Ctrl+K shortcut ---- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setQuery("");
            setResults([]);
          }
          return !prev;
        });
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ---- Focus input when dialog opens ---- */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* ---- Search on query change (debounced) ---- */
  useEffect(() => {
    if (!pagefindRef.current) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const search = await pagefindRef.current!.search(trimmed);
        const data = await Promise.all(
          search.results.slice(0, 20).map((r) => r.data())
        );
        if (!cancelled) {
          setResults(data);
          setActiveIndex(0);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setActiveIndex(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  /* ---- Scroll active result into view ---- */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* ---- Handlers ---- */
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  const navigateTo = useCallback(
    (url: string) => {
      close();
      window.location.href = url;
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[activeIndex]) navigateTo(results[activeIndex].url);
          break;
      }
    },
    [close, results, activeIndex, navigateTo]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) close();
    },
    [close]
  );

  /* ---- Helpers ---- */
  function cleanExcerpt(html: string): string {
    return html.replace(/<[^>]+>/g, "").trim();
  }

  function cleanUrl(url: string): string {
    return url.replace(/^\/|\/$/g, "").replace(/\.html?$/i, "") || "/";
  }

  /* ---- Render ---- */
  if (!open) return null;

  return (
    <div style={css.overlay} onClick={handleBackdropClick} role="presentation">
      <div
        style={css.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={handleKeyDown}
      >
        {/* Input row */}
        <div style={css.inputRow}>
          {/* Search icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-dim)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={pagefindReady ? "Search documentation..." : "Loading search index..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={css.input}
            autoComplete="off"
            spellCheck={false}
            disabled={!pagefindReady}
          />
          <kbd style={css.kbd}>Esc</kbd>
        </div>

        {/* Results */}
        <ul ref={listRef} style={css.results} role="listbox" aria-label="Search results">
          {!pagefindReady ? (
            <li style={css.empty}>Loading search index...</li>
          ) : !query.trim() ? (
            <li style={css.empty}>Type to search across all pages.</li>
          ) : loading ? (
            <li style={css.empty}>Searching...</li>
          ) : results.length === 0 ? (
            <li style={css.empty}>No results found for &ldquo;{query.trim()}&rdquo;</li>
          ) : (
            results.map((item, i) => {
              const isActive = i === activeIndex;
              const excerpt = cleanExcerpt(item.excerpt);
              return (
                <li key={item.url + i} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.url)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      ...css.resultBtn,
                      background: isActive
                        ? "var(--color-surface-2)"
                        : "transparent",
                    }}
                  >
                    <span style={css.resultTitle}>
                      {item.meta.title || cleanUrl(item.url)}
                    </span>
                    {excerpt && (
                      <span style={css.resultExcerpt}>{excerpt}</span>
                    )}
                    <span style={css.resultMeta}>
                      <span style={css.resultUrl}>{cleanUrl(item.url)}</span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer */}
        <div style={css.footer}>
          <span style={css.footerKbd}>
            <span style={css.footerKey}>↑↓</span> Navigate
          </span>
          <span style={css.footerKbd}>
            <span style={css.footerKey}>↵</span> Open
          </span>
          <span style={css.footerKbd}>
            <span style={css.footerKey}>Esc</span> Close
          </span>
        </div>
      </div>
    </div>
  );
}
