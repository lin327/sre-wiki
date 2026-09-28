# SRE Atlas 内容契约

本契约冻结 Wiki 与 Agent 之间的内容分类、精选门禁及迁移兼容规则。枚举值区分大小写；机器校验必须使用下列拼写。

## 1. domain：封闭枚举

frontmatter 的 domain 只能使用以下 10 个值：

| domain | 含义与盘点基线 |
|---|---|
| observability | 可观测性（指标、日志、追踪、告警；Grafana、Prometheus 等），264 篇 |
| kubernetes | Kubernetes 平台（调度、网络、存储、版本特性），并包含 etcd 相关内容 21 篇，共 83 篇 |
| container-runtime | 容器运行时（containerd、crictl、runc、snapshotter、overlayfs、shim），23 篇 |
| docker | Docker 引擎与生态（独立领域），3 篇 |
| linux | Linux 内核与发行版（cgroup、BPF、AppArmor、SELinux、syscall），9 篇 |
| iac | 基础设施即代码（Terraform、Packer、HCP），7 篇 |
| security | 安全（供应链安全、CVE、Vault、IAM、零信任），25 篇 |
| chaos-engineering | 混沌工程（Chaos Mesh），15 篇 |
| ai | AI 与 SRE 交叉（AI 代理、AI 基础设施、AI 运营），9 篇 |
| tbd | 过渡值，仅用于人工复核中的未定稿；不可用于 canonical |

本次盘点的 516 篇按 domain 汇总：observability 264、kubernetes 83、container-runtime 23、docker 3、linux 9、iac 7、security 25、chaos-engineering 15、ai 9、tbd 78。kubernetes 的 83 篇由 Kubernetes 平台 62 篇和 etcd 相关内容 21 篇组成；container-runtime 单独计数。

## 2. type：封闭枚举

frontmatter 的 type 只能使用以下 7 个值：

| type | 含义 |
|---|---|
| concept | 概念讲解 |
| guide | 实践指南或案例 |
| runbook | 操作手册或排障步骤 |
| incident | 事故复盘或事件分析 |
| architecture | 架构说明或设计 |
| comparison | 对比选型 |
| news | 版本发布、会议回顾或 CVE 通告 |

现有目录的类型迁移映射：

| 当前路径 | type |
|---|---|
| src/pages/runbooks/ | runbook |
| src/pages/incidents/ | incident |
| src/pages/architectures/ | architecture |
| src/pages/comparisons/ | comparison |

src/pages/linux/、src/pages/docker/、src/pages/kubernetes/ 下文章的 type 按正文内容判定，多为 concept、guide 或 news；domain 按本契约第 1 节判定。

## 3. 精选门禁

当 frontmatter 设置 canonical: true 时，CI 必须执行以下校验：

1. domain 必须属于第 1 节枚举且不能为 tbd；type 必须属于第 2 节枚举。
2. 正文不得包含“内容待补充”，且 frontmatter 之后的正文有效字符数不少于 800（不计空白字符）。
3. 内链检查通过，不能有坏链。
4. 必须包含人工审校标记：reviewed: true、非空 reviewed_by、YYYY-MM-DD 格式的 reviewed_at。

现有 20 篇 canonical: true 种子页需限期补齐第 4 项。迁移期限内暂不因缺少审校字段阻断这些种子页，但 CI 必须告警；超过期限仍未补齐时继续告警。新晋升的精选页必须满足全部门禁。

## 4. URL 与旧字段

- 不搬迁、不改名；domain 和 type 只写入 frontmatter，公开 URL 保持不变。
- category 字段标记为 deprecated：新内容不得写入 category；索引不再读取 category；已有历史脏值保持原样。
- 分类页与索引优先读取 frontmatter 的 domain 和 type；字段缺失时回退到路径映射。路径映射是迁移兼容逻辑，不得覆盖已填写的 domain 或 type。

## 5. Agent 协同

- Agent 仓库的新稿分类逻辑必须输出符合第 1、2 节封闭枚举的 domain 和 type。
- Agent 新稿仍进入 output/inbox/，不因此自动晋升或发布。
- Wiki CI 对 output/inbox/ 中缺少 domain 或 type 的新稿必须报错并拒绝通过；domain 为 tbd 的稿件只能保留为人工复核草稿，不能设为 canonical: true。

## 6. 版本

- 本契约依据 docs/content-triage.md（516 篇盘点）冻结。
- 冻结日期：2026-09-28。
- 后续修改 domain、type、门禁或映射规则，必须重新评审并更新本契约版本记录。
