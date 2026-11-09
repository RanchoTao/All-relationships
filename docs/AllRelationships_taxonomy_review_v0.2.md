# AllRelationships · 479 项初步本体审计（v0.2）

**范围**：保留原始 479 项、17 类，整理为分层、可审查的 Wiki 词条种子。此文件不是完整定稿，也不是 479 种互斥关系的证明。

## 结构化处理结果

- 原始项目数：**479**，完整重复名称数：**0**。
- 已建立 20 个上层原型建议；仅作为模型设计的初稿，不是公认学术标准。
- 各条记录都包含稳定 ID、类目、概念种类、拟处理方式、证据状态和定义审核状态。
- **仅有 23 条示例工作定义**，剩余项目暂不伪造完整百科定义，统一标记待逐卡验证。

### 概念种类统计

| Kind | 数量 |
|---|---:|
| `relationship_variant` | 101 |
| `activity_scenario` | 86 |
| `role_or_collaboration` | 50 |
| `social_role` | 42 |
| `service_role` | 30 |
| `exchange_or_contract_role` | 26 |
| `ascribed_or_legal_role` | 25 |
| `lifecycle_or_risk_state` | 23 |
| `structural_attribute` | 21 |
| `institutional_role` | 20 |
| `role_or_arrangement` | 19 |
| `lifecycle_state` | 13 |
| `network_structure` | 8 |
| `relationship_archetype` | 5 |
| `asymmetric_social_role` | 3 |
| `risk_state` | 3 |
| `one_time_encounter` | 2 |
| `composite_relation` | 1 |
| `legal_role` | 1 |

## 信息模型：必须拆开的五层

1. **现实描述**：某一词语在社会、文化或法律中的通常用法。
2. **分类属性**：原型、变体、活动场景、网络结构、身份角色、变化状态。
3. **协商规则**：可讨论的边界、责任、资源交换、沟通节奏和退出方式。
4. **法律身份**：婚姻、亲子、雇佣、监护等由制度定义的关系，不能被普通自愿协议取代。
5. **风险与保护**：非自愿、伤害性、权力不对等关系仅作描述与安全研究，不作为匹配模板。

## 关系字段设计原则

- 关系名称不是完整定义。例如“室友”与“朋友”可以叠加，也可以互不相关。
- 定量字段采用可验证的单位（频次、时长、费用），但情感、信任不应伪装成客观测量。
- 已存在的亲属和制度角色要与用户希望主动建立的关系区分。
- 两人关系和多人结构不得硬套相同的双边撮合规则。
- 性倾向、性别认同、生理性特征和法律身份不能互相等同，且在公开 Wiki 阶段无需收集任何个人数据。
- 用户应当能自由协商边界；涉及性亲密的情境必须强调成年人、持续知情自愿、随时撤回同意。
- 历史奴役、强迫、暴力等留待单独社会史专题；不将其当成正常可撮合的关系选项。

## 原始 17 分类及审核标记

### A01 · 恋爱、约会与关系发展（36）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A01-001 | 单向好感 | `lifecycle_state` | 待核实 |
| A01-002 | 双向好感 | `lifecycle_state` | 待核实 |
| A01-003 | 暗恋 | `lifecycle_state` | 待核实 |
| A01-004 | 双向暗恋 | `lifecycle_state` | 待核实 |
| A01-005 | 暧昧对象 | `lifecycle_state` | 待核实 |
| A01-006 | 聊天了解阶段（Talking Stage） | `relationship_variant` | 待核实 |
| A01-007 | 调情关系（Flirtationship） | `relationship_variant` | 待核实 |
| A01-008 | 相亲对象 | `relationship_variant` | 待核实 |
| A01-009 | 初次约会对象 | `lifecycle_state` | 待核实 |
| A01-010 | 多次约会对象 | `lifecycle_state` | 待核实 |
| A01-011 | 普通约会对象 | `relationship_variant` | 待核实 |
| A01-012 | 休闲约会（Casual Dating） | `relationship_variant` | 待核实 |
| A01-013 | 认真约会（Serious Dating） | `relationship_variant` | 待核实 |
| A01-014 | 非排他约会 | `relationship_variant` | 待核实 |
| A01-015 | 排他约会 | `relationship_variant` | 待核实 |
| A01-016 | 未定义的暧昧关系（Situationship） | `relationship_variant` | 待核实 |
| A01-017 | 短期恋情 | `relationship_variant` | 待核实 |
| A01-018 | 长期恋情 | `relationship_archetype` | 工作草稿 |
| A01-019 | 异地恋伴侣 | `relationship_variant` | 待核实 |
| A01-020 | 跨国恋伴侣 | `relationship_variant` | 待核实 |
| A01-021 | 周末情侣 | `relationship_variant` | 待核实 |
| A01-022 | 同城非同居伴侣 | `relationship_variant` | 待核实 |
| A01-023 | 未婚长期伴侣 | `relationship_variant` | 待核实 |
| A01-024 | 以婚姻为目标的伴侣 | `relationship_variant` | 待核实 |
| A01-025 | 不以婚姻为目标的伴侣 | `relationship_variant` | 待核实 |
| A01-026 | 订婚伴侣 | `lifecycle_state` | 待核实 |
| A01-027 | 同居情侣 | `relationship_variant` | 待核实 |
| A01-028 | 分居居住伴侣（LAT） | `relationship_variant` | 待核实 |
| A01-029 | 无性浪漫伴侣 | `relationship_variant` | 待核实 |
| A01-030 | 无浪漫亲密伴侣 | `relationship_variant` | 待核实 |
| A01-031 | 生活伴侣（Life Partner） | `relationship_variant` | 待核实 |
| A01-032 | 灵魂伴侣（自述标签） | `relationship_variant` | 待核实 |
| A01-033 | 计划共同生育的伴侣 | `relationship_variant` | 待核实 |
| A01-034 | 选择不生育的伴侣 | `relationship_variant` | 待核实 |
| A01-035 | 再婚对象 | `relationship_variant` | 待核实 |
| A01-036 | 复合意向对象 | `lifecycle_state` | 待核实 |

