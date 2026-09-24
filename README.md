# SRE Atlas

AI 驱动的运维知识库，覆盖 Linux → Docker → Kubernetes 全链路。默认中文，技术术语保留英文。

线上站点：[https://pineapple-user.site/](https://pineapple-user.site/)。本仓库负责静态站与 Docker 部署，`sre-atlas-agent` 负责采集和生成草稿。

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Astro 6 + React 19 |
| 样式 | Tailwind v4 + OKLCH 设计系统 |
| 搜索 | Pagefind（支持中文） |
| 内容 | MDX + wikilinks remark 插件 |
| 部署 | 云服务器 Docker + nginx 静态站 |

## 快速开始

使用 Node.js >= 22.12.0，在本仓库目录执行：

```bash
npm ci
npm run dev        # http://localhost:4321
npm test           # Vitest
npm run build      # 构建 + Pagefind 索引
```

## 项目结构

```
sre-wiki/
├── src/
│   ├── components/ # React、Astro、MDX 组件及 ads/AdSlot.astro
│   ├── layouts/    # BaseLayout（顶栏、侧栏、目录与槽位）
│   ├── lib/        # 认证客户端、remark-wikilinks 插件
│   ├── pages/      # 中文分类 MDX、页面路由与 en/ 英文内容
│   └── styles/     # 设计系统
├── public/         # 字体、图片、robots.txt、ads.txt
├── astro.config.mjs
├── Dockerfile      # Node 构建 → nginx 运行
└── nginx.conf      # Docker 实际使用的配置
```

## 精选内容与 inbox

内容目标分为两层：审核后的精选页进入 `src/pages/` 对应分类，以 `canonical: true` 标记；Agent 草稿进入 `src/inbox/`，审核前不进入发布路由、搜索索引或 sitemap。GitHub Issue 复述默认作为待整理资料，不直接上线。目录使用复数 `runbooks/`、`architectures/`。

**当前状态：**20 篇种子正文和 7 个分类索引已标记 `canonical: true`，首页统计 20 篇精选；分类列表精选置顶，其余标为“待整理”并带警告。历史生成内容仍在 `src/pages/`，仍可访问并被搜索或 sitemap 收录；`src/inbox/` 接入与全站发布过滤尚未实现。完整规则见[内容契约](CONTENT_CONTRACT.md)。

种子主题如下（不含分类索引页）：

| 分类 | 页面 |
|------|------|
| Linux | 进程模型、文件系统、网络栈、systemd |
| Docker | 镜像分层、网络模式、存储驱动、Compose |
| Kubernetes | Pod 生命周期、容器运行时、Service Mesh |
| Runbooks | CrashLoopBackOff、OOMKilled、ImagePullBackOff |
| Architectures | 高可用集群、GitOps |
| Incidents | etcd 数据损坏、DNS 解析失败 |
| Comparisons | Helm vs Kustomize、Istio vs Linkerd |

## 云服务器 Docker 部署

根目录 `Dockerfile` 使用 Node 22 构建 Astro 和 Pagefind，再由 nginx 提供 `dist/` 静态文件。首次启动示例：

```bash
docker build --build-arg PUBLIC_ADS_ENABLED=false -t sre-wiki:local .
docker run -d --name sre-wiki --restart unless-stopped \
  -p 8080:80 sre-wiki:local
curl -fsS http://127.0.0.1:8080/healthz
```

将服务器现有 HTTPS 入口的上游指向容器端口，使用 `pineapple-user.site` 域名。`infra/k8s/` 是历史部署资料，不是当前云服务器 Docker 的部署步骤。

现有 GitHub Actions 在 `main` 推送后执行测试、构建并推送 GHCR 镜像（`latest` 与 commit SHA 标签），**没有更新云服务器容器的步骤**；镜像发布不等于现网已更新。

## 广告与赞助

`PUBLIC_ADS_ENABLED=false` 为默认值；未设置时槽位也不渲染。当前仅支持 sponsor 本地图与链接，不接入 AdSense 或其他广告网络脚本。

配置见 [.env.example](.env.example)：`PUBLIC_SPONSOR_IMAGE` 使用 `public/` 下图片的站内路径，`PUBLIC_SPONSOR_URL` 为完整 HTTP(S) 链接，`PUBLIC_SPONSOR_NAME` 为图片说明。只有开关开启、`PUBLIC_ADS_PROVIDER=sponsor` 且配置有效时才展示“赞助”。

这些变量在**构建时**生效：本地构建可使用 `.env`，Docker 构建用同名 `--build-arg`；`docker run -e` 不会改变已生成的静态页面。启用前应更新[隐私说明](src/pages/privacy.mdx)；另见[关于本站](src/pages/about.mdx)。

## 相关仓库

- [sre-atlas-agent](https://github.com/lin327/sre-atlas-agent) — 内容采集 Agent

Agent 当前使用 SQLite 去重，默认输出 `output/<category>/<slug>.mdx`；尚未接入 Wiki inbox，也没有自动同步或发布 Wiki 的链路。采集、审核、同步和发布是需要分别验证的环节。
