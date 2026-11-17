# Phase 3 阶段 A：内容系统与过渡规则

日期：2026-11-18（Asia/Tokyo）。基于 main `cf945896940e2f2c5efe7fd83a56df162ddb8f10`，包含 UI 第一轮和 Phase 3 任务书。只交付阶段 A，PR 待用户确认后才允许进入后续阶段。

## 存储与版本

- 逐卡源文件：`data/knowledge/cards/<ID>.json`。聚合器校验文件名与稳定 ID 一致并排序输出，不生成正文。
- `data/knowledge/cards.json` 改为忽略的生成文件；各 npm 开发、构建、校验、类型和测试入口先聚合。直接运行 tsx/Playwright 等底层命令前需要先聚合。
- `scripts/author-knowledge.mjs` 退役。Git 历史保存原脚本和迁移前的完整卡片。
- 迁移保留原始字段，仅加 `schemaVersion: "0.3-legacy"`。A04-001 是唯一改写为 `schemaVersion: "0.4"` 的示范卡；名称仍为历史目录中的“普通朋友”，没有改 ID 或合并词条。
- legacy 清单当前仅包含待重写条目。A04-001 随转换从清单删除；本 PR 的清单增量为 60 → 59。

## 门禁规则

`knowledge-schema.ts` 为判别联合：legacy 使用原字段结构；v0.4 以 `whatItLooksLike` 替代旧 `scenarios`，以 `commonDealbreakers` 替代旧 `conflicts`，`changes` 改为 `start/evolve/end`。保留角色、需求、互动、资源、边界和深入阅读等有独立用途的字段，避免为了兼容再复制同一内容。

`summary` 是人工撰写的一句话，最多 60 个 Unicode 字符，不能照搬定义。`definition` 为 2–4 句；情境 2–4 个；至少两个不同邻接词条；误解至少两项；协商议题每项 2–4 个不同选项，维度 ID 来自既有 `assessment.ts` 的 `dimensions`，不改变问卷逻辑。deep 至少两节扩展正文；每档的必要字段均不能缺省。

正文计数字段含定义、范围、情境、角色、需求、行为、属性说明、边界、议题、冲突、区分和变化及深入阅读。只计 Unicode 字母／汉字／数字，排除标点、空白、摘要、标题、ID、版本、受控 facets、来源元数据及免责声明。最少 deep 1500、standard 600、brief 250；建议上限仍为任务书中的约 3000／1200／500，未将“约”改成硬上限。

重复检查采用 Unicode NFC 并忽略空白：

- 卡内不同正文叶字段（含不同数组项）共享 20 个连续字符即报告，保存字段路径与片段；同一字段内部重复不属于此门禁的定义。
- 按中文句号、问号、感叹号、分号与换行切句；长度至少 15 字的相同句子出现在超过五个不同 ID 中即报告。当前固定说明白名单为空。
- v0.4 的字数／数量／重复问题阻断；跨卡重复涉及 v0.4 时也阻断。仅涉及 legacy 的质量问题为 warning。
- 所有卡都必须通过结构、稳定 ID、来源 ID、相邻及关联 ID 检查；禁止自指和 alias 循环。风险条目的 `changes.start` 必须为 null，协商议题允许为空；非风险条目 deep/standard 至少三项、brief 至少一项。
- `reviewed` 必须有 `humanReviewer`、`reviewedAt`、`reviewReason`。Schema 能检查记录完整性，不能验证审核人身份；只有真人有权批准此状态。本轮不设置任何人工审核。

## 冻结清单与 Git 比较

默认本地比较 `origin/main`；CI 的 PR 使用 base SHA，main 推送使用 before SHA，手动执行使用 origin/main。checkout 拉取完整历史。找不到基线则明确失败，不能使用工作区清单冒充基线。

首次迁移时基线尚无清单，从该 Git 提交中的旧 `cards.json` 读取 ID 和原文；之后从基线 allowlist 与逐卡文件读取。验证当前清单是基线集合的子集，不只是数量不增；当前清单与所有 legacy 文件一一对应。删除清单 ID 必须有同 ID 的 v0.4 替代卡，不能通过删除正文绕过重写。仍为 legacy 的卡除版本标记外，按对象深比较锁定所有原文，包括未知字段；修改必须转为 v0.4。

历史 `history-lock.json` 自身也与基线比较，且继续校验其记录的原始文件哈希。校验脚本不再重写分类审计或题库文档。

## 报告与界面

运行 `npm run validate:knowledge` 更新 `artifacts/knowledge-coverage.json` 与未跟踪的 `artifacts/knowledge-quality.json`。报告分别给出完成卡各 depth、有来源数、AI 自查数、人工审核数、旧版待重写 ID、尚缺 ID 和全部未完成 ID；旧版的有来源数也独立列出。PASS 仅表示结构与本次适用门禁通过。

迁移后：v0.4 完成 1（deep 1，standard 0，brief 0），legacy 待重写 59，尚无卡片 419，未完成合计 478。v0.4 有来源 1，legacy 有来源 28；AI 自查 0、人工审核 0。示范卡按上述口径正文 2181 字；旧卡共 211 项重复片段／样板句警告。确切明细以生成报告为准。

首页与关于页动态读取统计。旧卡显示“待重写”，不进入“v0.4 内容完成”筛选；卡片墙使用新摘要，旧卡继续显示现有定义并沿用 CSS 截断。详情以判别联合分支呈现旧原文和新版情境、议题清单、结构冲突与变化。新增结构只使用原有视觉 token；无新的运行时依赖、请求、字体或数据收集。

## 来源与人工抽查

A04-001 保留 `SEP-FRIEND`，本轮重新打开 [SEP Friendship](https://plato.stanford.edu/entries/friendship/) 的导言及 1.1–1.3 节，登记访问日期 2026-11-18。来源只支持相互关心、亲密与共同活动这一概念讨论，示范卡的虚构情境、选项、结构冲突和建议不冒充研究结论。其余来源登记原样保留，未宣称本轮重新访问。

单元测试覆盖清单新增／替换／遗漏／转换未删除、旧稿修改、字段缺失、假审核字段、20／19 字边界、五／六卡样板句边界、字数不足、风险例外、坏引用和别名循环。浏览器测试覆盖三视口的新摘要与旧定义回退、统计和筛选、两种详情、情境与议题清单、原有问卷、比较和图谱，以及 479 路由。

本轮发现既有 Next.js 16.4.1 的两项 moderate 依赖通告：[GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h)、[GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8)。本地首次构建因升级提示返回失败，原命令重跑通过且仍显示提示。未在源码发现 `use cache`、`unstable_cache` 或启用 Cache Components；发布产物是静态文件。这是针对触发条件的有限检查，不是依赖已修复的证明。补丁升级建议独立处理，本阶段没有顺带升级框架。

## 本轮未做

未重写剩余卡片、补写其余 ID、修正原型族归属、改变题库／推荐算法、实现分享菜单、调整许可证、SEO 或视觉设计。阶段 B–F 保持未开始。STATE.md 仅为本地工作状态且已忽略；AGENTS.md 不提交，其现有全文放入 PR 描述供用户决定。