### A02 · 成年人之间的短期或非承诺亲密（24）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A02-001 | 一次性约会 | `one_time_encounter` | 待核实 |
| A02-002 | 一次性亲密接触（ONS） | `one_time_encounter` | 工作草稿 |
| A02-003 | 短期邂逅（Fling） | `relationship_variant` | 待核实 |
| A02-004 | 临时亲密约会（Hookup） | `relationship_variant` | 待核实 |
| A02-005 | 重复性非承诺亲密对象 | `relationship_variant` | 待核实 |
| A02-006 | 固定性伴侣（炮友） | `relationship_variant` | 工作草稿 |
| A02-007 | 有性关系的朋友（FWB） | `relationship_archetype` | 工作草稿 |
| A02-008 | 非排他性亲密伴侣 | `relationship_variant` | 待核实 |
| A02-009 | 仅限身体亲密的双方关系 | `relationship_variant` | 待核实 |
| A02-010 | 无浪漫承诺的性伴侣 | `relationship_variant` | 待核实 |
| A02-011 | 性与情感分离型伴侣 | `relationship_variant` | 待核实 |
| A02-012 | 约会但不寻求承诺的伴侣 | `relationship_variant` | 待核实 |
| A02-013 | 短期性爱关系 | `relationship_variant` | 待核实 |
| A02-014 | 长期无恋爱承诺的性关系 | `relationship_variant` | 待核实 |
| A02-015 | 只拥抱陪伴的伙伴（Cuddle Buddy） | `relationship_variant` | 待核实 |
| A02-016 | 非性亲密陪伴关系 | `relationship_variant` | 待核实 |
| A02-017 | 自愿禁欲伴侣 | `relationship_variant` | 待核实 |
| A02-018 | 浪漫但无性关系的伴侣 | `relationship_variant` | 待核实 |
| A02-019 | 约定边界的亲密探索伙伴 | `relationship_variant` | 待核实 |
| A02-020 | 成人角色扮演伙伴 | `relationship_variant` | 待核实 |
| A02-021 | 成人BDSM场景伙伴（Play Partner） | `relationship_variant` | 待核实 |
| A02-022 | 成人自愿D/s关系 | `relationship_variant` | 待核实 |
| A02-023 | 仅在特定活动中相处的亲密伙伴 | `relationship_variant` | 待核实 |
| A02-024 | 可反复见面的非承诺关系 | `relationship_variant` | 待核实 |

### A03 · 排他性、多伴侣与关系网络结构（29）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A03-001 | 一对一排他关系（Monogamy） | `structural_attribute` | 工作草稿 |
| A03-002 | 开放关系（Open Relationship） | `structural_attribute` | 工作草稿 |
| A03-003 | 开放婚姻（Open Marriage） | `structural_attribute` | 待核实 |
| A03-004 | 有限开放关系（Monogamish） | `structural_attribute` | 待核实 |
| A03-005 | 共识性非单偶关系（CNM） | `structural_attribute` | 待核实 |
| A03-006 | 伦理非单偶关系（ENM） | `structural_attribute` | 待核实 |
| A03-007 | 多重恋爱关系（Polyamory） | `structural_attribute` | 待核实 |
| A03-008 | 有主次的多重伴侣关系 | `structural_attribute` | 待核实 |
| A03-009 | 无主次的多重伴侣关系 | `structural_attribute` | 待核实 |
| A03-010 | 独立型多重伴侣（Solo Poly） | `structural_attribute` | 待核实 |
| A03-011 | 封闭式多人伴侣关系（Polyfidelity） | `structural_attribute` | 待核实 |
| A03-012 | 一方单偶一方多伴侣的共识安排（Mono–Poly） | `structural_attribute` | 待核实 |
| A03-013 | 关系无政府主义（Relationship Anarchy） | `structural_attribute` | 待核实 |
| A03-014 | 共享住所的亲密伴侣（Nesting Partner） | `structural_attribute` | 待核实 |
| A03-015 | 锚定伴侣（Anchor Partner） | `structural_attribute` | 待核实 |
| A03-016 | 主要伴侣（Primary Partner） | `structural_attribute` | 待核实 |
| A03-017 | 次要伴侣（Secondary Partner） | `structural_attribute` | 待核实 |
| A03-018 | 远期不常见面的彗星伴侣（Comet Partner） | `structural_attribute` | 待核实 |
| A03-019 | 卫星式伴侣（Satellite Partner） | `structural_attribute` | 待核实 |
| A03-020 | 交换伴侣式非单偶结构（Swinging） | `structural_attribute` | 待核实 |
| A03-021 | 并行式多伴侣网络（Parallel Poly） | `network_structure` | 待核实 |
| A03-022 | 共桌式多伴侣网络（Kitchen-table Poly） | `network_structure` | 待核实 |
| A03-023 | 多伴侣的伴侣之伴侣（Metamour） | `network_structure` | 待核实 |
| A03-024 | 枢纽伴侣关系（Hinge/Vee） | `network_structure` | 待核实 |
| A03-025 | 三人伴侣（Triad/Throuple） | `network_structure` | 待核实 |
| A03-026 | 四人伴侣（Quad） | `network_structure` | 待核实 |
| A03-027 | 多伴侣网络（Polycule） | `network_structure` | 待核实 |
| A03-028 | 各方知情但不互相交往的多边结构 | `network_structure` | 待核实 |
| A03-029 | 约定部分对外关系开放的伴侣 | `structural_attribute` | 待核实 |

