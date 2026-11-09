import { z } from "zod";

export const VERSION = "0.1.0";
export const dimensions = {
  purpose: "关系目的",
  emotion: "情感陪伴",
  romance: "浪漫需求",
  physical: "身体亲密边界",
  commitment: "承诺期限",
  exclusivity: "排他性",
  independence: "自主与独立空间",
  time: "时间投入",
  resources: "经济与资源合作",
  rules: "沟通与协商规则",
} as const;
export type Dimension = keyof typeof dimensions;
type Option = { value: string; label: string };
export type Question = {
  id: string;
  dimension: Dimension | "age" | "context";
  title: string;
  why: string;
  options: Option[];
  hard?: boolean;
  sensitive?: boolean;
};
const opts = (pairs: string[][]): Option[] =>
  pairs.map(([value, label]) => ({ value, label }));
export const questions: Question[] = [
  {
    id: "purpose",
    dimension: "purpose",
    title: "此刻，你最希望一段关系帮助你解决什么需要？",
    why: "先选一个主要方向；多个需要可以分别探索，不强制合并为唯一身份。",
    options: opts([
      ["romantic", "探索长期恋爱与伴侣方向"],
      ["friendship", "有人深聊、互相关心"],
      ["activity", "一起参加活动，轻松相处"],
      ["research", "一起讨论或完成研究"],
      ["learning", "一起学习或交换技能"],
      ["living", "协调共同生活与居住"],
      ["community", "参与社区、互助或共同创作"],
    ]),
  },
  {
    id: "age",
    dimension: "age",
    title: "是否愿意确认自己已满 18 岁，并进入成年人关系问题？",
    why: "自我声明不是年龄核验。未确认时不显示身体亲密题或成年人伴侣推荐；其他方向仍可探索。",
    options: opts([
      ["adult", "已满 18 岁，愿意继续"],
      ["not_adult", "未满 18 岁"],
      ["decline", "不确认，略过成年人问题"],
    ]),
  },
  {
    id: "activity",
    dimension: "context",
    title: "如果本周能约一个活动，你更想做什么？",
    why: "活动方向只决定阅读场景，不推断你的社交性格。",
    options: opts([
      ["food", "吃饭或喝咖啡"],
      ["culture", "看电影、读书或桌游"],
      ["sport", "跑步、健身或球类"],
      ["travel", "散步、徒步或旅行"],
    ]),
  },
  {
    id: "research",
    dimension: "context",
    title: "对方加入研究时，你最需要哪种协作？",
    why: "讨论、共同产出与指导具有不同角色；不据此推定署名资格。",
    options: opts([
      ["discuss", "先讨论问题与方法"],
      ["produce", "一起研究、复核和写作"],
      ["mentor", "希望获得明确指导"],
    ]),
  },
  {
    id: "emotion",
    dimension: "emotion",
    title: "忙碌的一周结束后，你希望怎样与对方相处？",
    why: "衡量的是当前互动期待，不是情绪状况或人格。",
    options: opts([
      ["deep", "希望能深聊生活和重要感受"],
      ["regular", "有日常问候与适度交流"],
      ["light", "主要围绕共同活动或任务"],
    ]),
  },
  {
    id: "romance",
    dimension: "romance",
    title: "在这次探索中，浪漫表达对你意味着什么？",
    why: "浪漫、陪伴与身体互动分别确认，不由其中一项推断另一项。",
    hard: true,
    options: opts([
      ["yes", "希望包含浪漫联结"],
      ["no", "不希望包含浪漫联结"],
      ["open", "可以了解，暂不设为条件"],
    ]),
  },
  {
    id: "commitment",
    dimension: "commitment",
    title: "如果相处合适，你现在愿意怎样安排未来？",
    why: "长期是方向，不是不能退出的承诺。",
    hard: true,
    options: opts([
      ["long", "希望持续较长时间"],
      ["trial", "先尝试，再讨论下一阶段"],
      ["bounded", "围绕一次活动或一个项目"],
    ]),
  },
  {
    id: "time",
    dimension: "time",
    title: "接下来一个月，你能为这段关系留出怎样的时间？",
    why: "这里使用宽泛安排，不推断确切小时数或对方可用时间。",
    hard: true,
    options: opts([
      ["occasional", "偶尔联系或参加一次活动"],
      ["weekly", "每周可以安排一些固定时间"],
      ["frequent", "愿意较频繁地交流或协作"],
    ]),
  },
  {
    id: "independence",
    dimension: "independence",
    title: "临时有自己的安排时，你更希望怎样处理？",
    why: "个人空间和联络节奏可以协商；不把独立需求解释为疏离。",
    hard: true,
    options: opts([
      ["high", "优先保留独立安排，再协调"],
      ["balanced", "互相告知，平衡共同与个人安排"],
      ["shared", "希望较多共同计划"],
    ]),
  },
  {
    id: "resources",
    dimension: "resources",
    title: "如果合作涉及钱、设备或资料，你倾向怎样安排？",
    why: "不询问收入资产，也不提供金融或法律建议。",
    hard: true,
    options: opts([
      ["separate", "各自负责，不共同管理资源"],
      ["limited", "仅为具体活动分摊或共享"],
      ["pooled", "愿意讨论持续共同管理"],
    ]),
  },
  {
    id: "rules",
    dimension: "rules",
    title: "如果双方期待出现差异，你希望采用什么沟通方式？",
    why: "沟通偏好不保证实际沟通效果；任何方式都不取消同意和退出。",
    options: opts([
      ["explicit", "提前写清关键安排并定期复议"],
      ["checkin", "保持口头沟通，变化时再确认"],
      ["explore", "还不确定，想先了解可以讨论什么"],
    ]),
  },
  {
    id: "physical",
    dimension: "physical",
    title: "这次探索中，你愿意怎样表达身体亲密边界？",
    why: "仅供成年人可选回答，不问经历或性倾向；答案绝不构成对任何人的同意。",
    hard: true,
    sensitive: true,
    options: opts([
      ["no_sex", "不把性互动纳入这段关系"],
      ["discuss", "只在具体协商后决定，不预先许可"],
    ]),
  },
  {
    id: "exclusivity",
    dimension: "exclusivity",
    title: "对于伴侣关系的排他范围，你目前如何考虑？",
    why: "排他不意味着限制朋友或监控；任何结构都需要相关人知情同意。",
    hard: true,
    sensitive: true,
    options: opts([
      ["exclusive", "希望讨论一对一排他安排"],
      ["nonexclusive", "希望了解共识性非排他安排"],
      ["discuss", "暂不确定，先明确范围"],
    ]),
  },
  {
    id: "housing",
    dimension: "context",
    title: "你是否希望这段关系包含共同居住？",
    why: "同住、浪漫和经济合并分别讨论，互不推出。",
    hard: true,
    options: opts([
      ["together", "希望共同居住"],
      ["apart", "希望各自居住"],
      ["discuss", "暂不决定"],
    ]),
  },
];
export const questionById: Record<string, Question> = Object.assign(
  Object.create(null),
  Object.fromEntries(questions.map((q) => [q.id, q])),
);
const AnswerSchema = z
  .object({
    state: z.enum(["answered", "unsure", "skipped", "not_applicable"]),
    value: z.string().nullable(),
    must: z.boolean().default(false),
  })
  .strict();
