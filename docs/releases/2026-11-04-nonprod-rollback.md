# 2026-11-04 非生产发布与回滚演练

状态：本机非生产通过；生产放行：否。推 GHCR ≠ 现网上线。

## 唯一验收基线、环境与覆盖缺口

- 开始时 fetch 的远端 main：084d7f1a61b8c6f86c7fdc345aa4c645accb6199。五个用户未提交删除（DESIGN/PLAN/PRODUCT/PROJECT/README.md）始终保留，未进入本轮 commit。
- 首轮 narrow 演练只探测带末尾斜杠的文章 URL，不能代表完整导航验收。后续全量 nginx e2e 在 d211566 上出现 40/196 失败：无尾斜杠路径的 301 Location 丢失宿主映射端口，跳到 127.0.0.1:80。原始 release-record.json 与失败日志保留，不作为最终通过依据。
- eb816ec 增加 nginx absolute_redirect off，补无尾斜杠回归后 200/200 e2e 通过，因此重新冻结回滚基线。先完成 corrected 演练，再开始冻结内容处置；最终内容候选又复演一次。
- 构建与最终 install/unit/contract/build：真实 Docker Linux arm64，Node 22.23.4 / npm 10.9.9。宿主 macOS / Node 24.21.0 仅调度 Docker 与浏览器；Playwright 覆盖 Chromium/Firefox/桌面 WebKit/移动 WebKit。
- nginx 实测 1.31.6，USER 101；nginx -t 通过，运行镜像未提供 Node 命令。没有改动现网、已有容器配置或 K8s 资源。启动 OrbStack 时自动恢复的既有系统容器不属于本次发布。
- Linux/Node 主版本已对齐；arm64 不能代替 CI/现网 amd64、TLS、域名、代理、真实权限或流量验收。

## 本次候选与可恢复镜像

| 角色 | 源 SHA | 本机 manifest digest / image ID |
|---|---|---|
| 已验回滚基线 | `eb816eca3c83c237cc26e1d7db040ce7b05cb217` | `sha256:365b5624d77fd64204e0bddfa3968d843fe45e0ad8fbd43605c7a74ee7716d79` |
| 最终内容候选 | `8d5d4d4fb771dec64fe4c0fdc22baa1fb47fb4aa` | `sha256:8ca9fdf2f7c164185d5b2cbe699f04642012b06f748b83171e3c3a7d6b948e8a` |

两者均从 git archive 的准确 SHA 构建；manifest 与 config digest 分开保存在 BuildKit metadata 中。没有把演练镜像推送 registry。启动用不可变 image ID，不用 latest。后续证据文档 commit 不改变本次候选的运行代码或内容；最终 main tip 另由 Git 执行记录核验。

## 实跑命令与退出码

以下相对命令从仓库执行；外置协调脚本从证据目录执行。完整 Docker 参数以 JSON 数组保留，可直接核对，不依赖口头结论。

| 命令 / 场景 | 退出码 | 结果与证据 |
|---|---|---|
| git fetch --prune origin / rev-parse | 0 | 开始与推送前 origin/main 仍为 084d7f1；最终 Git 结果另见 git-final.json。 |
| docker buildx build --load --provenance=false --platform=linux/arm64（最终候选） | 0 | final-image.json / logs/final-build.log；Dockerfile 内执行 npm ci --ignore-scripts 与 npm run build。 |
| npm ci --ignore-scripts（隔离 Node 22/Linux） | 0 | logs/node22-install.log；锁文件未改、未升级依赖。 |
| npm test（宿主 / 隔离 Node 22/Linux） | 0 / 0 | 各 162/162；logs/final-unit-after-fixture.log、logs/node22-unit.log。 |
| node scripts/check-safe-mdx.mjs --all | 0 | 45 MDX、17 可信组件页、18 个预期冻结告警；logs/final-contract-all.log / logs/node22-contract.log。 |
| node scripts/check-safe-mdx.mjs --base origin/main --head HEAD | 0 | logs/final-contract-changed.log，涵盖修改后的栏目 MDX；删除的旧文已移出路由。 |
| npm run build（隔离 Node 22/Linux） | 0 | logs/node22-build.log；Astro 静态构建与 Pagefind 完成。 |
| npx playwright test --config <证据目录>/playwright.container.config.mjs（SRE_WIKI_BASE_URL=http://127.0.0.1:18087） | 0 | logs/final-e2e-all.log；最终 nginx 全量 200/200。 |
| node validate-site.mjs http://127.0.0.1:18087 final-discovery-probes.json | 0 | 46 个 HTTP 探针、完整索引集合对齐、生产 HTML 主题 disabled、移动 WebKit 降级与恢复截图。 |
| python3 rollback-drill-current.py verified recovery-candidate corrected 18086 | 0 | corrected-release-record.json；修正导航后先完成 P0。候选与基线只差测试 commit，记录机制演练边界。 |
| python3 rollback-drill-current.py verified final final 18088 --retired-incidents | 0 | final-release-record.json；最终内容候选的实质发布/回退演练。 |
| docker exec <final> sh -c id/nginx -t/command -v node（见操作日志） | 0 | USER 101、配置有效、无 Node 运行时命令。 |
| npm audit --json | 1 | dependency-audit.json：2 critical、14 high、4 moderate、3 low；风险台账未关闭，未执行 audit fix。 |