### A04 · 非浪漫友谊与深度情感伙伴（32）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A04-001 | 普通朋友 | `relationship_archetype` | 工作草稿 |
| A04-002 | 新朋友 | `relationship_variant` | 待核实 |
| A04-003 | 泛泛之交 | `relationship_variant` | 待核实 |
| A04-004 | 酒肉朋友（俗称） | `relationship_variant` | 待核实 |
| A04-005 | 兴趣朋友 | `relationship_variant` | 待核实 |
| A04-006 | 工作外朋友 | `relationship_variant` | 待核实 |
| A04-007 | 亲密朋友 | `relationship_variant` | 待核实 |
| A04-008 | 密友 | `relationship_variant` | 待核实 |
| A04-009 | 挚友 | `relationship_variant` | 待核实 |
| A04-010 | 最好的朋友（Best Friend） | `relationship_variant` | 待核实 |
| A04-011 | 知己 | `relationship_variant` | 待核实 |
| A04-012 | 倾诉对象 | `relationship_variant` | 待核实 |
| A04-013 | 情绪支持伙伴 | `relationship_variant` | 待核实 |
| A04-014 | 精神伙伴 | `relationship_variant` | 待核实 |
| A04-015 | 柏拉图式朋友 | `relationship_variant` | 待核实 |
| A04-016 | 柏拉图式长期伴侣（PLP） | `relationship_variant` | 待核实 |
| A04-017 | 酷儿柏拉图式伴侣（QPR） | `relationship_variant` | 待核实 |
| A04-018 | 非浪漫共生伙伴 | `relationship_variant` | 工作草稿 |
| A04-019 | 终身朋友 | `relationship_variant` | 待核实 |
| A04-020 | 从小一起长大的朋友 | `relationship_variant` | 待核实 |
| A04-021 | 发小 | `relationship_variant` | 待核实 |
| A04-022 | 笔友 | `relationship_variant` | 待核实 |
| A04-023 | 通信朋友 | `relationship_variant` | 待核实 |
| A04-024 | 网络知己 | `relationship_variant` | 待核实 |
| A04-025 | 陪伴型朋友 | `relationship_variant` | 待核实 |
| A04-026 | 跨代朋友 | `relationship_variant` | 待核实 |
| A04-027 | 非血缘选择性家人（Chosen Family） | `relationship_variant` | 待核实 |
| A04-028 | 结拜兄弟姐妹 | `relationship_variant` | 待核实 |
| A04-029 | 朋友兼共同生活伙伴 | `composite_relation` | 工作草稿 |
| A04-030 | 共同抗压伙伴 | `relationship_variant` | 待核实 |
| A04-031 | 互相监督伙伴 | `relationship_variant` | 待核实 |
| A04-032 | 不以恋爱为目的的亲密朋友 | `relationship_variant` | 待核实 |

### A05 · 休闲、文化与娱乐搭子（42）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A05-001 | 饭搭子 | `activity_scenario` | 待核实 |
| A05-002 | 夜宵搭子 | `activity_scenario` | 待核实 |
| A05-003 | 早午餐搭子 | `activity_scenario` | 待核实 |
| A05-004 | 咖啡搭子 | `activity_scenario` | 待核实 |
| A05-005 | 奶茶搭子 | `activity_scenario` | 待核实 |
| A05-006 | 烘焙搭子 | `activity_scenario` | 待核实 |
| A05-007 | 探店搭子 | `activity_scenario` | 待核实 |
| A05-008 | 电影搭子 | `activity_scenario` | 待核实 |
| A05-009 | 追剧搭子 | `activity_scenario` | 待核实 |
| A05-010 | 看展搭子 | `activity_scenario` | 待核实 |
| A05-011 | 博物馆搭子 | `activity_scenario` | 待核实 |
| A05-012 | 美术馆搭子 | `activity_scenario` | 待核实 |
| A05-013 | 音乐会搭子 | `activity_scenario` | 待核实 |
| A05-014 | 演唱会搭子 | `activity_scenario` | 待核实 |
| A05-015 | 音乐节搭子 | `activity_scenario` | 待核实 |
| A05-016 | 剧场搭子 | `activity_scenario` | 待核实 |
| A05-017 | 戏剧搭子 | `activity_scenario` | 待核实 |
| A05-018 | 脱口秀搭子 | `activity_scenario` | 待核实 |
| A05-019 | 书店搭子 | `activity_scenario` | 待核实 |
| A05-020 | 读书搭子 | `activity_scenario` | 待核实 |
| A05-021 | 逛街搭子 | `activity_scenario` | 待核实 |
| A05-022 | Citywalk搭子 | `activity_scenario` | 待核实 |
| A05-023 | 公园散步搭子 | `activity_scenario` | 待核实 |
| A05-024 | 摄影外拍搭子 | `activity_scenario` | 待核实 |
| A05-025 | 街拍搭子 | `activity_scenario` | 待核实 |
| A05-026 | 观鸟搭子 | `activity_scenario` | 待核实 |
| A05-027 | 桌游搭子 | `activity_scenario` | 待核实 |
| A05-028 | 棋牌搭子 | `activity_scenario` | 待核实 |
| A05-029 | 剧本杀搭子 | `activity_scenario` | 待核实 |
| A05-030 | 密室逃脱搭子 | `activity_scenario` | 待核实 |
| A05-031 | 卡拉OK搭子 | `activity_scenario` | 待核实 |
| A05-032 | 电竞开黑搭子 | `activity_scenario` | 待核实 |
| A05-033 | 主机游戏搭子 | `activity_scenario` | 待核实 |
| A05-034 | 联机游戏搭子 | `activity_scenario` | 待核实 |
| A05-035 | 二次元同好搭子 | `activity_scenario` | 待核实 |
| A05-036 | 漫展搭子 | `activity_scenario` | 待核实 |
| A05-037 | 手工DIY搭子 | `activity_scenario` | 待核实 |
| A05-038 | 拼单搭子 | `activity_scenario` | 待核实 |
| A05-039 | 宠物玩耍搭子 | `activity_scenario` | 待核实 |
| A05-040 | 遛狗搭子 | `activity_scenario` | 待核实 |
| A05-041 | 旅行搭子 | `activity_scenario` | 待核实 |
| A05-042 | 短途周末游搭子 | `activity_scenario` | 待核实 |