export type Answer = z.infer<typeof AnswerSchema>;
export type Answers = Record<string, Answer>;
export function sanitizeAnswers(input: unknown): Answers {
  const parsed = z.record(z.string(), AnswerSchema).safeParse(input);
  if (!parsed.success) return {};
  return Object.fromEntries(
    Object.entries(parsed.data)
      .filter(
        ([id, a]) =>
          questionById[id] &&
          (a.state !== "answered" ||
            questionById[id].options.some((o) => o.value === a.value)),
      )
      .map(([id, a]) => [
        id,
        {
          ...a,
          value: a.state === "answered" ? a.value : null,
          must: a.state === "answered" && !!questionById[id].hard && a.must,
        },
      ]),
  );
}
export function valueOf(a: Answers, id: string) {
  return a[id]?.state === "answered" ? a[id].value : null;
}
/** Stable branch order; no randomness, learned model, text inference or unbounded follow-up. */
export function questionPath(input: Answers) {
  const a = sanitizeAnswers(input),
    goal = valueOf(a, "purpose");
  const path = ["purpose"];
  if (goal === "romantic") path.push("age");
  if (goal === "activity") path.push("activity");
  if (goal === "research") path.push("research");
  path.push("emotion");
  if (goal === "romantic" && valueOf(a, "age") === "adult")
    path.push("romance");
  path.push("commitment", "time", "independence");
  if (["research", "learning", "living", "community"].includes(goal ?? ""))
    path.push("resources");
  path.push("rules");
  if (goal === "romantic" && valueOf(a, "age") === "adult")
    path.push("physical", "exclusivity", "housing");
  if (goal === "living") path.push("housing");
  return path;
}
export function activeAnswers(input: Answers) {
  const a = sanitizeAnswers(input);
  return Object.fromEntries(
    questionPath(a)
      .filter((id) => a[id])
      .map((id) => [id, a[id]]),
  );
}
export function nextQuestion(a: Answers) {
  return questionPath(a).find((id) => !a[id]) ?? null;
}
export function updateAnswer(input: Answers, id: string, answer: Answer) {
  return activeAnswers({ ...sanitizeAnswers(input), [id]: answer });
}
type Signal = { values: string[]; basis: string };
export type Template = {
  id: string;
  title: string;
  goal: string;
  adult: boolean;
  signals: Record<string, Signal>;
  scope: string;
};
function t(
  id: string,
  title: string,
  goal: string,
  signals: Record<string, string[]>,
  scope: string,
  adult = false,
): Template {
  return {
    id,
    title,
    goal,
    adult,
    scope,
    signals: Object.fromEntries(
      Object.entries(signals).map(([key, values]) => [
        key,
        {
          values,
          basis: `编辑阅读模板：${scope}；${questionById[key].title}接受选项为 ${values.map((v) => questionById[key].options.find((o) => o.value === v)?.label).join("／")}。不是对所有该类关系的经验断言。`,
        },
      ]),
    ),
  };
}
const companion = {
  emotion: ["deep", "regular"],
  commitment: ["long"],
  time: ["weekly", "frequent"],
  independence: ["high", "balanced", "shared"],
  rules: ["explicit", "checkin", "explore"],
};
const social = {
  romance: ["no", "open"],
  physical: ["no_sex", "discuss"],
  independence: ["high", "balanced"],
  resources: ["separate", "limited"],
  rules: ["explicit", "checkin", "explore"],
};
const romance = {
  ...companion,
  romance: ["yes", "open"],
  physical: ["no_sex", "discuss"],
  resources: ["separate", "limited", "pooled"],
};
const task = {
  emotion: ["light", "regular"],
  commitment: ["trial", "bounded"],
  time: ["occasional", "weekly"],
  ...social,
};
export const templates: Template[] = [
  t(
    "A01-018",
    "长期恋情",
    "romantic",
    romance,
    "以持续浪漫陪伴为阅读入口；排他和住所未定义",
    true,
  ),
  t(
    "A01-013",
    "认真约会",
    "romantic",
    { ...romance, commitment: ["trial"], time: ["occasional", "weekly"] },
    "先了解长期方向，不承诺结果",
    true,
  ),
  t(
    "A01-011",
    "普通约会对象",
    "romantic",
    {
      ...romance,
      commitment: ["trial", "bounded"],
      emotion: ["regular", "light"],
      time: ["occasional", "weekly"],
    },
    "通过约会了解彼此，保留未决定事项",
    true,
  ),
  t(
    "A01-028",
    "分居居住伴侣",
    "romantic",
    {
      ...romance,
      housing: ["apart", "discuss"],
      independence: ["high", "balanced"],
    },
    "保留分开的住所与浪漫联结",
    true,
  ),
  t(
    "A01-029",
    "无性浪漫伴侣",
    "romantic",
    { ...romance, physical: ["no_sex", "discuss"] },
    "浪漫联结中不纳入性互动，不推断性倾向",
    true,
  ),
  t(
    "A01-025",
    "不以婚姻为目标的伴侣",
    "romantic",
    romance,
    "可能的长期方向；是否不以婚姻为目标还需另行确认",
    true,
  ),
  t(
    "A04-007",
    "亲密朋友",
    "friendship",
    { ...social, ...companion },
    "深度交流而不要求浪漫联结",
  ),
  t(
    "A04-001",
    "普通朋友",
    "friendship",
    {
      ...social,
      emotion: ["regular", "light", "deep"],
      commitment: ["long", "trial"],
      time: ["occasional", "weekly"],
    },
    "从互相关心的友谊开始",
  ),
  t(
    "A04-013",
    "情绪支持伙伴",
    "friendship",
    { ...social, ...companion },
    "自愿的情感支持，不替代专业服务",
  ),
  t(
    "A04-016",
    "柏拉图式长期伴侣",
    "friendship",
    { ...social, ...companion },
    "非浪漫的持续伙伴方向，具体生活安排未知",
  ),
  t(
    "A04-022",
    "笔友",
    "friendship",
    {
      ...social,
      emotion: ["deep", "regular"],
      commitment: ["long", "trial"],
      time: ["occasional", "weekly"],
    },
    "以较长文字往来交流，可保留独立节奏",
  ),
  t(
    "A05-001",
    "饭搭子",
    "activity",
    { ...task, activity: ["food"] },
    "以共同用餐为活动范围",
  ),
  t(
    "A05-008",
    "电影搭子",
    "activity",
    { ...task, activity: ["culture"] },
    "以共同观影为活动范围",
  ),
  t(
    "A05-020",
    "读书搭子",
    "activity",
    {
      ...task,
      activity: ["culture"],
      commitment: ["bounded", "trial", "long"],
    },
    "以阅读讨论为活动范围",
  ),
  t(
    "A05-027",
    "桌游搭子",
    "activity",
    { ...task, activity: ["culture"] },
    "以桌游场次为活动范围",
  ),
  t(
    "A06-001",
    "跑步搭子",
    "activity",
    { ...task, activity: ["sport"], commitment: ["trial", "bounded", "long"] },
    "以共同跑步为活动范围，不提供训练处方",
  ),
  t(
    "A06-003",
    "健身搭子",
    "activity",
    { ...task, activity: ["sport"], commitment: ["trial", "bounded", "long"] },
    "以相约锻炼为活动范围，不替代教练",
  ),
  t(
    "A06-007",
    "羽毛球搭子",
    "activity",
    { ...task, activity: ["sport"] },
    "以场地与练习安排为活动范围",
  ),
  t(
    "A05-022",
    "Citywalk 搭子",
    "activity",
    { ...task, activity: ["travel"] },
    "以城市散步为活动范围",
  ),
  t(
    "A05-041",
    "旅行搭子",
    "activity",
    { ...task, activity: ["travel"], resources: ["limited"] },
    "以行程合作为范围，预算和安全须另议",
  ),
  t(
    "A06-019",
    "徒步搭子",
    "activity",
    { ...task, activity: ["travel", "sport"] },
    "以路线同行为范围，能力未知不视为安全保证",
  ),
  t(
    "A09-013",
    "科研讨论伙伴",
    "research",
    {
      ...task,
      research: ["discuss", "produce", "mentor"],
      commitment: ["trial", "bounded", "long"],
    },
    "先讨论问题，未必共同发表",
  ),
  t(
    "A09-014",
    "联合研究伙伴",
    "research",
    {
      ...task,
      research: ["produce", "discuss"],
      commitment: ["long", "bounded", "trial"],
      time: ["weekly", "frequent"],
      resources: ["limited", "pooled"],
    },
    "一起研究与复核，贡献、数据和责任另议",
  ),
  t(
    "A09-015",
    "论文合作者",
    "research",
    {
      ...task,
      research: ["produce"],
      commitment: ["bounded", "long"],
      time: ["weekly", "frequent"],
      resources: ["limited", "pooled"],
    },
    "以论文为产出；须另查作者资格",
  ),
  t(
    "A09-018",
    "导师与学生",
    "research",
    {
      ...task,
      research: ["mentor"],
      commitment: ["long", "trial"],
      time: ["weekly", "frequent"],
    },
    "有指导角色差异；资格、机构和权力边界未知",
  ),
  t(
    "A09-004",
    "学习搭子",
    "learning",
    { ...task, commitment: ["trial", "long", "bounded"] },
    "以共同学习为方向",
  ),
  t(
    "A09-008",
    "语言交换伙伴",
    "learning",
    { ...task, commitment: ["trial", "long", "bounded"] },
    "以语言互练为方向；语言目标尚未询问",
  ),
  t(
    "A09-021",
    "技能交换伙伴",
    "learning",
    { ...task, commitment: ["trial", "long", "bounded"] },
    "互相提供技能支持；技能与水平尚未询问",
  ),
  t(
    "A07-001",
    "室友",
    "living",
    {
      ...social,
      housing: ["together", "discuss"],
      emotion: ["light", "regular"],
      time: ["weekly", "frequent"],
      commitment: ["trial", "long", "bounded"],
      resources: ["limited", "pooled"],
    },
    "共享住所，需要具体分工",
  ),
  t(
    "A07-002",
    "合租室友",
    "living",
    {
      ...social,
      housing: ["together", "discuss"],
      emotion: ["light", "regular"],
      time: ["weekly", "frequent"],
      commitment: ["long", "bounded"],
      resources: ["limited", "pooled"],
    },
    "租住情境，合同权责尚未核实",
  ),
  t(
    "A07-006",
    "长期同住伙伴",
    "living",
    {
      ...social,
      housing: ["together", "discuss"],
      emotion: ["regular", "deep"],
      time: ["weekly", "frequent"],
      commitment: ["long"],
      resources: ["limited", "pooled"],
    },
    "持续同住方向，具体关系身份可叠加",
  ),
  t(
    "A13-003",
    "社区互助伙伴",
    "community",
    {
      ...task,
      commitment: ["trial", "long", "bounded"],
      resources: ["limited", "separate", "pooled"],
    },
    "围绕社区具体需要互助",
  ),
  t(
    "A13-006",
    "志愿服务搭子",
    "community",
    { ...task, commitment: ["trial", "long", "bounded"] },
    "自愿参与服务，能力与组织要求另议",
  ),
  t(
    "A14-009",
    "内容共创伙伴",
    "community",
    {
      ...task,
      commitment: ["trial", "long", "bounded"],
      resources: ["limited", "pooled"],
    },
    "共同创作，素材与署名另议",
  ),
];
export type Trace = {
  questionId: string;
  answer: string;
  property: string;
  outcome: "support" | "tension" | "unknown" | "hard_fail" | "hard_unknown";
  basis: string;
};
export function assess(input: Answers, rejected: string[] = []) {
  const a = activeAnswers(input),
    goal = valueOf(a, "purpose");
  const contradictions: string[] = [];
  if (goal === "romantic" && valueOf(a, "romance") === "no")
    contradictions.push(
      "主要方向选择了恋爱，但当前明确不希望浪漫联结。请修改方向或答案；本轮不替你选择哪项更真实。",
    );
  const rows = templates
    .filter(
      (t) => t.goal === goal && (!t.adult || valueOf(a, "age") === "adult"),
    )
    .map((t) => {
      const trace: Trace[] = [
        {
          questionId: "purpose",
          answer: goal!,
          property: t.goal,
          outcome: "support",
          basis: `阅读模板 ${t.id} 的主要方向为 ${t.goal}；不是对个体的分类。`,
        },
      ];
      let score = 6;
      let failed = false;
      let pending = false;
      for (const [id, answer] of Object.entries(a)) {
        if (["purpose", "age"].includes(id) || answer.state !== "answered")
          continue;
        const signal = t.signals[id];
        const support = signal?.values.includes(answer.value!);
        const outcome = !signal
          ? answer.must
            ? "hard_unknown"
            : "unknown"
          : support
            ? "support"
            : answer.must
              ? "hard_fail"
              : "tension";
        if (outcome === "hard_fail") failed = true;
        if (outcome === "hard_unknown") pending = true;
        if (outcome === "support") score += 2;
        if (outcome === "tension") score -= 1;
        trace.push({
          questionId: id,
          answer: answer.value!,
          property: signal?.values.join(" / ") ?? "未定义",
          outcome,
          basis: signal?.basis ?? "该阅读模板没有这一属性，不能认定满足。",
        });
      }
      return {
        template: t,
        score,
        trace,
        failed,
        pending,
        rejected: rejected.includes(t.id),
      };
    })
    .sort(
      (x, y) => y.score - x.score || x.template.id.localeCompare(y.template.id),
    );
  const usable = contradictions.length
    ? []
    : rows.filter((r) => !r.failed && !r.pending && !r.rejected);
  return {
    version: VERSION,
    answers: a,
    path: questionPath(a),
    contradictions,
    recommendations: usable.slice(0, 5),
    pending: contradictions.length
      ? []
      : rows.filter((r) => !r.failed && r.pending && !r.rejected).slice(0, 5),
    excluded: rows.filter((r) => r.failed),
    rejected: rows.filter((r) => r.rejected),
    unknown: questionPath(a).filter(
      (id) => !a[id] || a[id].state !== "answered",
    ),
    dimensions: Object.entries(dimensions).map(([key, label]) => {
      const q = questions.find((q) => q.dimension === key);
      const answer = q ? a[q.id] : undefined;
      return {
        key,
        label,
        questionId: q?.id,
        answer:
          answer?.state === "answered"
            ? q!.options.find((o) => o.value === answer.value)?.label
            : null,
        state: answer?.state ?? "unasked",
      };
    }),
    adultWithheld: goal === "romantic" && valueOf(a, "age") !== "adult",
    goalKnown: !!goal,
  };
}
/** Static opt-in share text deliberately includes no goals, IDs, scores, answers or notes. */
export const safeShareText =
  "我在 AllRelationships 探索此刻的关系需求。关系可以协商，偏好也可以改变。这不是人格测试或匹配成功率。";
