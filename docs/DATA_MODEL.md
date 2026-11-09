# Phase 1 数据与本体边界

原始四份文件保持字节不变。`src/lib/catalog.ts` 是统一只读适配器，加载本地 JSON，经 Zod 校验，再提供列表、详情、检索、比较和图谱。`scripts/validate-data.ts` 验证双向 ID 保全、名称一致、类别计数、Markdown 覆盖与摘录原文，输出 SHA-256 清单。

## 分层

`schema.ts` 将关系原型、变体、互动场景、结构、属性、可协商规则、生命周期及 Evidence 分开表达，保留原始 19 种细分 kind，不压入单一互斥关系枚举。规范性 `RelationshipRules` 独立于描述性 `RelationshipKnowledgeSchema`。属性是带依据引用的 claim；未知用缺失表示，不使用 false 补齐。

`RelationshipStructure` 用任意数量的角色、成员归属（超边）、生效区间和重叠关系 ID 表示多人及时间变化，不把所有安排变成两人边。该接口本阶段不接收真实人物实例。

## 字段来源

- 名称、稳定 ID、类别：原始 taxonomy；仅证明收录事实。
- 定义、kind、family、审核标记、风险标记及编辑备注：v0.2 草稿；未独立验证。
- 英文显示：只提取原名称中含拉丁字母的括注，不翻译或补造英文名；中文备注不冒充英文。
- 结构化筛选属性：仅人工标注既有工作定义中的字面内容，每项保存可核对的原文片段，自动验证片段确实存在；保留“可能”这一限定。
- 参与人数：原记录仅有“未指定”和“视情境为双人或网络”，不转换为确定双人／多人。
- `source_refs`：当前全部为空。概览 references 只在关于页列为未逐条核验的背景资料。

## 原型映射缺口与图谱

20 个 prototype ID 与词条的 archetype_family 不是统一编码表。精确匹配的提议也只显示为草稿关联；非精确匹配保留原值并显示“归属待核对”。本阶段不引入未经审核的同义映射。

图谱提供目录类别 → 初步 kind → 词条，以及 20 个提议原型节点。点击原型可展开原始字段精确对应的词条，用虚线标示“未审核原稿归属”；没有对应记录的原型不补造子节点。每组最多 12 个词条，搜索覆盖全部 479 项。目录边只表示初步归类，不冒充 `variant_of`。目前没有经过核验的子类型、变体、相关关系边，因此完整语义谱系仍待编辑研究。后续可在 `links` 中按证据添加 variant_of、related_to、context_of、composite_of，禁止自动全连接。

## 扩展路径

将来以稳定 ID 为主键，新增不可变的证据记录、编辑修订与审核事件，再接数据库或只读查询 API。保留原始 ingest 记录与版本哈希；发布前校验引用完整性、风险边界与未知语义。当前无数据库、账户、写入端点、外部 AI 调用或敏感资料采集。

## 实现参考

- [Next.js 安装与 App Router](https://nextjs.org/docs/app/getting-started/installation)
- [React Flow 性能指导](https://reactflow.dev/learn/advanced-use/performance)：图谱动态加载，按分类限制节点，不对 479 项运行全局实时力导向布局。
