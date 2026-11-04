# SRE Atlas 内容契约

本文件是 Wiki 内容契约的唯一规范；根目录 CONTENT_CONTRACT.md 只提供入口。字段定义以 `src/lib/frontmatter.schema.json` 为准，正文与路由校验由 `src/lib/publish-contract.mjs` 执行。

## 1. 分类、字段与命名

- domain 封闭枚举：`observability / kubernetes / container-runtime / docker / linux / iac / security / chaos-engineering / ai / tbd`。etcd 归 kubernetes；container-runtime 与 docker 独立。tbd 仅供未定草稿，不能精选。
- type 封闭枚举：`concept / guide / runbook / incident / architecture / comparison / news`。不得继续输出旧 fundamental。
- 必填：非空 title、带引号的 YYYY-MM-DD created/updated、sources（HTTP(S) 的 {url,title} 列表）、布尔 canonical、domain、type、confidence（high/medium/low）、字符串列表 tags。description 可选。
- reviewed（布尔）、reviewed_by（非空字符串）、reviewed_at（有效 YYYY-MM-DD 字符串）是合法字段；canonical 为 true 时必填且 reviewed 必须为 true。不根据采集成功或模型置信度伪造审校字段。
- category 已 deprecated，作为可选兼容字段保留；新稿可以省略。提供时须为七个路径分类之一，且发布时必须与目录一致。列表的路径分类来自目录，不信任历史脏 category；本轮不重构栏目或 URL。domain/type 是内容语义字段。
- 发布目录固定为 `src/pages/{linux,docker,kubernetes,runbooks,architectures,incidents,comparisons}/`，英文文章位于 `src/pages/en/<category>/`。runbooks、architectures 使用复数。
- 新文章文件名为 .mdx，slug 为 4–60 位小写 ASCII 字母/数字/连字符，首尾须为字母或数字，以 schema 的 $defs.slug 为准。不批量改历史 URL。

## 2. 精选发布门禁

canonical: true 表示人工纳入精选，不是 SEO canonical URL 或访问权限。新增发布文章、已有草稿晋升，以及修改后的精选文章都必须通过：

1. 完整 frontmatter schema；domain 不能为 tbd，type 在封闭枚举内。
2. reviewed: true、非空 reviewed_by、有效日期 reviewed_at。
3. frontmatter 之后的正文有效字符不少于 800，按去除空白后的 Unicode 码点计数；不得包含“内容待补充”。规则取自 schema 的 $defs.canonicalBody。
4. layout 固定为相对路径指向 src/layouts/BaseLayout.astro，不能使用模型指定的任意布局。
5. wikilink 必须可解析，缺失、歧义、路径穿越均拒绝；新稿推荐 [[category/slug]]，无分类 slug 仅在全站唯一时可用。
6. 可执行 MDX 节点被 CLI 拒绝；仅保留脚本中明确列出的已有组件页。审核不免除 MDX 安全门禁。

### 冻结种子迁移例外

验收基线 commit 为 598d32f04edd276a6501046275eb0c512a03afaa。其 20 篇中文种子的路径与原文件 SHA256 固定在 src/lib/legacy-canonical-baseline.json。它们缺少新元数据/审校信息，不能伪造人工审核。**仅非新增且文件字节完全不变时告警兼容**；CI 全量扫描会逐篇告警。任何改动、复制为新稿或新增文件都必须通过完整门禁，不得仅凭路径或 isNew=false 绕过。不得自动刷新该清单来使校验变绿；迁移须单独人工审校。另在同一基线冻结了 src/inbox/linux/index.mdx 的哈希：它是历史索引资料，非合规新草稿，只在字节不变且 canonical: false 时告警保留；任何修改需补齐草稿 schema。

分类 index.mdx、手写 Astro 路由及 about/privacy 等说明页不按“文章 800 字”判定，但仍遵守其适用的布局/MDX 安全检查。其余未修改的历史非精选内容保留迁移兼容；原 wikilink 问题仅告警。

2026-11-04 处置：两篇事故种子与英文镜像、旧 inbox 索引已移至 archive/frozen-20261104/，原字节与基线哈希保留；当前发布树剩 18 篇冻结精选告警。基线 JSON 不因归档而刷新。复审决定和未验证边界见 [冻结处置台账](./frozen-content-2026-11-04.md)；台账不等于人工审校通过。

## 3. 草稿与 Agent 边界

- Agent 默认输出 output/inbox/<category>/<slug>.mdx，强制 canonical: false；PUBLISH_CANONICAL=true 仅改变输出目录，不代表通过人工审核。
- Wiki 通过人工/PR 接收至 src/inbox/，不能用 src/pages/inbox/。Wiki CI 校验 src/inbox/**/*.mdx 的同一 schema，拒绝缺 domain/type 或 canonical 不为 false；tbd 只允许留在草稿。
- Agent 的 output/inbox/ 在姊妹仓，不谎称 Wiki CI 会读取仓外目录。Agent 的 schema 副本需在该仓独立同步，不在运行时跨仓读取。
- 审校通过才移动到公开分类并设 canonical: true，补齐真实审校证据。GitHub Issue/PR 复述默认只作资料。

## 4. 发现策略与交付

- Pagefind 与 sitemap 共用 src/lib/discovery-policy.mjs：只发现严格 canonical: true 的 MDX 及明确保留的手写索引、首页、about/privacy。
- src/pages 是公开路由，非精选仍可能直达；src/inbox 与 archive 不参与构建/索引。归档旧 URL 由 nginx 精确返回 410，不能用 preview 冒充 nginx 验收。
- npm run build 包含 Astro 构建和 Pagefind。静态 nginx 交付；赞助配置在构建时生效。推 GHCR 不等于更新服务器。

## 5. CI 与复核命令

- npm test：包含原验收五探针、元数据/正文边界、已有稿晋升与冻结例外回归。
- node scripts/check-safe-mdx.mjs --all：全量当前 pages 与 inbox，避免未修改文件或已有文件晋升绕过。
- node scripts/check-safe-mdx.mjs --base <sha> --head <sha>：另查新增/变更页面；新增文章必须精选。两个门禁均由 CI 执行，不能互相替代。
- npm run build：构建与索引；Playwright 的仓内命令 npm run test:e2e 独立复核，未声称本 CI 已执行 E2E。

## 6. 版本

- 2026-09-28：domain/type 枚举冻结；当时的 516 篇盘点见 docs/content-triage.md，是历史记录，不是当前发布量。
- 2026-11-04：统一契约入口、schema 与 CI，落实审校、正文、晋升门禁；category 改为显式可选兼容字段；把历史例外缩为 20 篇字节冻结种子。原有内容、URL 与发现策略不变。
