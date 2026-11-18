# AllRelationships 项目规则

- 按 [Phase 3 任务书](docs/handoff/PHASE3_GPT_PROMPT.md) 及用户最新确认的范围推进；到约定的 PR 检查点即停下。这个仓库维护关系百科，不做撮合，不收集真实个人资料。
- 历史数据层 `data/raw/`、`data/draft/` 及历史分类评审记录保持原样。将新释义、分类判断和引用写入 `data/knowledge/`，保留目录中的条目 ID 和原始来源。迁移卡片时同步从 legacy 清单移除其 ID；清单不得新增。
- 不编造来源、引用、查阅或审核记录。引用的内容应与实际查到的范围相符；只有摘要可读时说明这一点。区分事实依据、工作定义和编辑推论。没有独立人工审核的卡保留相应草稿状态，覆盖数字不代表审核完成。
- 每次提交前运行 `npm run validate:data`、`npm run test:unit`、`npm run typecheck` 和 `npm run lint`。涉及页面、内容或依赖时，再运行 `npm run build:pages` 和 `npm run test:pages`。按实际结果记录通过、跳过及失败，修复失败后重跑相关检查。
- `STATE.md` 仅供本地交接，保持 Git 忽略，不提交。
