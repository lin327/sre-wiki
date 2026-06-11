# SRE Atlas

AI 驱动的运维知识库，覆盖 Linux → Docker → Kubernetes 全链路。

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Astro 6 + React 19 |
| 样式 | Tailwind v4 + OKLCH 设计系统 |
| 搜索 | Pagefind（支持中文） |
| 内容 | MDX + wikilinks remark 插件 |
| 部署 | Docker + nginx + k3s |

## 快速开始

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 构建 + Pagefind 索引
```

## 项目结构

```
src/
├── components/     # React + Astro + MDX 组件
├── layouts/        # BaseLayout（顶部导航 + TOC）
├── lib/            # remark-wikilinks 插件
├── pages/          # 21 个内容页面（7 分类）
└── styles/         # OKLCH 设计系统
```

## 内容分类

| 分类 | 页面 |
|------|------|
| Linux | 进程模型、文件系统、网络栈、systemd |
| Docker | 镜像分层、网络模式、存储驱动、Compose |
| Kubernetes | Pod 生命周期、容器运行时、Service Mesh |
| Runbook | CrashLoopBackOff、OOMKilled、ImagePullBackOff |
| Architecture | 高可用集群、GitOps |
| Incidents | etcd 数据损坏、DNS 解析失败 |
| Comparisons | Helm vs Kustomize、Istio vs Linkerd |

## 部署

```bash
# Docker
docker build -t sre-atlas .
docker run -p 80:80 sre-atlas

# k3s
kubectl apply -f infra/k8s/
```

## 相关仓库

- [sre-atlas-agent](https://github.com/lin327/sre-atlas-agent) — 内容采集 Agent