### A06 · 运动、户外和技能活动搭子（35）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A06-001 | 跑步搭子 | `activity_scenario` | 待核实 |
| A06-002 | 马拉松训练搭子 | `activity_scenario` | 待核实 |
| A06-003 | 健身搭子 | `activity_scenario` | 待核实 |
| A06-004 | 力量训练搭子 | `activity_scenario` | 待核实 |
| A06-005 | 瑜伽搭子 | `activity_scenario` | 待核实 |
| A06-006 | 普拉提搭子 | `activity_scenario` | 待核实 |
| A06-007 | 羽毛球搭子 | `activity_scenario` | 待核实 |
| A06-008 | 乒乓球搭子 | `activity_scenario` | 待核实 |
| A06-009 | 网球搭子 | `activity_scenario` | 待核实 |
| A06-010 | 壁球搭子 | `activity_scenario` | 待核实 |
| A06-011 | 篮球搭子 | `activity_scenario` | 待核实 |
| A06-012 | 足球搭子 | `activity_scenario` | 待核实 |
| A06-013 | 排球搭子 | `activity_scenario` | 待核实 |
| A06-014 | 飞盘搭子 | `activity_scenario` | 待核实 |
| A06-015 | 游泳搭子 | `activity_scenario` | 待核实 |
| A06-016 | 攀岩搭子 | `activity_scenario` | 待核实 |
| A06-017 | 抱石搭子 | `activity_scenario` | 待核实 |
| A06-018 | 骑行搭子 | `activity_scenario` | 待核实 |
| A06-019 | 徒步搭子 | `activity_scenario` | 待核实 |
| A06-020 | 露营搭子 | `activity_scenario` | 待核实 |
| A06-021 | 滑雪搭子 | `activity_scenario` | 工作草稿 |
| A06-022 | 单板滑雪搭子 | `activity_scenario` | 待核实 |
| A06-023 | 潜水搭子 | `activity_scenario` | 待核实 |
| A06-024 | 冲浪搭子 | `activity_scenario` | 待核实 |
| A06-025 | 桨板搭子 | `activity_scenario` | 待核实 |
| A06-026 | 皮划艇搭子 | `activity_scenario` | 待核实 |
| A06-027 | 钓鱼搭子 | `activity_scenario` | 待核实 |
| A06-028 | 舞蹈练习搭子 | `activity_scenario` | 待核实 |
| A06-029 | 拳击练习搭子 | `activity_scenario` | 待核实 |
| A06-030 | 武术练习搭子 | `activity_scenario` | 待核实 |
| A06-031 | 高尔夫搭子 | `activity_scenario` | 待核实 |
| A06-032 | 城市探险搭子 | `activity_scenario` | 待核实 |
| A06-033 | 自然观察搭子 | `activity_scenario` | 待核实 |
| A06-034 | 户外摄影搭子 | `activity_scenario` | 待核实 |
| A06-035 | 技能互练搭子 | `activity_scenario` | 待核实 |

### A07 · 生活、居住与共同管理（27）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A07-001 | 室友 | `relationship_archetype` | 工作草稿 |
| A07-002 | 合租室友 | `relationship_variant` | 待核实 |
| A07-003 | 合租发起人 | `relationship_variant` | 待核实 |
| A07-004 | 共同租房伙伴 | `relationship_variant` | 待核实 |
| A07-005 | 共享工作居住伙伴 | `relationship_variant` | 待核实 |
| A07-006 | 长期同住伙伴 | `relationship_variant` | 工作草稿 |
| A07-007 | 短期同住伙伴 | `relationship_variant` | 待核实 |
| A07-008 | 共居社区伙伴 | `relationship_variant` | 待核实 |
| A07-009 | 共同购房伙伴 | `relationship_variant` | 待核实 |
| A07-010 | 房屋共同所有人 | `relationship_variant` | 待核实 |
| A07-011 | 共同家务分工伙伴 | `relationship_variant` | 待核实 |
| A07-012 | 共同做饭搭子 | `activity_scenario` | 待核实 |
| A07-013 | 采购与分账伙伴 | `relationship_variant` | 待核实 |
| A07-014 | 拼车同行伙伴 | `relationship_variant` | 待核实 |
| A07-015 | 固定通勤搭子 | `activity_scenario` | 待核实 |
| A07-016 | 宠物共同照料人 | `relationship_variant` | 待核实 |
| A07-017 | 宠物临时托管互助伙伴 | `relationship_variant` | 待核实 |
| A07-018 | 家庭事务分工伙伴 | `relationship_variant` | 待核实 |
| A07-019 | 共享储物与设备伙伴 | `relationship_variant` | 待核实 |
| A07-020 | 共同养老生活伙伴 | `relationship_variant` | 待核实 |
| A07-021 | 老年互助生活伙伴 | `relationship_variant` | 待核实 |
| A07-022 | 共同生活的柏拉图伴侣 | `relationship_variant` | 待核实 |
| A07-023 | 无浪漫共同居住者 | `relationship_variant` | 待核实 |
| A07-024 | 短期旅行分房同住伙伴 | `relationship_variant` | 待核实 |
| A07-025 | 互为紧急联系人 | `relationship_variant` | 待核实 |
| A07-026 | 长期生活互助联系人 | `relationship_variant` | 待核实 |
| A07-027 | 共同照护亲属的成年人 | `relationship_variant` | 待核实 |

