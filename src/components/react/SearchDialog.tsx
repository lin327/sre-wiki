import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface SearchItem {
  title: string;
  path: string;
  section: string;
}

const ITEMS: SearchItem[] = [
  { title: "进程模型", path: "/linux/process-model", section: "Linux" },
  { title: "文件系统", path: "/linux/filesystem", section: "Linux" },
  { title: "镜像分层", path: "/docker/image-layers", section: "Docker" },
  { title: "Pod 生命周期", path: "/kubernetes/pod-lifecycle", section: "Kubernetes" },
  { title: "CrashLoopBackOff", path: "/runbooks/crashloopbackoff", section: "Runbook" },
  { title: "OOMKilled", path: "/runbooks/oomkilled", section: "Runbook" },
];

const sectionColors: Record<string, string> = {
  Linux: "var(--atlas-primary, #4f6df5)",
  Docker: "var(--atlas-accent, #0db7ed)",
  Kubernetes: "var(--atlas-accent, #326ce5)",
  Runbook: "var(--atlas-warning, #e8a735)",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: "min(20vh, 120px)",
  background: "rgba(0, 0, 0, 0.55)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
};

const dialogStyle: React.CSSProperties = {
  width: "min(560px, calc(100vw - 32px))",
  maxHeight: "min(480px, 70vh)",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  border: "1px solid var(--atlas-border, rgba(0,0,0,0.08))",
  background: "var(--atlas-surface, #ffffff)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
  overflow: "hidden",
};

const inputWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "14px 16px",
  borderBottom: "1px solid var(--atlas-border, rgba(0,0,0,0.08))",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 15,
  lineHeight: "22px",
  color: "var(--atlas-ink, #1a1a1a)",
  fontFamily: "inherit",
};

const kbdStyle: React.CSSProperties = {
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 22,
  padding: "0 6px",
  borderRadius: 4,
  border: "1px solid var(--atlas-border, rgba(0,0,0,0.12))",
  background: "var(--atlas-surface-muted, #f4f4f5)",
  color: "var(--atlas-ink-muted, #71717a)",
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "20px",
  fontFamily: "inherit",
};

const listStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: 6,
  margin: 0,
  listStyle: "none",
};

const emptyStyle: React.CSSProperties = {
  padding: "32px 16px",
  textAlign: "center",
  color: "var(--atlas-ink-muted, #71717a)",
  fontSize: 14,
};

const resultBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  color: "var(--atlas-ink, #1a1a1a)",
  fontSize: 14,
  fontFamily: "inherit",
  transition: "background 120ms ease",
};

const tagStyle = (section: string): React.CSSProperties => ({
  flexShrink: 0,
  padding: "2px 8px",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: "#fff",
  background: sectionColors[section] ?? "var(--atlas-ink-muted, #71717a)",
  lineHeight: "18px",
});

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return ITEMS;
    const q = query.toLowerCase();
    return ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  // Keyboard shortcut: Ctrl+K to open, Escape to close
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) setQuery("");
          return !prev;
        });
      }
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const navigateTo = useCallback(
    (item: SearchItem) => {
      close();
      window.location.href = item.path;
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        navigateTo(results[activeIndex]);
      }
    },
    [close, results, activeIndex, navigateTo]
  );

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) close();
    },
    [close]
  );

  if (!open) return null;

  return (
    <div
      style={overlayStyle}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        style={dialogStyle}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div style={inputWrapperStyle}>
          {/* Search icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--atlas-ink-muted, #71717a)"
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
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={inputStyle}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd style={kbdStyle}>Esc</kbd>
        </div>

        {/* Results list */}
        <ul style={listStyle} role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <li style={emptyStyle}>No results found.</li>
          ) : (
            results.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={item.path} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      ...resultBaseStyle,
                      background: isActive
                        ? "var(--atlas-surface-hover, rgba(0,0,0,0.04))"
                        : "transparent",
                    }}
                  >
                    <span style={{ flex: 1 }}>{item.title}</span>
                    <span style={tagStyle(item.section)}>{item.section}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Trigger button (hidden when dialog is open, but kept in DOM for accessibility) */}
    </div>
  );
}

/**
 * Floating search trigger button.
 * Render this anywhere in the page to open the search dialog.
 * Import alongside SearchDialog and place in the same component tree.
 */
export function SearchTrigger() {
  // Dispatches a synthetic Ctrl+K so the SearchDialog's global listener picks it up
  const handleClick = useCallback(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      })
    );
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open search (Ctrl+K)"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 36,
        padding: "0 14px",
        borderRadius: 8,
        border: "1px solid var(--atlas-border, rgba(0,0,0,0.1))",
        background: "var(--atlas-surface, #ffffff)",
        color: "var(--atlas-ink-muted, #71717a)",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--atlas-primary, #4f6df5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--atlas-border, rgba(0,0,0,0.1))";
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span>Search</span>
      <kbd
        style={{
          ...kbdStyle,
          marginLeft: 4,
        }}
      >
        Ctrl K
      </kbd>
    </button>
  );
}
