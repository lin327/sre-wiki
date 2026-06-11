-- SRE Atlas PostgreSQL Schema
-- Neon SaaS (ap-southeast-1)

-- 采集去重 + 状态追踪
CREATE TABLE IF NOT EXISTS ingested_urls (
    id            BIGSERIAL PRIMARY KEY,
    url           TEXT NOT NULL,
    url_hash      CHAR(64) NOT NULL UNIQUE,      -- SHA-256
    content_hash  BIGINT,                         -- SimHash 64-bit
    source        TEXT NOT NULL,                   -- 'rss:k8s', 'gh:kubernetes/kubernetes', 'doc:sre-book'
    source_type   TEXT NOT NULL CHECK (source_type IN ('rss', 'github', 'doc')),
    title         TEXT,
    raw_content   TEXT,
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','processed','skipped','error','duplicate')),
    error_msg     TEXT,
    fetched_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingested_status ON ingested_urls(status);
CREATE INDEX IF NOT EXISTS idx_ingested_source ON ingested_urls(source, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingested_content_hash ON ingested_urls(content_hash);

-- 生成的 wiki 页面
CREATE TABLE IF NOT EXISTS wiki_pages (
    id              BIGSERIAL PRIMARY KEY,
    ingested_id     BIGINT REFERENCES ingested_urls(id),
    file_path       TEXT NOT NULL UNIQUE,           -- 'wiki/zh/runbooks/xxx.md'
    page_type       TEXT NOT NULL,                   -- 'runbook','architecture','incident','concept','comparison','fundamental'
    confidence      TEXT NOT NULL DEFAULT 'high'
                    CHECK (confidence IN ('high','medium','low')),
    review_status   TEXT NOT NULL DEFAULT 'auto'
                    CHECK (review_status IN ('auto','pending_review','approved','rejected')),
    tags            TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    committed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_wiki_type ON wiki_pages(page_type, created_at DESC);

-- 数据源健康度
CREATE TABLE IF NOT EXISTS source_health (
    source          TEXT PRIMARY KEY,
    last_success    TIMESTAMPTZ,
    consecutive_failures INT NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'healthy'
                    CHECK (status IN ('healthy','degraded','down')),
    last_error      TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
