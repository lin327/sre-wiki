# 单作者运维学习路径（设计，未发布新页面）

目标：用现有七栏目完成“阅读 → 本地操作 → 结果核验 → 退回基线”的一次闭环。没有新栏目、课程系统、账号、自动精选或新依赖。

本周只落地站点非生产发布回滚演练。下表是下一轮学习材料的组织方案，**不是这些文章已通过操作验收的声明**；18 篇历史种子的待复审问题见冻结处置台账。命令夹具与审校证据补齐后，再决定是否把路径入口放到现有首页。

| 顺序 / 现有栏目 | 阅读入口 | 本地操作与核验设计 | 留存证据 / 退路 |
|---|---|---|---|
| 1 Linux | /linux/process-model、/linux/network-stack | 在隔离 Linux 中只读查看进程、监听端口；解释本机端口到 nginx 的映射，不写宿主 sysctl/iptables。 | 版本、ps/监听输出；退出隔离环境即可，不更改宿主配置。 |
| 2 Docker | /docker/image-layers、/docker/networking | 从准确源 SHA 构建本站静态镜像，只绑定 127.0.0.1；读取 image inspect，区分源 SHA、manifest digest 与 config digest。 | 构建命令/退出码、SHA256、digest；保留已验旧镜像与导出快照。 |
| 3 Kubernetes | /kubernetes/pod-lifecycle | 先辨析容器状态、就绪与存活；如另有明确授权的沙箱，再只读观察 Pod 状态。不创建集群、不重启现有 kube-system。 | 标注“未跑集群夹具”；本站 Docker 探针不能替代 K8s 验证。 |
| 4 Runbooks | /runbooks/crashloopbackoff | 按当前本站发布记录的探针顺序核验 200/404/410、搜索；停掉候选，确认失败被发现。文章内 kubectl 删除/patch 操作须先复审。 | 请求、期望、实际状态及日志；失败立即停候选并启动冻结旧容器。 |
| 5 Architectures | /architectures/gitops-pipeline | 对照本站 CI：测试/门禁 → 构建/推 GHCR → 人工发布边界，说明为何 git push 或镜像推送都不是现网上线。 | 工作流与本地演练记录；按不可变旧 image ID 恢复并重探针。 |
| 6 Incidents | /incidents | 用本次“无尾斜杠跳错端口”的真实记录写时间线、覆盖缺口、修复及复演结果；不把 DNS/etcd 模板当真实事故。 | 本轮日志与发布记录；未有足够事件证据则保持栏目为空。 |
| 7 Comparisons | /comparisons/helm-vs-kustomize | 仅做选型复盘：说明静态站点本轮为何无需引入 Helm/Kustomize/网格；如以后比较，先附版本锁定的渲染与恢复夹具。 | 一页取舍记录；不因学习路径扩大生产基础设施。 |

验收：每一站都能找到阅读入口、明确的操作边界、可检查的结果与退路；没有原始输出的步骤写“未跑”。一次路径完成不自动设置 canonical 或 reviewed。本设计未增加路由，不能改变 sitemap/Pagefind 集合。
