# 未审核草稿

Agent 草稿由人工通过 PR 放到此目录，保持 `canonical: false`。
这里位于 `src/pages/` 之外，Astro 不会为 `.md` / `.mdx` 文件生成公开路由，也不会进入 sitemap 或 Pagefind。
审核通过后才放入对应的 `src/pages/<category>/`，并标记 `canonical: true`；不要使用 `src/pages/inbox/`。
