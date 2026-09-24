# SRE Atlas 内容契约

## 目录与命名

- 发布分类固定为 `linux`、`docker`、`kubernetes`、`runbooks`、`architectures`、`incidents`、`comparisons`，位于 `src/pages/`。
- `runbooks`、`architectures` 必须使用复数；Agent 的旧分类名 `runbook`、`architecture` 在发布前映射到对应复数。
- 新内容 slug 必须匹配 `^[a-z0-9-]{4,60}$`：4–60 位小写英文字母、数字或连字符；文件扩展名为 `.mdx`。不因历史文件不符合命名规范而删除它们。
- 中文为默认语言，技术术语和命令保留英文；本次不改英文内容。

## 精选与待整理

- `canonical: true` 表示已纳入精选，不是 SEO canonical URL；本次仅给明确列出的 20 篇种子正文及 7 个分类索引添加此字段，种子正文保持原样。
- `canonical: false` 或缺少该字段的内容均视为待整理；置信度、更新时间、标题或 slug 长短不能替代审核。
- GitHub Issue 复述、flaky test、局部 UI 修复等材料默认不上线。采集成功或模型生成成功不等于可发布。
- 新 Agent 草稿的目标是仅进入 inbox，并带 `canonical: false`；审核通过后再进入对应发布分类。Wiki 接收目录约定为 `src/inbox/`，不使用 `src/pages/inbox/`，避免 Astro 自动生成公开路由。
- 人工审核需核对来源、适用版本、技术步骤和主题归属；通过后才可标记为精选。

## 当前过渡边界

- 本次采用索引分层，不批量删除、搬迁或重写已有 MDX，也没有实现全站构建过滤。历史待整理页面仍可直接访问，并仍可能被 sitemap、Pagefind 收录。
- Linux 的实际列表由 `src/pages/linux/index.astro` 和 `src/pages/linux/page/[page].astro` 生成，统一读取 frontmatter：精选优先，再按标题与 slug 排序，排序后分页；所有条目显示“精选”或“待整理”。
- 其余分类仍保留静态 `index.mdx` 清单，按对应页面的 frontmatter 分为“精选”和“待整理”。变更内容标记或新增页面时须同步维护清单；清单并不代表目录中的全部历史内容。
- 侧栏现有“查看全部”入口指向这些带警告的分类列表，首页与侧栏种子入口保持不变。
- Agent 目前仍输出到自身 `output/<category>/`；inbox 输出约束、人工审核发布流程和全站过滤尚待实现。本契约规定目标，不代表这些机制已经生效。
