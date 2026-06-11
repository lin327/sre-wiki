# SRE Atlas

AI 驱动的运维知识库，覆盖 Linux → Docker → Kubernetes 全链路。

## 定位

**SRE Atlas** 是一个结构化的运维知识图库，目标是：

- **学习路径**：从 Linux 基础到容器化再到编排，覆盖运维工程师成长全链路
- **实战沉淀**：真实故障案例、排障手册、架构设计，而非理论堆砌
- **AI 增强**：Agent 自动从 RSS/GitHub/官方文档采集内容，持续更新
- **知识图谱**：wikilinks 连接相关概念，形成可导航的知识网络

## 技术架构

```mermaid
graph TB
    User[用户浏览器] -->|HTTPS| CF[Cloudflare CDN + DNS]
    CF -->|wiki.tentative.me| Traefik[Traefik Ingress]
    Traefik --> Wiki[Wiki Deployment<br/>nginx:alpine × 2]

    GH[GitHub Actions] -->|Docker build + push| GHCR[GHCR 镜像仓库]
    GHCR -->|kubectl rollout| Wiki

    Agent[sre-atlas-agent<br/>本地 Debian PC] -->|psycopg2| Neon[Neon PostgreSQL<br/>SaaS 512MB]
    Agent -->|RSS/GitHub/Docs| Sources[数据源]
    Agent -->|git push| Repo[sre-wiki 仓库]
    Repo -->|触发| GH

    subgraph "DO Singapore k3s 集群"
        Traefik
        Wiki
        CM[cert-manager]
    end

    subgraph "Tailscale Mesh VPN"
        MC[Mac Mini 本地]
        Bastion[堡垒机 火山云]
        GW[网关 腾讯云]
    end
```

## 技术栈

| 层 | 技术 | 用途 |
|----|------|------|
| 站点生成 | Astro 6.x + MDX | 静态站点，Markdown/MDX → HTML |
| 交互组件 | React 19 | 主题切换、搜索、Mermaid 等交互组件 |
| 样式 | Tailwind v4 + OKLCH 设计系统 | 原子化 CSS + 自定义设计 token |
| 搜索 | Pagefind | 静态全文搜索，支持中文 |
| Wikilinks | 自定义 remark 插件 | `[[slug]]` 语法，知识图谱 |
| 图表 | Mermaid (React 组件) | 架构图、流程图 |
| 数据库 | Neon PostgreSQL (SaaS) | Agent 去重、状态追踪 |
| 容器 | nginx:alpine | 静态站点服务 |
| 编排 | k3s | 轻量 Kubernetes |
| Ingress | Traefik (k3s 内置) | HTTP 路由 + TLS |
| 证书 | cert-manager + Let's Encrypt | 自动 HTTPS |
| 网络 | Tailscale | 节点间 mesh VPN |
| CDN | Cloudflare | DNS + CDN + DDoS 防护 |
| 镜像仓库 | GHCR (GitHub Container Registry) | Docker 镜像存储 |
| CI/CD | GitHub Actions | 自动构建 + 部署 |
| Agent | Python + feedparser + Claude API | 内容采集 + 生成 |
| 监控 | Prometheus + Grafana + Loki | 可观测性 |

## 内容分类

| 分类 | 目录 | 内容 |
|------|------|------|
| Linux 基础 | `zh/linux/` | 进程模型、文件系统、网络栈、systemd |
| Docker | `zh/docker/` | 镜像分层、网络模式、存储驱动、Compose |
| Kubernetes | `zh/kubernetes/` | Pod 生命周期、Service Mesh、容器运行时 |
| 排障手册 | `zh/runbooks/` | CrashLoopBackOff、OOMKilled、ImagePullBackOff |
| 架构设计 | `zh/architectures/` | 高可用集群、GitOps 流水线 |
| 故障案例 | `zh/incidents/` | etcd 数据损坏、DNS 解析失败 |
| 对比分析 | `zh/comparisons/` | Helm vs Kustomize、Istio vs Linkerd |

## 标签体系

### 技术栈层级

- `layer/kernel` — Linux 内核
- `layer/filesystem` — 文件系统
- `layer/process` — 进程模型
- `layer/network-stack` — 网络栈
- `layer/systemd` — 服务管理
- `layer/l4-network` — 传输层
- `layer/dns` — DNS

### 组件

- `component/containerd` — 容器运行时
- `component/docker-engine` — Docker 引擎
- `component/network-overlay` — 覆盖网络
- `component/storage-driver` — 存储驱动
- `component/control-plane` — K8s 控制面
- `component/data-plane` — K8s 数据面
- `component/networking` — K8s 网络
- `component/storage` — K8s 存储
- `component/security` — 安全
- `component/observability` — 可观测性
- `component/cicd` — CI/CD
- `component/infrastructure` — 基础设施

### 工具

- `tool/iptables` — iptables
- `tool/nftables` — nftables
- `tool/perf` — 性能工具

### 模式