### A08 · 育儿、养老、照护与支持（20）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A08-001 | 非恋爱共同育儿伙伴 | `role_or_arrangement` | 待核实 |
| A08-002 | 共同抚养人（Co-parent） | `role_or_arrangement` | 待核实 |
| A08-003 | 共同监护责任人 | `role_or_arrangement` | 待核实 |
| A08-004 | 隔代育儿协作伙伴 | `role_or_arrangement` | 待核实 |
| A08-005 | 临时儿童照护互助人 | `role_or_arrangement` | 待核实 |
| A08-006 | 孕育计划合作伙伴（涉及专项法律医疗） | `role_or_arrangement` | 待核实 |
| A08-007 | 亲子教育协作伙伴 | `role_or_arrangement` | 待核实 |
| A08-008 | 共同照护老人伙伴 | `role_or_arrangement` | 待核实 |
| A08-009 | 非亲属养老互助伙伴 | `role_or_arrangement` | 待核实 |
| A08-010 | 日常生活照料伙伴 | `role_or_arrangement` | 待核实 |
| A08-011 | 健康管理互助伙伴 | `role_or_arrangement` | 待核实 |
| A08-012 | 术后恢复协助人 | `role_or_arrangement` | 待核实 |
| A08-013 | 残障生活支持伙伴 | `role_or_arrangement` | 待核实 |
| A08-014 | 无偿照护志愿伙伴 | `role_or_arrangement` | 待核实 |
| A08-015 | 互助陪诊伙伴 | `role_or_arrangement` | 待核实 |
| A08-016 | 日常接送互助伙伴 | `role_or_arrangement` | 待核实 |
| A08-017 | 远程安全确认伙伴 | `role_or_arrangement` | 待核实 |
| A08-018 | 共同制定应急预案的伙伴 | `role_or_arrangement` | 待核实 |
| A08-019 | 医疗决定委托人与受托人（依法律） | `legal_role` | 待核实 |
| A08-020 | 遗嘱执行人与指定人（依法） | `role_or_arrangement` | 待核实 |

### A09 · 学习、科研与成长（28）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A09-001 | 同班同学 | `role_or_collaboration` | 待核实 |
| A09-002 | 同专业同学 | `role_or_collaboration` | 待核实 |
| A09-003 | 校友 | `role_or_collaboration` | 待核实 |
| A09-004 | 学习搭子 | `activity_scenario` | 工作草稿 |
| A09-005 | 自习搭子 | `activity_scenario` | 待核实 |
| A09-006 | 备考搭子 | `activity_scenario` | 待核实 |
| A09-007 | 口语练习搭子 | `activity_scenario` | 待核实 |
| A09-008 | 语言交换伙伴 | `activity_scenario` | 工作草稿 |
| A09-009 | 读书讨论伙伴 | `role_or_collaboration` | 待核实 |
| A09-010 | 刷题搭子 | `activity_scenario` | 待核实 |
| A09-011 | 编程结对伙伴 | `role_or_collaboration` | 待核实 |
| A09-012 | 算法练习伙伴 | `role_or_collaboration` | 待核实 |
| A09-013 | 科研讨论伙伴 | `role_or_collaboration` | 待核实 |
| A09-014 | 联合研究伙伴 | `role_or_collaboration` | 待核实 |
| A09-015 | 论文合作者 | `role_or_collaboration` | 待核实 |
| A09-016 | 论文互审伙伴 | `role_or_collaboration` | 待核实 |
| A09-017 | 开源贡献搭子 | `activity_scenario` | 待核实 |
| A09-018 | 导师与学生 | `role_or_collaboration` | 待核实 |
| A09-019 | 学术指导人与被指导人 | `role_or_collaboration` | 待核实 |
| A09-020 | 同行评议者与作者 | `role_or_collaboration` | 待核实 |
| A09-021 | 技能交换伙伴 | `role_or_collaboration` | 待核实 |
| A09-022 | 职业发展互助伙伴 | `role_or_collaboration` | 待核实 |
| A09-023 | 成长监督伙伴 | `role_or_collaboration` | 待核实 |
| A09-024 | 习惯养成伙伴 | `role_or_collaboration` | 待核实 |
| A09-025 | 目标执行监督伙伴 | `role_or_collaboration` | 待核实 |
| A09-026 | 模拟面试伙伴 | `role_or_collaboration` | 待核实 |
| A09-027 | 知识分享互助伙伴 | `role_or_collaboration` | 待核实 |
| A09-028 | 跨学科合作伙伴 | `role_or_collaboration` | 待核实 |

### A10 · 职场、创业与工程协作（31）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A10-001 | 同事 | `social_role` | 工作草稿 |
| A10-002 | 跨部门同事 | `role_or_collaboration` | 待核实 |
| A10-003 | 项目合作者 | `role_or_collaboration` | 待核实 |
| A10-004 | 项目合伙人 | `role_or_collaboration` | 待核实 |
| A10-005 | 项目负责人和成员 | `role_or_collaboration` | 待核实 |
| A10-006 | 雇主与雇员 | `role_or_collaboration` | 待核实 |
| A10-007 | 上司与下属 | `role_or_collaboration` | 待核实 |
| A10-008 | 求职者与招聘者 | `role_or_collaboration` | 待核实 |
| A10-009 | 招聘推荐人与候选人 | `role_or_collaboration` | 待核实 |
| A10-010 | 创业合伙人 | `relationship_archetype` | 工作草稿 |
| A10-011 | 联合创始人 | `role_or_collaboration` | 待核实 |
| A10-012 | 企业联合经营者 | `role_or_collaboration` | 待核实 |
| A10-013 | 产品经理与工程师 | `role_or_collaboration` | 待核实 |
| A10-014 | 设计师与开发者 | `role_or_collaboration` | 待核实 |
| A10-015 | 技术顾问与团队 | `role_or_collaboration` | 待核实 |
| A10-016 | 运营与创作者 | `role_or_collaboration` | 待核实 |
| A10-017 | 供稿人与编辑 | `role_or_collaboration` | 待核实 |
| A10-018 | 自由职业者与客户 | `role_or_collaboration` | 待核实 |
| A10-019 | 外包方与发包方 | `role_or_collaboration` | 待核实 |
| A10-020 | 行业导师与学员 | `role_or_collaboration` | 待核实 |
| A10-021 | 职业教练与客户 | `role_or_collaboration` | 待核实 |
| A10-022 | 同行交流伙伴 | `role_or_collaboration` | 待核实 |
| A10-023 | 商务拓展伙伴 | `role_or_collaboration` | 待核实 |
| A10-024 | 联合营销伙伴 | `role_or_collaboration` | 待核实 |
| A10-025 | 会议共创伙伴 | `role_or_collaboration` | 待核实 |
| A10-026 | 社区共同管理员 | `role_or_collaboration` | 待核实 |
| A10-027 | 开源项目维护者与贡献者 | `role_or_collaboration` | 待核实 |
| A10-028 | 联合专利发明人 | `role_or_collaboration` | 待核实 |
| A10-029 | 科研项目负责人和成员 | `role_or_collaboration` | 待核实 |
| A10-030 | 实验协作伙伴 | `role_or_collaboration` | 待核实 |
| A10-031 | 结对代码审查伙伴 | `role_or_collaboration` | 待核实 |

