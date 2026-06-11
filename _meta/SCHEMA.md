# SCHEMA.md

标签体系 + 写作规范文档

---

## Domain

云原生 / DevOps / SRE 运维知识库，覆盖 Linux → Docker → Kubernetes 全链路

---

## Conventions

- 文件名：小写，连字符分隔，无空格（如 `pod-lifecycle.md`）
- 每个 wiki 页面必须有 YAML frontmatter
- 使用 `[[slug]]` 或 `[[slug|中文名]]` 链接页面
- 每个页面至少 2 个 `[[wikilinks]]` 出站链接
- 更新页面时必须 bump `updated` 日期
- 每个操作必须追加到日志

---

## Frontmatter 格式

```yaml
---
title: "页面标题（中文描述 + 英文术语）"
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: concept | runbook | architecture | incident | comparison | fundamental
tags: [from taxonomy below]
sources: [url1, url2]
confidence: high | medium | low
---
```

---

## Tag Taxonomy（完整标签体系）

### 技术栈层级（layer/）

| Tag | 说明 |
|-----|------|
| `layer/kernel` | Linux 内核 |
| `layer/filesystem` | 文件系统 |
| `layer/process` | 进程模型 |
| `layer/network-stack` | 网络栈 |
| `layer/systemd` | 服务管理 |
| `layer/l4-network` | 传输层 |
| `layer/dns` | DNS |

### 组件（component/）

| Tag | 说明 |
|-----|------|
| `component/containerd` | 容器运行时 |
| `component/docker-engine` | Docker 引擎 |
| `component/network-overlay` | 覆盖网络 |
| `component/storage-driver` | 存储驱动 |
| `component/control-plane` | K8s 控制面 |
| `component/data-plane` | K8s 数据面 |
| `component/networking` | K8s 网络 |
| `component/storage` | K8s 存储 |
| `component/security` | 安全 |
| `component/observability` | 可观测性 |
| `component/cicd` | CI/CD |
| `component/infrastructure` | 基础设施 |

### 工具（tool/）

| Tag | 说明 |
|-----|------|
| `tool/iptables` | iptables |
| `tool/nftables` | nftables |
| `tool/perf` | 性能工具 |

### 模式（pattern/）

| Tag | 说明 |
|-----|------|
| `pattern/compose` | Docker Compose |

### 主题（topic/）

| Tag | 说明 |
|-----|------|
| `topic/concept` | 概念 |
| `topic/troubleshooting` | 排障 |
| `topic/architecture` | 架构 |
| `topic/best-practice` | 最佳实践 |
| `topic/comparison` | 对比 |
| `topic/incident` | 故障案例 |
| `topic/performance` | 性能优化 |
| `topic/security` | 安全 |

### 技术（tech/）

| Tag | 说明 |
|-----|------|
| `tech/kubernetes` | Kubernetes |
| `tech/docker` | Docker |
| `tech/helm` | Helm |
| `tech/prometheus` | Prometheus |
| `tech/grafana` | Grafana |
| `tech/argocd` | ArgoCD |
| `tech/terraform` | Terraform |
| `tech/ansible` | Ansible |
| `tech/etcd` | etcd |
| `tech/envoy` | Envoy |
| `tech/cilium` | Cilium |

### 严重程度（severity/，runbook / incident 专用）

| Tag | 说明 |
|-----|------|
| `severity/p0` | 集群不可用 / 数据丢失 |
| `severity/p1` | 服务降级 / 部分用户受影响 |
| `severity/p2` | 非核心功能异常 |
| `severity/p3` | 告警 / 预警 |

---

## Confidence（独立字段，不属于 tags）

| 值 | 条件 |
|------|------|
| `high` | ≥2 个独立来源交叉验证 |
| `medium` | 单源但来源可靠（官方文档） |
| `low` | Agent 从单篇博客提取，未经交叉验证 |

---

## 语言风格

- 默认语言：中文
- 技术术语保持英文：CrashLoopBackOff、Pod、etcd、Service Mesh 等
- 命令和代码块保持原样

---

## Page Thresholds

| 条件 | 动作 |
|------|------|
| 实体/概念出现在 2+ 个来源中 | 创建页面 |
| 来源提到已有页面覆盖的内容 | 更新页面 |
| 页面超过 200 行 | 拆分为子主题 |

---

## Slug 命名规范

| 分类 | 路径格式 | 示例 |
|------|---------|------|
| Linux | `linux/{concept-name}.md` | `linux/cgroup.md` |
| Docker | `docker/{concept-name}.md` | `docker/storage-driver.md` |
| Kubernetes | `kubernetes/{concept-name}.md` | `kubernetes/pod-lifecycle.md` |
| Runbooks | `runbooks/{fault-name}.md` | `runbooks/pod-crashloop.md` |
| Architectures | `architectures/{solution-name}.md` | `architectures/service-mesh.md` |
| Incidents | `incidents/{fault-name}-{year}.md` | `incidents/etcd-compact-2024.md` |
| Comparisons | `comparisons/{a}-vs-{b}.md` | `comparisons/iptables-vs-nftables.md` |

全局 slug 唯一，不同分类下不能同名。