Node 22 容器验证的全部精确启动命令：node22-validation.json。Playwright 浏览器缓存路径、输出目录与 baseURL 在外置配置中记录；没有把 Node preview 冒充 nginx。

## HTTP、搜索与发现集合

最终候选 46 个独立 HTTP 探针：29 个完整发现路由均 200、/healthz 为 200；中英 DNS/etcd 的带/不带斜杠共 8 个 URL 为 410；/sli、/sli/、/SLI、/slo、/alert-fatigue 为 410；缺失页面、/inbox/linux、缺失索引 JSON 为 404。无尾斜杠文章导航始终留在原 origin。

发现策略 = sitemap = Pagefind 的完整 URL 集合，均为 29（zh 28 + en 1），不是仅对数量。Pagefind 实际 search(null) 枚举每个语言的每条结果并取 data().url，比对集合。相对原 31 仅移除两篇中文事故路由；英文镜像未精选，inbox 从未构建，七栏目入口仍在。原始比较见 final-discovery-probes.json 与 discovery-delta.json。

生产 HTML 中主题 select 的初始 disabled 已直接检查；移动 WebKit 挂起 hydration 的已有回归及系统/亮/暗偏好用例全过。搜索脚本、核心 JS、入口 JSON、查询索引 shard 失败或 UI 脚本挂起均覆盖；失败显示可读提示、重试和七栏目出口，恢复后 systemd 有真实结果。截图已人工查看。

## 启动参数、故障注入与恢复

最终演练仅使用 127.0.0.1:18088。同端口旧版 → 候选 → 恢复旧版，旧容器无需重建。独立最终预览另留在 18087。

```sh
docker --context orbstack run --detach --name=sre-wiki-drill-q5fohy6x-final-old --label=sre-wiki.nonprod-drill=q5fohy6x --restart=no --publish=127.0.0.1:18088:80 sha256:365b5624d77fd64204e0bddfa3968d843fe45e0ad8fbd43605c7a74ee7716d79
docker --context orbstack run --detach --name=sre-wiki-drill-q5fohy6x-final-candidate --label=sre-wiki.nonprod-drill=q5fohy6x --restart=no --publish=127.0.0.1:18088:80 sha256:8ca9fdf2f7c164185d5b2cbe699f04642012b06f748b83171e3c3a7d6b948e8a
```

三个阶段各 26 个 HTTP 探针，共 78 个；每阶段还用真实 Chromium 查询 systemd 并命中 /linux/systemd/。候选新增的 8 个归档 URL 为 410，旧版/回滚版按其原内容为 200。这是被记录的内容回退副作用，不是探针放宽。

```sh
docker --context orbstack stop sre-wiki-drill-q5fohy6x-final-candidate
# 实际观察 /healthz: Connection refused；故障注入成立。
docker --context orbstack start sre-wiki-drill-q5fohy6x-final-old
```

启动旧容器后全量阶段探针与搜索重跑通过，inspect 确认其 Image 与冻结旧 ID 完全相同。异常立即回退；不要对用户工作区执行 reset --hard，因为有五个未提交删除。

若候选处于运行状态，一条恢复命令（只适用于本次非生产命名/端口）：

```sh
docker --context orbstack stop sre-wiki-drill-q5fohy6x-final-candidate && docker --context orbstack start sre-wiki-drill-q5fohy6x-final-old
```

触发条件：健康、关键导航、200/404/410、搜索、集合或镜像身份任一不符合期望。回滚后旧内容恢复到 31 条，并重新出现两篇历史事故路由；该副作用仅在本机演练可接受，不能把旧内容当作生产审校已通过。生产回滚还须记录现网真正使用的旧 digest/参数并在同架构环境演练。