### A11 · 商业、资金与资源交换（26）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A11-001 | 买方与卖方 | `exchange_or_contract_role` | 待核实 |
| A11-002 | 客户与商家 | `exchange_or_contract_role` | 待核实 |
| A11-003 | 委托人与代理人 | `exchange_or_contract_role` | 待核实 |
| A11-004 | 业务介绍人与被介绍人 | `exchange_or_contract_role` | 待核实 |
| A11-005 | 分销方与供应方 | `exchange_or_contract_role` | 待核实 |
| A11-006 | 批发商与零售商 | `exchange_or_contract_role` | 待核实 |
| A11-007 | 合作供应商关系 | `exchange_or_contract_role` | 待核实 |
| A11-008 | 合资合作伙伴 | `exchange_or_contract_role` | 待核实 |
| A11-009 | 投资人与创业者 | `exchange_or_contract_role` | 待核实 |
| A11-010 | 投资人与基金管理人 | `exchange_or_contract_role` | 待核实 |
| A11-011 | 联合投资伙伴 | `exchange_or_contract_role` | 待核实 |
| A11-012 | 资金出借人与借款人 | `exchange_or_contract_role` | 待核实 |
| A11-013 | 债权人与债务人 | `exchange_or_contract_role` | 待核实 |
| A11-014 | 担保人与被担保人 | `exchange_or_contract_role` | 待核实 |
| A11-015 | 房东与租客 | `exchange_or_contract_role` | 工作草稿 |
| A11-016 | 出租人与承租人 | `exchange_or_contract_role` | 待核实 |
| A11-017 | 房产买方与中介 | `exchange_or_contract_role` | 待核实 |
| A11-018 | 版权许可人与被许可人 | `exchange_or_contract_role` | 待核实 |
| A11-019 | 品牌授权人与使用方 | `exchange_or_contract_role` | 待核实 |
| A11-020 | 平台商家与消费者 | `exchange_or_contract_role` | 待核实 |
| A11-021 | 资源互换伙伴 | `exchange_or_contract_role` | 待核实 |
| A11-022 | 技能互换伙伴 | `exchange_or_contract_role` | 待核实 |
| A11-023 | 赞助人与受赞助人 | `exchange_or_contract_role` | 待核实 |
| A11-024 | 会员与服务提供者 | `exchange_or_contract_role` | 待核实 |
| A11-025 | 共同承担费用的合作伙伴 | `exchange_or_contract_role` | 待核实 |
| A11-026 | 共同管理资产的成年人 | `exchange_or_contract_role` | 待核实 |

### A12 · 专业服务与照护服务（30）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A12-001 | 医生与患者 | `service_role` | 待核实 |
| A12-002 | 护士与患者 | `service_role` | 待核实 |
| A12-003 | 心理咨询师与来访者 | `service_role` | 待核实 |
| A12-004 | 律师与当事人 | `service_role` | 待核实 |
| A12-005 | 法律顾问与客户 | `service_role` | 待核实 |
| A12-006 | 会计师与客户 | `service_role` | 待核实 |
| A12-007 | 财务顾问与客户 | `service_role` | 待核实 |
| A12-008 | 理财顾问与客户 | `service_role` | 待核实 |
| A12-009 | 税务顾问与纳税人 | `service_role` | 待核实 |
| A12-010 | 保险经纪人与投保人 | `service_role` | 待核实 |
| A12-011 | 教师与学员 | `service_role` | 待核实 |
| A12-012 | 家教与学生 | `service_role` | 待核实 |
| A12-013 | 私人教练与学员 | `service_role` | 待核实 |
| A12-014 | 营养师与客户 | `service_role` | 待核实 |
| A12-015 | 康复师与患者 | `service_role` | 待核实 |
| A12-016 | 照护员与被照护人 | `service_role` | 待核实 |
| A12-017 | 家政服务者与雇主 | `service_role` | 待核实 |
| A12-018 | 保姆与雇主 | `service_role` | 待核实 |
| A12-019 | 宠物寄养者与宠物主人 | `service_role` | 待核实 |
| A12-020 | 摄影师与客户 | `service_role` | 待核实 |
| A12-021 | 设计师与客户 | `service_role` | 待核实 |
| A12-022 | 翻译与委托人 | `service_role` | 待核实 |
| A12-023 | 司机与乘客 | `service_role` | 待核实 |
| A12-024 | 导游与旅客 | `service_role` | 待核实 |
| A12-025 | 咨询师与客户 | `service_role` | 待核实 |
| A12-026 | 活动策划人与客户 | `service_role` | 待核实 |
| A12-027 | 助理与委托人 | `service_role` | 待核实 |
| A12-028 | 中介与委托人 | `service_role` | 待核实 |
| A12-029 | 陪诊服务者与客户 | `service_role` | 待核实 |
| A12-030 | 临时任务承接人与发布人 | `service_role` | 待核实 |

