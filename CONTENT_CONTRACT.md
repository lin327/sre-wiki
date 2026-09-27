# SRE Atlas 内容契约

## 目录与命名

- 发布分类固定为 `linux`、`docker`、`kubernetes`、`runbooks`、`architectures`、`incidents`、`comparisons`，位于 `src/pages/`。
- `runbooks`、`architectures` 必须使用复数；Agent 的旧分类名 `runbook`、`architecture` 在发布前映射到对应复数。
- 新内容 slug 必须匹配 `^[a-z0-9-]{4,60}$`：4–60 位小写英文字母、数字或连字符；文件扩展名为 `.mdx`。不因历史文件不符合命名规范而删除它们。
- 中文为默认语言，技术术语和命令保留英文；本次不改英文内容。

## 新草稿 frontmatter v1

- 字段定义以 Wiki 的 `src/lib/frontmatter.schema.json` 为准；Agent 独立仓库保留字节一致的 `config/frontmatter.schema.json` 副本。修改契约时须同步两份并验证一致，不依赖运行时跨仓库读取。
- 必填：非空 `title`、`created` / `updated`（带引号的 `YYYY-MM-DD`）、`sources`（仅 HTTP(S) 的 `{url, title}` 对象列表）、布尔 `canonical`、七类之一的 `category`、`type`、`confidence`、字符串列表 `tags`；`description` 可选。
- `type` 使用 `concept / fundamental / runbook / architecture / incident / comparison`；`confidence` 使用 `high / medium / low`。slug 取文件名，4–60 位 `[a-z0-9-]` 且首尾为字母或数字，不另写易与碰撞改名冲突的 slug 字段。
- Agent 先规范化、再按该 schema 校验并 dump YAML：模型的 `canonical` 一律改为 `false`，分类以采集配置/分类器为准，保留采集来源；`lastUpdated` 转为 `updated`，缺失或无效日期使用 UTC 生成日期，`created` 缺失时取 `updated`；未知字段不透传。
- 严格 schema 用于新草稿。历史页只在读取时兼容 `lastUpdated` 和旧 sources，缺日期不伪造日期；分类归属由所在目录决定，不批量改 frontmatter 或正文。标为精选、放入发布目录仍须人工审核。

## 精选与待整理

- `canonical: true` 表示已纳入精选，不是 SEO canonical URL；本次仅给明确列出的 20 篇种子正文及 7 个分类索引添加此字段，种子正文保持原样。
- `canonical: false` 或缺少该字段的内容均视为待整理；置信度、更新时间、标题或 slug 长短不能替代审核。
- GitHub Issue 复述、flaky test、局部 UI 修复等材料默认不上线。采集成功或模型生成成功不等于可发布。
- 新 Agent 草稿默认写入 Agent 仓库的 `output/inbox/<category>/`，并强制写 `canonical: false`。`PUBLISH_CANONICAL=true` 仅跳过 inbox 层、改写到 `output/<category>/`，生成页仍为 `canonical: false`，不能代替人工审核。
- Wiki 接收未审核稿的目录约定为 `src/inbox/`，由人工通过 PR 放入；不使用 `src/pages/inbox/`，避免 Astro 自动生成公开路由。审核通过后才进入对应发布分类。
- 人工审核需核对来源、适用版本、技术步骤和主题归属；通过后才可标记为精选。

## 当前过渡边界

- **发现通道过滤已生效，文件尚未搬迁**：sitemap 与 Pagefind 共用 `src/lib/discovery-policy.mjs` 的路由集合，只收录严格的 `canonical: true` 及明确保留的首页、about/privacy。`false`、缺字段或字符串 `"true"` 不算精选；历史 MDX 仍构建为可访问页面，不批量删除、搬迁或重写。
- Pagefind 只索引上述页面的主内容，分类列表中指向非精选页面的链接不参与索引。分类列表和历史地址仍可浏览；这不是页面访问限制，也不等于站外搜索引擎已删除历史收录。
- Linux 的实际列表由 `src/pages/linux/index.astro` 和 `src/pages/linux/page/[page].astro` 生成，统一读取 frontmatter：精选优先，再按标题与 slug 排序，排序后分页；所有条目显示“精选”或“待整理”。
- 其余六类的 `index.mdx` 共用动态列表，构建时扫描对应目录 MDX，读取 frontmatter 后按精选优先、标题、slug 排序；变更标题/标记或新增页面后重新构建即可，无需手改索引清单。列表仍显示待整理警告，`src/inbox/` 不参与扫描。
- 侧栏现有“查看全部”入口指向这些带警告的分类列表，首页与侧栏种子入口保持不变。
- Agent 的默认 inbox 输出已实现；采集 CI 暂停 schedule，仅手动触发并上传 inbox artifact。SQLite 已通过 cache/artifact 持久化，重复运行依赖最新 DB 成功恢复。
- 当前没有自动同步 Wiki 的链路，内容采用人工审核/PR 流程；Wiki CI 仅构建并推送镜像，不自动更新服务器。本次不阻止历史页直接访问。
