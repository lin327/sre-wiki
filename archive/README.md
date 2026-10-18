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

## legacy-pages/en

这一批从 `d247101eec1bc44bc10377c8717f511491d735d6`（`Merge pull request #1 from lin327/archive/placeholders-447`）移出。

- 486 个文件，原路径是 `src/pages/en/<category>/<slug>.mdx`，对应站点路由 `/en/<category>/<slug>`。
- 这些英文页是对应舍弃页或素材页的机翻镜像，或尚未与中文精选页配对的页面，不上线。
- 使用 `git mv` 保留历史。文件内容没有改写，包括移动前的 `layout` 相对路径。
- 20 个种子英文镜像仍留在 `src/pages/en/`，不在本目录。第 4 波会在对应中文页修订后重译，而不是从这里回迁。

本目录与 `archive/` 的其余文件一样，不参与站点构建，也不进入搜索索引或 sitemap。

旧 URL 由 `nginx/legacy-redirects.map` 精确匹配后返回 410 Gone（带与不带结尾斜杠各一条，不用前缀）。本批 slug 都是小写 ASCII，没有中文或百分号字符，也没有与种子英文页或上一批根路由在大小写折叠后冲突的键。nginx 的 `map` 查找不区分大小写，因此没有另写大小写变体；请求里的百分号编码会先被解码成 `$uri` 再查表，与上一批相同。

这些文件保留约 2 个月，供核对历史。到期后再决定是否删除。

不得把本目录文件原样移回 `src/pages/en/` 当作线上内容。`layout` 等相对路径按归档前的位置书写，直接回迁不能恢复为可发布页面。若某个主题仍要上线，应在中文修订后重新翻译。

## legacy-pages/material

这一批从 `7316d49de60d079dc3cc568960c1f1ee9e8b3f83`（`Merge pull request #2 from lin327/archive/en-pages-486`）移出。

- 193 个文件，原路径是 `src/pages/<category>/<slug>.mdx`，对应站点路由 `/<category>/<slug>`。
- 这些页面是「zh_待整理」中的素材，只保留为写稿线索，不是可发布正文。
- 评估报告证实其中 Issue 扩写页存在编造指标和 UI 选项。写稿时必须核对来源，不能把文中的数字、界面选项或步骤当成事实。
- 使用 `git mv` 保留历史。文件内容没有改写，包括移动前的 `layout` 相对路径。

本目录与 `archive/` 的其余文件一样，不参与站点构建，也不进入搜索索引或 sitemap。

旧 URL 由 `nginx/legacy-redirects.map` 精确匹配后返回 410 Gone（带与不带结尾斜杠各一条，不用前缀）。中文路径按解码后的 `$uri` 书写。nginx 的 `map` 查找不区分大小写；本批键与已有键、保留页 URL 在大小写折叠后没有冲突。本批最长键为 113 字节，`map_hash_bucket_size 256` 仍然够用。键总数变为 2898 后，`map_hash_max_size 4096` 无法建成最优哈希，已调到 8192。

这些文件保留约 2 个月，供核对历史。到期后再决定是否删除。

不得把本目录文件原样移回 `src/pages/` 当作线上内容。`layout` 等相对路径按归档前的位置书写，直接回迁不能恢复为可发布页面。若某个主题仍要上线，应重新核对来源后另写。

## legacy-pages/dropped

这一批从同一提交 `7316d49de60d079dc3cc568960c1f1ee9e8b3f83`（`Merge pull request #2 from lin327/archive/en-pages-486`）移出。

- 323 个文件，原路径是 `src/pages/<category>/<slug>.mdx`，对应站点路由 `/<category>/<slug>`。
- 这些页面是「zh_待整理」中决定舍弃的条目，不上线。
- 使用 `git mv` 保留历史。文件内容没有改写，包括移动前的 `layout` 相对路径。

本目录与 `archive/` 的其余文件一样，不参与站点构建，也不进入搜索索引或 sitemap。

旧 URL 由 `nginx/legacy-redirects.map` 精确匹配后返回 410 Gone（带与不带结尾斜杠各一条，不用前缀）。中文路径按解码后的 `$uri` 书写。与素材页一起检查过：大小写折叠后没有与已有键或保留页 URL 冲突。哈希桶大小与 `map_hash_max_size` 的调整见上一节。

这些文件保留约 2 个月，供核对历史。到期后再决定是否删除。

不得把本目录文件原样移回 `src/pages/` 当作线上内容。`layout` 等相对路径按归档前的位置书写，直接回迁不能恢复为可发布页面。
