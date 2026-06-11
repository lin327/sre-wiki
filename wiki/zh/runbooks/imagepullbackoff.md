---
title: "ImagePullBackOff 排障"
created: 2026-06-11
updated: 2026-06-11
type: runbook
tags: [component/data-plane, topic/troubleshooting, tech/kubernetes, severity/p2]
sources: [https://kubernetes.io/docs/concepts/containers/images/]
confidence: high
---

## 症状

Pod 状态显示 `ImagePullBackOff` 或 `ErrImagePull`，容器无法拉取镜像。

## 根因清单（按概率排序）

1. **镜像名/Tag 错误** (35%) — 拼写错误、tag 不存在
2. **私有仓库认证失败** (30%) — imagePullSecrets 缺失或过期
3. **网络问题** (20%) — 节点无法访问镜像仓库
4. **仓库限流** (10%) — Docker Hub 匿名拉取限流
5. **镜像架构不匹配** (5%) — ARM 节点拉取 AMD64 镜像

## 排查步骤

### Step 1: 查看事件

```bash
kubectl describe pod <pod-name> -n <namespace> | grep -A 10 "Events:"
```

### Step 2: 验证镜像名

```bash
# 检查镜像是否存在
docker pull <image>:<tag>

# 或用 crane
crane manifest <image>:<tag>
```

### Step 3: 检查 imagePullSecrets

```bash
kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.spec.imagePullSecrets}'
kubectl get secret <secret-name> -n <namespace> -o jsonpath='{.data.\.dockerconfigjson}' | base64 -d
```

### Step 4: 检查节点网络

```bash
# 在节点上测试
curl -v https://registry-1.docker.io/v2/
```

## 修复方案

### 创建 imagePullSecret

```bash
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<user> \
  --docker-password=<pass> \
  -n <namespace>
```

### 使用国内镜像加速

```yaml
# /etc/containerd/config.toml
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
  endpoint = ["https://mirror.ccs.tencentyun.com"]
```

## 预防措施

- 使用私有仓库（Harbor）避免 Docker Hub 限流
- 固定镜像版本（不用 latest）
- 配置镜像加速器

## 相关页面

- [[crashloopbackoff]] — CrashLoopBackOff 排障
- [[container-runtime]] — 容器运行时