## 快照、恢复与 SHA256

旧镜像实际 docker image save 导出，并 docker image load 恢复导入（退出码 0），随后从原 image ID 恢复容器。

- 导出路径：/Users/pineapple/.codex/visualizations/2026/11/03/01a1a185-f7be-7072-b8a5-62849f7d1a8e/sre-wiki-execution-20261104-q5fohy6x/final-old-image.tar。
- 导出 SHA256：`bae20cdf8665179c027ecdcb6099278ab06ef276456e9d8dfb89308bbb72f2cc`。

候选关键文件：

| 文件 | SHA256 |
|---|---|
| `Dockerfile` | `f1801d1e7c0ab6f540b4490b129223c49776f23581461d0d39b1855dd06044f1` |
| `.dockerignore` | `b51ce08f14f876c097e6e503cb3eb5f078bd45c2477f3ecc89277acd741b0e22` |
| `package-lock.json` | `1a3be8a376cd1d4f226f797a55b8fdc1c4780c9ade613d52ad593009e10e278f` |
| `nginx.conf` | `25b342e9df2181b123b9989edb01533f22740396f188cf62f727c36bc45dc8cb` |
| `nginx/legacy-redirects.map` | `158dea4e891d5c8cf9f701f004a349df32a64d3cf41edca25ec24d1902c765d2` |
| `src/components/react/PagefindSearch.tsx` | `7379904d1077ed7ebbbf0740fe0e27a3abe6d30feab51fc82eea6a76865d804b` |
| `src/components/react/ThemeToggle.tsx` | `460e88a0008c14d0943700c671535dca853b258e2fa04707d416c76848b7a249` |
| `src/lib/legacy-canonical-baseline.json` | `5ff4cb24bc09facc9439d9d10021c476bea3cf7eab210535ce0ea4e97f82b0ba` |

## 失败、修正与未放行项

- d211566 的 40/196 e2e 失败为真实 nginx 产品导航缺陷，已修复并新增回归，最终 200/200；首轮 narrow 记录已降为覆盖不足的历史证据。
- Pagefind 原生实现会吞掉查询索引错误并显示零结果；初次故障测试暴露后，使用安装版本支持的顶层 noWorker 与限定 Pagefind 路径的 fetch 观察，并在 nginx CSP 只增加 wasm-unsafe-eval，重试/正常搜索均实测。没有新增依赖或放开通用 unsafe-eval。
- 归档后单测 1/162 曾因旧 inbox 夹具路径 ENOENT 失败；只调整读取位置并单独 commit，仍保留哈希冻结与“修改即拒绝”断言，最终 162/162。
- 18 篇冻结历史页仍需隔离操作验证与作者真实审校；本轮完成 21 项处置决定不等于完成 18 篇迁移。
- npm audit 告警未修复、未完成利用性评估；ARM 不能代替生产架构、TLS、域名、权限、性能压测及灰度。生产放行仍否。

## 证据链归档与重放

证据根目录：/Users/pineapple/.codex/visualizations/2026/11/03/01a1a185-f7be-7072-b8a5-62849f7d1a8e/sre-wiki-execution-20261104-q5fohy6x。

- 初始与纠正：release-record.json、corrected-release-record.json、final-release-record.json；各文件保留其命令、退出码、探针正文哈希。
- 最终验证：node22-validation.json、final-discovery-probes.json、discovery-delta.json、frozen-21-evidence.json、dependency-audit.json、logs/ 下原始输出。
- 可重放工具：nonprod-drill.py（初轮，仅历史）、build-local-candidate.py、rollback-drill-current.py、search-probe-current.mjs、validate-node22.py、validate-site.mjs、playwright.container.config.mjs。
- 快照：准确 SHA 的 *-source.tar、BuildKit metadata、不可变 image ID 与旧镜像导出；关键证据文件由 evidence-sha256.txt 固化。
- Git：git-final.json / git-final-status.txt 单独记录最终本地/远端 tip、工作区边界与最终关键文件 SHA256。
- 重放请使用新的证据目录、容器前缀与独立回环端口，不覆盖原始记录。归档后的最终代码源为上述 candidate SHA，运行代码与报告文档提交可分别核验。

不做现网灰度/放量；本机候选容器不称为生产灰度。main 工作流会构建并推 GHCR，未见更新服务器的 CD 步骤。