- `pattern/compose` — Docker Compose

### 主题

- `topic/concept` — 概念
- `topic/troubleshooting` — 排障
- `topic/architecture` — 架构
- `topic/best-practice` — 最佳实践
- `topic/comparison` — 对比
- `topic/incident` — 故障案例
- `topic/performance` — 性能优化
- `topic/security` — 安全

### 技术

- `tech/kubernetes`, `tech/docker`, `tech/helm`, `tech/prometheus`
- `tech/grafana`, `tech/argocd`, `tech/terraform`, `tech/ansible`
- `tech/etcd`, `tech/envoy`, `tech/cilium`

### 严重程度（runbook / incident 专用）

- `severity/p0` — 集群不可用 / 数据丢失
- `severity/p1` — 服务降级 / 部分用户受影响
- `severity/p2` — 非核心功能异常
- `severity/p3` — 告警 / 预警

## 写作规范

### 语言风格

- 默认语言：中文
- 技术术语保持英文：CrashLoopBackOff、Pod、etcd、Service Mesh、livenessProbe 等
- 命令和代码块保持原样：`kubectl get pods`、`docker build -t ...`
- 中文描述 + 英文术语，符合国内 SRE 社区阅读习惯
- 未来英文版（`wiki/en/`）作为扩展，不急于实现

### Frontmatter

```yaml
---
title: "页面标题（中文描述 + 英文术语）"
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: concept | runbook | architecture | incident | comparison | fundamental
tags: [from taxonomy above]
sources: [url1, url2]
confidence: high | medium | low
---
```

### 命名规范

- 文件名：小写，连字符分隔（`pod-lifecycle.md`）
- Slug 全局唯一，不同目录下不能同名
- 使用 `[[slug]]` 或 `[[slug|中文名]]` 链接页面
- 每个页面至少 2 个出站 wikilinks

### Confidence 等级

| 值 | 条件 |
|------|------|
| `high` | ≥2 个独立来源交叉验证 |
| `medium` | 单源但来源可靠（官方文档） |
| `low` | Agent 从单篇博客提取，未经交叉验证 |

## 仓库结构

### sre-wiki（知识库 + 部署）

```
sre-wiki/
├── mkdocs.yml
├── requirements.txt
├── .gitignore
├── PROJECT.md
├── .github/workflows/deploy.yml
├── wiki/
│   ├── zh/                    ← 默认语言，根路径访问
│   │   ├── index.md
│   │   ├── linux/
│   │   ├── docker/
│   │   ├── kubernetes/
│   │   ├── runbooks/
│   │   ├── architectures/
│   │   ├── incidents/
│   │   └── comparisons/
│   └── en/                    ← 未来扩展，/en/ 前缀
├── _meta/
│   └── SCHEMA.md
└── infra/
    └── k8s/
        ├── wiki-namespace.yaml
        ├── wiki-deployment.yaml
        ├── wiki-service.yaml
        ├── wiki-ingress.yaml
        └── network-policy.yaml
```

### sre-atlas-agent（采集 Agent）

```
sre-atlas-agent/
├── agent/
│   ├── collectors/
│   │   ├── rss.py
│   │   ├── github.py
│   │   └── docs.py
│   ├── generator.py
│   ├── dedup.py
│   └── scheduler.py
├── config/
│   └── sources.yaml
├── requirements.txt
├── .env.example
└── README.md
```

## 域名

| 服务 | 域名 | 用途 |
|------|------|------|
| SRE Atlas | `wiki.tentative.me` | 知识库主站 |
| 备用 | `*.tentativr.tech` | 实验性服务 |
| 国内 | `pineapple-user.site` | 备案域名，未来国内服务 |

## 成本

| 项目 | 月成本 | 备注 |
|------|--------|------|
| DO k3s 集群 | ~$96 | 学生包 |
| Neon PostgreSQL | $0 | 512MB 免费额度 |
| Cloudflare | $0 | Free plan |
| AI Agent | ~$21 | Claude API |
| 域名 | ~$2.5 | tentative.me + tentativr.tech |
| **总计** | **~$119.5/月** | 国内节点一次性付费不计入 |

## 路线图

### Phase 1：骨架搭建（当前）

- [ ] 项目结构 + MkDocs 配置
- [ ] 20 个种子页面（8 Linux/Docker + 12 K8s）
- [ ] Neon PG schema 初始化
- [ ] GitHub Actions CI/CD
- [ ] k8s 部署清单

### Phase 2：Agent 采集

- [ ] RSS 采集器
- [ ] GitHub Issues 采集器
- [ ] LLM 生成 pipeline
- [ ] 去重 + 质量门控

### Phase 3：上云部署

- [ ] Cloudflare DNS 配置
- [ ] k3s 集群部署
- [ ] cert-manager + HTTPS
- [ ] 监控集成

### Phase 4：优化

- [ ] 压力测试（k6）
- [ ] 英文内容（wiki/en/）
- [ ] 搜索优化
- [ ] 性能调优
