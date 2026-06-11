---
title: "Linux 网络栈"
created: 2026-06-11
updated: 2026-06-11
type: concept
tags: [layer/network-stack, tool/iptables, tool/nftables, topic/concept]
sources: [https://man7.org/linux/man-pages/man8/iptables.8.html, https://man7.org/linux/man-pages/man8/nft.8.html]
confidence: high
---

## 概述

Linux 网络栈是 Docker 网络和 Kubernetes Service 的底层基础。理解 iptables/nftables、网桥、veth pair，才能理解容器为什么能互相通信。

## 核心概念

### 网络包处理流程

```
网卡收包
  → 网卡驱动 → 协议栈
    → PREROUTING (iptables)
      → 路由判断
        → 本机：INPUT → 应用进程
        → 转发：FORWARD → POSTROUTING → 网卡发包
        → 本机发出：OUTPUT → POSTROUTING → 网卡发包
```

### iptables

```bash
# 查看规则
iptables -L -n -v
iptables -t nat -L -n -v

# 常用规则
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -j DROP

# NAT（Docker 端口映射的基础）
iptables -t nat -A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE
```

### nftables（iptables 的继任者）

```bash
# nftables 语法更清晰
nft add table inet my_table
nft add chain inet my_table input { type filter hook input priority 0 \; }
nft add rule inet my_table input tcp dport 80 accept

# 查看规则
nft list ruleset
```

### 网桥（Bridge）

Docker 默认使用 docker0 网桥：

```bash
# 查看网桥
bridge link show
ip link show type bridge

# Docker 网桥
docker network inspect bridge
```

### veth pair

容器的网络接口通过 veth pair 连接到网桥：

```
容器内：eth0 ←──veth pair──→ vethXXXX（宿主机，连接到 docker0 网桥）
```

```bash
# 查看 veth pair
ip link show type veth
```

### 路由

```bash
# 查看路由表
ip route show

# 添加路由
ip route add 10.0.0.0/24 via 192.168.1.1
```

## 关键参数

| 参数 | 说明 |
|------|------|
| `/proc/sys/net/ipv4/ip_forward` | IP 转发开关（Docker 需要开启） |
| `/proc/sys/net/bridge/bridge-nf-call-iptables` | 桥接流量是否经过 iptables |
| `/proc/sys/net/core/somaxconn` | 监听队列最大长度 |

## 常见问题

- 容器无法访问外网 → 检查 ip_forward、iptables NAT 规则
- 容器间无法通信 → 检查网桥、路由、NetworkPolicy
- 端口冲突 → 检查 `ss -tlnp` 和 iptables DNAT 规则

## 相关页面

- [[process-model]] — 进程模型（网络栈是进程通信的基础）
- [[networking]] — Docker 网络模式（网络栈的应用）
- [[service-mesh]] — Service Mesh（网络栈的高级应用）