### A13 · 邻里、组织、公共参与（20）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A13-001 | 邻居 | `social_role` | 待核实 |
| A13-002 | 同楼居民 | `social_role` | 待核实 |
| A13-003 | 社区互助伙伴 | `social_role` | 待核实 |
| A13-004 | 小区志愿者伙伴 | `social_role` | 待核实 |
| A13-005 | 公共议题讨论伙伴 | `social_role` | 待核实 |
| A13-006 | 志愿服务搭子 | `social_role` | 待核实 |
| A13-007 | 公益项目合作者 | `social_role` | 待核实 |
| A13-008 | 协会成员 | `social_role` | 待核实 |
| A13-009 | 社团成员 | `social_role` | 待核实 |
| A13-010 | 兴趣俱乐部成员 | `social_role` | 待核实 |
| A13-011 | 共同社区活动组织者 | `social_role` | 待核实 |
| A13-012 | 宗教团体同伴 | `social_role` | 待核实 |
| A13-013 | 校友会活动伙伴 | `social_role` | 待核实 |
| A13-014 | 公共活动筹办搭子 | `social_role` | 待核实 |
| A13-015 | 公益募捐合作伙伴 | `social_role` | 待核实 |
| A13-016 | 互助社群搭子 | `social_role` | 待核实 |
| A13-017 | 消费者权益互助伙伴 | `social_role` | 待核实 |
| A13-018 | 救灾互助志愿者 | `social_role` | 待核实 |
| A13-019 | 共同倡议者 | `social_role` | 待核实 |
| A13-020 | 社区沟通协调者 | `social_role` | 待核实 |

### A14 · 在线、创作与虚拟环境（24）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A14-001 | 网友 | `social_role` | 待核实 |
| A14-002 | 网络朋友 | `social_role` | 待核实 |
| A14-003 | 网络笔友 | `social_role` | 待核实 |
| A14-004 | 游戏好友 | `social_role` | 待核实 |
| A14-005 | 游戏公会队友 | `social_role` | 待核实 |
| A14-006 | 线上学习伙伴 | `social_role` | 待核实 |
| A14-007 | 远程工作伙伴 | `social_role` | 待核实 |
| A14-008 | 数字游民搭子 | `social_role` | 待核实 |
| A14-009 | 内容共创伙伴 | `social_role` | 待核实 |
| A14-010 | 播客联合主播 | `social_role` | 待核实 |
| A14-011 | 直播连麦伙伴 | `social_role` | 待核实 |
| A14-012 | 内容创作者与观众 | `asymmetric_social_role` | 待核实 |
| A14-013 | 创作者与粉丝 | `asymmetric_social_role` | 待核实 |
| A14-014 | 订阅者与作者 | `asymmetric_social_role` | 待核实 |
| A14-015 | 社群群友 | `social_role` | 待核实 |
| A14-016 | 论坛讨论伙伴 | `social_role` | 待核实 |
| A14-017 | 虚拟世界共同探索伙伴 | `social_role` | 待核实 |
| A14-018 | 线上角色扮演搭子 | `social_role` | 待核实 |
| A14-019 | 线上共同创作设定伙伴 | `social_role` | 待核实 |
| A14-020 | 远程协作维护人 | `social_role` | 待核实 |
| A14-021 | 跨国线上交流伙伴 | `social_role` | 待核实 |
| A14-022 | 网络互助伙伴 | `social_role` | 待核实 |
| A14-023 | 线上语言交换伙伴 | `social_role` | 待核实 |
| A14-024 | 长期远程知己 | `social_role` | 待核实 |

### A15 · 血缘、法律、家庭既有角色（27）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A15-001 | 父母与子女 | `ascribed_or_legal_role` | 工作草稿 |
| A15-002 | 继父母与继子女 | `ascribed_or_legal_role` | 待核实 |
| A15-003 | 养父母与养子女 | `ascribed_or_legal_role` | 待核实 |
| A15-004 | 监护人与被监护人 | `ascribed_or_legal_role` | 待核实 |
| A15-005 | 祖父母与孙辈 | `ascribed_or_legal_role` | 待核实 |
| A15-006 | 外祖父母与外孙辈 | `ascribed_or_legal_role` | 待核实 |
| A15-007 | 亲兄弟姐妹 | `ascribed_or_legal_role` | 待核实 |
| A15-008 | 同父异母兄弟姐妹 | `ascribed_or_legal_role` | 待核实 |
| A15-009 | 同母异父兄弟姐妹 | `ascribed_or_legal_role` | 待核实 |
| A15-010 | 堂兄弟姐妹 | `ascribed_or_legal_role` | 待核实 |
| A15-011 | 表兄弟姐妹 | `ascribed_or_legal_role` | 待核实 |
| A15-012 | 伯叔姑舅姨与侄甥辈 | `ascribed_or_legal_role` | 待核实 |
| A15-013 | 岳父母与女婿 | `ascribed_or_legal_role` | 待核实 |
| A15-014 | 公婆与儿媳 | `ascribed_or_legal_role` | 待核实 |
| A15-015 | 姻亲 | `ascribed_or_legal_role` | 待核实 |
| A15-016 | 配偶 | `ascribed_or_legal_role` | 待核实 |
| A15-017 | 合法婚姻伴侣 | `ascribed_or_legal_role` | 待核实 |
| A15-018 | 民事结合伴侣 | `ascribed_or_legal_role` | 待核实 |
| A15-019 | 前配偶 | `ascribed_or_legal_role` | 待核实 |
| A15-020 | 离婚后共同育儿人 | `ascribed_or_legal_role` | 待核实 |
| A15-021 | 丧偶者与亡配偶（历史） | `lifecycle_state` | 待核实 |
| A15-022 | 前继亲关系 | `lifecycle_state` | 待核实 |
| A15-023 | 收养关系 | `ascribed_or_legal_role` | 待核实 |
| A15-024 | 寄养照护关系 | `ascribed_or_legal_role` | 待核实 |
| A15-025 | 家族企业亲属合伙人 | `ascribed_or_legal_role` | 待核实 |
| A15-026 | 家庭紧急联系人（已授权） | `ascribed_or_legal_role` | 待核实 |
| A15-027 | 家族财富受益人与受托人 | `ascribed_or_legal_role` | 待核实 |

