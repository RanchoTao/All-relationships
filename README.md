# AllRelationships · 人际关系 Wiki / 关系分类研究

**状态：研究草稿 v0.2（2026-11-09）· 尚未经过独立学术审查**

AllRelationships 旨在整理、分类、描述人与人之间的关系，包括亲密关系、友谊、活动伙伴、共同生活、合作、职业、家庭、制度性社会角色与关系状态。它可为将来的 Dearwithme 产品提供**可审计的关系分类、术语与规则结构**，但不等同于婚恋匹配平台。

## 研究资料

| 文件 | 内容 |
| --- | --- |
| [原始完整词条列表](data/raw/dearwithme_relationship_catalog.md) | 17类、479个原始关系名称和情景标签（可读Markdown） |
| [原始结构化列表](data/raw/dearwithme_relationship_taxonomy.json) | 479项原始数据及来源链接（JSON） |
| [v0.2 分类审计](docs/AllRelationships_taxonomy_review_v0.2.md) | 关系原型、变体、场景、结构属性、生命周期、风险等分层方法与逐条审核状态 |
| [v0.2 结构化本体草稿](data/draft/AllRelationships_479_catalog_v0.2.json) | 保留稳定ID的479项种子数据、20个拟议上层原型族及审核元信息 |

**注意：479 = 名称和具体场景的收集量，不代表479种互斥的关系。** 目前仅23条具备示例工作定义，其余定义尚待研究。该词库不是正式心理学量表，也不适合作为用户个体的诊断、事实认证或直接撮合规则。

## 概念分层

- **关系原型**：朋友、长期伴侣、室友、合作伙伴等；
- **结构与变体**：一对一、非排他、多方网络、活动类型等；
- **规则与资源**：时间、金钱、空间、责任、边界、双方同意；
- **状态**：建立意向、接触、维持、暂停、结束；
- **安全/法律属性**：非自愿、权力不对称、强制关系等，只作描述，不作为普通主动匹配模板。

Wiki 的“现实中怎样存在”与协议的“用户希望怎样约定”必须区分。**关系可以多重叠加**，不应简单压缩为互斥分类。多人关系应支持网络或超边模型。

## 与 Dearwithme 的关系

AllRelationships：**描述与研究关系**，优先开放浏览、检索、对比、证据核查和可视化。

Dearwithme：若未来获得开发授权，可基于经审核的关系意向和规则表达做**双向自动撮合**。两个产品的数据、用户隐私和正式开发权限独立。

## 研究及使用边界

- 本仓库的词条大多是**研究候选标签**，不代表统一学术定义或法律上的协议效力。
- 不推断真实个人的性格、性倾向、财产、忠诚度或精神健康。
- 成年人之间的亲密关系必须尊重自愿、明确且可随时撤回的同意；儿童、强迫/剥削和其他风险关系不做撮合模板。
- 将来如做“关系倾向测试”，初期只能作为**自我探索与偏好澄清工具**；没有心理测量学验证前不能宣称测出“真实人格/真正关系需求”。
- **仓库当前未授予独立开放许可证**。GitHub Public 并不自动允许商业复用；未来可分别决定网站代码与词库内容的许可证。

## Phase 1 本地 Wiki

已加入 Next.js App Router、TypeScript、Tailwind CSS、本地 JSON 和 Zod 的只读网站：

- `/`：响应式卡片墙、479 项渐进加载、分类与中文／英文括注／ID 搜索、可追溯的属性筛选、双项比较选择。
- `/relationships/A04-001`：每个稳定 ID 的详情页，工作定义、未知属性、依据、原始记录与同分类入口。
- `/compare`：两项对照，只有双侧已知字段才能形成差异，缺失保持未知。
- `/graph`：按分类、每组最多 12 个词条的目录图谱；20 个拟议原型视图；缩放、搜索、定位和文本替代目录。
- `/about`：编辑原则、来源范围、原型提议与当前数据缺口。

### 本地运行

使用 Node.js 22 LTS 或更新兼容版本，以及 npm：

```powershell
npm ci
npm run dev
```

默认仅绑定本机 `127.0.0.1:3000`。无环境变量、数据库、账户或收费 API 要求。依赖安装需要网络，网站运行数据全部来自本地；没有远程字体、图片、分析或 AI 请求。

若默认端口已有服务，可运行 `npm run dev -- --port 3400`。本次交付预览使用 `http://127.0.0.1:3400`。

```powershell
npm run validate:data
npm run test:unit
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

浏览器测试使用本机生产服务 `127.0.0.1:3100`，覆盖 1440×1000、820×1180 和 390×844 三种屏幕。测试报告在 `playwright-report/`，截图在 `artifacts/screenshots/`，数据验证回执在 `artifacts/data-validation.json`。`npm run start` 启动已构建的本地版本。

Windows 已安装 Microsoft Edge 时，可用 `$env:PLAYWRIGHT_CHANNEL='msedge'; npm run test:e2e`，无需另行下载 Chromium。本次自动化使用独立的无头 Edge 会话，不使用个人浏览器配置或登录信息。

开源依赖：Next.js、React、Tailwind CSS、Zod、Fuse.js、React Flow (`@xyflow/react`)、Lucide；测试使用 Node test runner、Playwright、axe-core，静态检查使用 TypeScript 与 ESLint。它们的许可证独立于本仓库；本次没有替仓库授予开放许可证。

实现与研究文档：

- [数据模型与缺口](docs/DATA_MODEL.md)
- [未来关系倾向测试研究](docs/RELATIONSHIP_ASSESSMENT_RESEARCH.md)
- [Phase 1 交付报告](docs/PHASE1_DELIVERY_REPORT.md)

## GitHub Pages 发布

工作流：`.github/workflows/pages.yml`。推送到 `main` 或手动运行后，先执行数据校验、单元测试、类型检查、Lint、静态导出和三视口浏览器测试，全部通过才发布 Pages。PR 只验证，不发布。

Pages 的发布来源应保持 **GitHub Actions**。网站导出到 `out/`，默认子路径为 `/All-relationships`；比较与图谱的网址参数在浏览器读取，不需要 Node 服务或 API。既有 Pages 域名配置保持不变。

本地复验同一静态产物：

```powershell
npm run build:pages
$env:PLAYWRIGHT_CHANNEL='msedge' # 或先安装 Playwright Chromium
npm run test:pages
npm run preview:pages
```

静态预览地址为 `http://127.0.0.1:3101/All-relationships/`。部署到其他仓库路径时，在构建和测试时设置相同的 `NEXT_PUBLIC_BASE_PATH`。普通 `npm run dev` / `npm run build` 仍使用本机根路径。

## 后续知识研究

1. 校正术语、出处和分类层级；
2. 核对原型映射，按证据补充变体、相关关系和生命周期；
3. 在 Wiki 交付后研究允许不确定、用户自主修正的动态关系偏好探索；
4. 分阶段开展题项理解、重测稳定性和效度验证，不预设最少题数已经足够。

本阶段不要在此库收集个人敏感资料、创建真实匹配账户或自动上线公开测试。
