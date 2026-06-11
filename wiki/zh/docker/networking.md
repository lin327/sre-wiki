---
title: "Docker 网络模式详解"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [component/network-overlay, layer/network-stack, topic/concept, tech/docker]
sources: [https://docs.docker.com/network/, https://docs.docker.com/network/network-tutorial-standalone/]
confidence: high
---

## 概述

Docker 提供多种网络模式，每种模式适用于不同的场景。理解这些模式是排查容器网络问题和设计 Kubernetes 网络方案的基础。

## 网络模式

### Bridge（默认）

```
┌─────────────────────────────┐
│         宿主机               │
│  ┌──────┐    ┌──────┐      │
│  │容器 A │    │容器 B │      │
│  │172.17.│    │172.17.│      │
│  │0.2    │    │0.3    │      │
│  └───┬───┘    └───┬───┘      │
│      │            │          │
│  ┌───┴────────────┴───┐      │
│  │    docker0 网桥     │      │
│  └─────────┬──────────┘      │
│            │ NAT             │
│        eth0 (宿主机)         │
└────────────┼─────────────────┘
             ↓
          外部网络
```

```bash
# 创建自定义网络
docker network create my-network
docker run --network my-network nginx

# 查看网络
docker network ls
docker network inspect bridge
```

### Host

容器直接使用宿主机的网络栈，无隔离：

```bash
docker run --network host nginx
# 容器直接监听宿主机的 80 端口
```

**优点**：性能最好，无 NAT 开销
**缺点**：无网络隔离，端口冲突

### None

无网络，完全隔离：

```bash
docker run --network none alpine
# 容器内只有 lo 接口
```

### Macvlan

容器拥有独立的 MAC 地址，直接接入物理网络：

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my-macvlan
```

### Overlay（Swarm 跨主机网络）

```bash
# 跨主机容器通信（Docker Swarm）
docker network create -d overlay my-overlay
```

## 网络对比

| 模式 | 隔离性 | 性能 | 适用场景 |
|------|--------|------|---------|
| Bridge | 中 | 中 | 默认，单机多容器 |
| Host | 无 | 最好 | 高性能网络应用 |
| None | 完全 | - | 安全隔离场景 |
| Macvlan | 高 | 好 | 容器需要独立 IP |
| Overlay | 高 | 中 | 跨主机通信 |

## 端口映射

```bash
# -p 宿主机端口:容器端口
docker run -p 8080:80 nginx

# 查看端口映射
docker port <container>

# 底层实现：iptables DNAT
iptables -t nat -A DOCKER -p tcp --dport 8080 -j DNAT --to 172.17.0.2:80
```

## DNS 服务发现

Docker 内置 DNS 服务器（127.0.0.11）：

```bash
# 自定义网络中的容器可以通过名字互相访问
docker run --network my-network --name app1 nginx
docker run --network my-network --name app2 alpine ping app1
```

## 常见问题

- 容器无法访问外网 → 检查 ip_forward、iptables NAT 规则
- 容器间无法通信 → 是否在同一网络？检查 DNS 解析
- 端口映射不生效 → 检查 `docker port` 和 iptables 规则

## 相关页面

- [[network-stack]] — Linux 网络栈（Docker 网络的底层实现）
- [[compose]] — Docker Compose（网络配置实践）
- [[service-mesh]] — Service Mesh（K8s 网络的高级形态）