### A16 · 权力、法定程序与社会地位角色（20）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A16-001 | 主管与直接下属 | `institutional_role` | 待核实 |
| A16-002 | 雇主与实习生 | `institutional_role` | 待核实 |
| A16-003 | 教师与在读学生 | `institutional_role` | 待核实 |
| A16-004 | 导师与被指导学生 | `institutional_role` | 待核实 |
| A16-005 | 考官与考生 | `institutional_role` | 待核实 |
| A16-006 | 雇主与劳务提供者 | `institutional_role` | 待核实 |
| A16-007 | 监护人与受监护人 | `institutional_role` | 待核实 |
| A16-008 | 监管者与被监管对象 | `institutional_role` | 待核实 |
| A16-009 | 评审人与申请者 | `institutional_role` | 待核实 |
| A16-010 | 裁判与运动员 | `institutional_role` | 待核实 |
| A16-011 | 仲裁员与仲裁当事人 | `institutional_role` | 待核实 |
| A16-012 | 调解人与争议当事人 | `institutional_role` | 待核实 |
| A16-013 | 原告与被告 | `institutional_role` | 待核实 |
| A16-014 | 投诉人与被投诉人 | `institutional_role` | 待核实 |
| A16-015 | 举报人与被举报人 | `institutional_role` | 待核实 |
| A16-016 | 证人与被指认人 | `institutional_role` | 待核实 |
| A16-017 | 代理人与被代理人 | `institutional_role` | 待核实 |
| A16-018 | 律师与代理当事人 | `institutional_role` | 待核实 |
| A16-019 | 受托人与受益人 | `institutional_role` | 待核实 |
| A16-020 | 机构代表人与被服务人 | `institutional_role` | 待核实 |

### A17 · 关系变化、边界和冲突状态（28）

| ID | 名称 | 初步类型 | 定义状态 |
|---|---|---|---|
| A17-001 | 陌生人 | `lifecycle_state` | 工作草稿 |
| A17-002 | 已认识但不联系 | `lifecycle_or_risk_state` | 待核实 |
| A17-003 | 失联的熟人 | `lifecycle_or_risk_state` | 待核实 |
| A17-004 | 单方面喜欢 | `lifecycle_or_risk_state` | 待核实 |
| A17-005 | 被单方面喜欢 | `lifecycle_or_risk_state` | 待核实 |
| A17-006 | 曾经约会过的人 | `lifecycle_or_risk_state` | 待核实 |
| A17-007 | 前任恋人 | `lifecycle_state` | 工作草稿 |
| A17-008 | 前任室友 | `lifecycle_or_risk_state` | 待核实 |
| A17-009 | 前朋友 | `lifecycle_or_risk_state` | 待核实 |
| A17-010 | 前同事 | `lifecycle_or_risk_state` | 待核实 |
| A17-011 | 刚分手的双方 | `lifecycle_or_risk_state` | 待核实 |
| A17-012 | 分手后保持朋友 | `lifecycle_or_risk_state` | 待核实 |
| A17-013 | 分手后共同财产待清算 | `lifecycle_or_risk_state` | 待核实 |
| A17-014 | 正在冷静期的伴侣 | `lifecycle_or_risk_state` | 待核实 |
| A17-015 | 暂停联系的伙伴 | `lifecycle_or_risk_state` | 待核实 |
| A17-016 | 希望复合的双方 | `lifecycle_or_risk_state` | 待核实 |
| A17-017 | 已明确拒绝关系的一方 | `lifecycle_or_risk_state` | 待核实 |
| A17-018 | 长期断联 | `lifecycle_or_risk_state` | 待核实 |
| A17-019 | 关系疏远 | `lifecycle_or_risk_state` | 待核实 |
| A17-020 | 竞争对手 | `lifecycle_or_risk_state` | 待核实 |
| A17-021 | 商业竞争方 | `lifecycle_or_risk_state` | 待核实 |
| A17-022 | 意见冲突者 | `lifecycle_or_risk_state` | 待核实 |
| A17-023 | 纠纷双方 | `lifecycle_or_risk_state` | 待核实 |
| A17-024 | 仲裁争议双方 | `lifecycle_or_risk_state` | 待核实 |
| A17-025 | 骚扰者与受害者（仅安全记录） | `risk_state` | 工作草稿 |
| A17-026 | 控制与被控制关系（风险标签） | `risk_state` | 工作草稿 |
| A17-027 | 欺凌者与被欺凌者（风险标签） | `risk_state` | 工作草稿 |
| A17-028 | 存在利益冲突的双方 | `lifecycle_or_risk_state` | 待核实 |

## 下一次编辑循环（建议）

1. 逐卡确认是独立原型、原型变体、活动场景、结构属性、已有身份、阶段还是风险状态。
2. 每条卡片补充一句工作定义、同义词、上位词、典型例子、差异与非例子。
3. 对公开事实补具体来源（DOI、论文、法律或权威词条），不以 AI 自动文本充当证据。
4. 检查跨类近义词并建立 `related_to` / `variant_of` 关系，不直接删除有用别名。
5. 确定独立的用户“意向模板”集合，不能用百科词条数直接当可撮合模式数。