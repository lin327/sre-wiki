# archive

`archive/` 不参与站点构建，也不进入搜索索引或 sitemap。根目录 `.dockerignore` 排除了 `archive/`，避免这些文件进入镜像构建上下文。

Astro 只编译 `src/pages/`。本目录放在仓库根下，Pagefind 与 sitemap 都基于构建产物，因此这里的文件不会被发布。

## legacy-pages/placeholders

这一批从 `7a278f00f28eb2c0f5b0e7c9c0e8fa7df414db9f`（`feat(wiki): 写入 linux 文章 domain/type（第 4 批）`）移出。

- 447 个文件，原路径是 `src/pages/<slug>.mdx`，对应站点根路由 `/<slug>`。
- 正文基本是「内容待补充。」。不是分类目录中的种子页，也不是 `src/pages/en/` 或待整理分类文章。
- 使用 `git mv` 保留历史。文件内容没有改写，包括移动前的 `layout` 相对路径。

旧 URL 由 `nginx/legacy-redirects.map` 精确匹配后返回 410 Gone（带与不带结尾斜杠各一条，不用前缀）。`/SLI` 与 `/SLO` 原先会内部改写到 `/sli` 与 `/slo`；这两页已在本批中归档。nginx 的 `map` 查找不区分大小写，因此 `/sli` 与 `/slo` 两条也覆盖原来的大写别名，不再单独改写。

这些文件保留约 2 个月，供核对历史。到期后再决定是否删除。

不得把本目录文件原样移回 `src/pages/` 当作线上内容。`layout` 等相对路径按归档前的位置书写，直接回迁不能恢复为可发布页面。若某个主题仍要上线，应重新审核后写入对应分类目录。
