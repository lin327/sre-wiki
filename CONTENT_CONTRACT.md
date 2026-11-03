# SRE Atlas 内容契约

本文件是契约入口，唯一规范见 [docs/CONTENT_CONTRACT.md](docs/CONTENT_CONTRACT.md)。不在此维护第二套枚举或发布门槛。

- 机器字段：`src/lib/frontmatter.schema.json`。
- 发布校验：`src/lib/publish-contract.mjs`；CLI/CI：`node scripts/check-safe-mdx.mjs --all` 及 `--base <sha> --head <sha>`。
- 冻结种子迁移例外：`src/lib/legacy-canonical-baseline.json`，仅字节一致、非新增的 20 篇旧种子告警兼容；禁止自动扩充来绕过审核。
- Agent 的 `output/inbox/` 与 Wiki 的 `src/inbox/` 通过人工审核/PR 交接，未见自动同步。推 GHCR 镜像不等于现网已更新。
