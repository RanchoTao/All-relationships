"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ShieldCheck, RotateCcw } from "lucide-react";
import {
  assess,
  nextQuestion,
  questionById,
  questionPath,
  updateAnswer,
  safeShareText,
  type Answer,
  type Answers,
  type Question,
  type Trace,
} from "@/lib/assessment";

const stateLabels = {
  unsure: "不确定",
  skipped: "跳过",
  not_applicable: "不适用",
  unasked: "尚未询问",
};
const outcomeLabels = {
  support: "支持阅读此项",
  tension: "需要协商的差异",
  unknown: "模板属性未知",
  hard_fail: "不满足必要条件",
  hard_unknown: "必要条件尚未证实",
};
function answerText(id: string, a?: Answer) {
  return !a
    ? "尚未回答"
    : a.state === "answered"
      ? (questionById[id].options.find((o) => o.value === a.value)?.label ??
        "未知")
      : stateLabels[a.state];
}
function QuestionForm({
  question,
  existing,
  onAnswer,
}: {
  question: Question;
  existing?: Answer;
  onAnswer: (a: Answer) => void;
}) {
  const [must, setMust] = useState(existing?.must ?? false);
  return (
    <div className="question-body">
      <p className="prose">{question.why}</p>
      {question.hard && (
        <label className="hard-choice">
          <input
            type="checkbox"
            checked={must}
            onChange={(e) => setMust(e.target.checked)}
          />
          这是本轮不可妥协的条件（模板未知时也不算满足）
        </label>
      )}
      <fieldset className="answer-options">
        <legend className="sr-only">{question.title}</legend>
        {question.options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={
              existing?.state === "answered" && existing.value === o.value
            }
            onClick={() =>
              onAnswer({ state: "answered", value: o.value, must })
            }
          >
            <span>{o.label}</span>
            <ArrowRight size={17} />
          </button>
        ))}
      </fieldset>
      <div className="skip-options">
        {(["unsure", "skipped", "not_applicable"] as const).map((state) => (
          <button
            type="button"
            key={state}
            onClick={() => onAnswer({ state, value: null, must: false })}
          >
            {stateLabels[state]}
          </button>
        ))}
      </div>
    </div>
  );
}
function EvidenceTrace({ trace }: { trace: Trace[] }) {
  return (
    <details className="details-disclosure">
      <summary>为什么出现这项？查看回答与规则</summary>
      <ol className="trace-list">
        {trace.map((t) => (
          <li key={t.questionId}>
            <strong>{questionById[t.questionId].title}</strong>
            <p>
              你的回答：
              {questionById[t.questionId].options.find(
                (o) => o.value === t.answer,
              )?.label ?? t.answer}{" "}
              · {outcomeLabels[t.outcome]}
            </p>
            <p>{t.basis}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}
export function PreferenceExplorer() {
  const [answers, setAnswers] = useState<Answers>({}),
    [showReport, setShowReport] = useState(false),
    [editing, setEditing] = useState<string | null>(null),
    [rejected, setRejected] = useState<string[]>([]),
    [denyAll, setDenyAll] = useState(false),
    [note, setNote] = useState(""),
    [shareStatus, setShareStatus] = useState("");
  const report = assess(answers, rejected),
    path = questionPath(answers),
    next = nextQuestion(answers),
    current = editing ?? next;
  const isReport = showReport && !editing;
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    mounted.current = true;
  }, [current, isReport]);
  function respond(a: Answer) {
    if (!current) return;
    const updated = updateAnswer(answers, current, a);
    setAnswers(updated);
    setEditing(null);
    setDenyAll(false);
    setRejected([]);
    setShareStatus("");
    if (showReport || !nextQuestion(updated)) setShowReport(true);
  }
  function reset() {
    setAnswers({});
    setShowReport(false);
    setEditing(null);
    setRejected([]);
    setDenyAll(false);
    setNote("");
    setShareStatus("");
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(safeShareText);
      setShareStatus("已复制下方通用文字；没有复制答案、候选类型或私人备注。");
    } catch {
      setShareStatus("剪贴板不可用，可以手动复制下方通用文字。");
    }
  }
  return (
    <div className="page-wrap preference-page">
      <div className="explorer-heading">
        <span className="eyebrow">RELATIONSHIP EXPLORER / v0.1</span>
        <h1 className="page-title">测测你想要什么关系</h1>
        <p className="page-intro">
          先认识此刻的需要，再寻找值得阅读的关系。这里没有固定人格，也不替你决定。
        </p>
      </div>
      <div className="privacy-banner">
        <ShieldCheck size={20} />
        <p>
          答案只在本页内存计算，不默认上传或保存；刷新或清空会丢失，不做跨页面保存。约
          6–12 题，可以跳过或随时看部分结果。未经过心理测量学验证。
        </p>
      </div>
      {!isReport && current ? (
        <section className="question-panel" aria-label="偏好问卷">
          <div className="question-progress">
            <span>
              第 {path.indexOf(current) + 1} 题 · 当前分支 {path.length} 题
            </span>
            <span>
              {questionById[current].sensitive
                ? "成年人可选问题"
                : "当前需求探索"}
            </span>
          </div>
          <progress
            max={path.length}
            value={path.filter((id) => answers[id]).length}
            aria-label="已回答进度"
          />
          <h2 ref={heading} tabIndex={-1}>
            {questionById[current].title}
          </h2>
          <QuestionForm
            key={current}
            question={questionById[current]}
            existing={answers[current]}
            onAnswer={respond}
          />
          <div className="question-actions">
            {path.indexOf(current) > 0 && (
              <button
                className="text-link"
                onClick={() => setEditing(path[path.indexOf(current) - 1])}
              >
                <ArrowLeft size={16} />
                修改上一题
              </button>
            )}
            <button
              className="text-link"
              onClick={() => {
                setEditing(null);
                setShowReport(true);
              }}
            >
              查看当前结果（允许信息不足）
            </button>
          </div>
          <p className="field-note">
            选题依据：先确定主要方向；活动询问场景，科研询问协作角色，只有确认成年后的恋爱分支出现身体与排他问题。
            <Link href="/explore/method">查看完整题库与规则</Link>
          </p>
        </section>
      ) : null}
      {isReport && (
        <div className="preference-report">
          <div className="report-top">
            <div>
              <span className="eyebrow">YOUR CURRENT NEEDS / 可修改</span>
              <h2 ref={heading} tabIndex={-1}>
                你的当前关系偏好报告
              </h2>
              <p className="prose">
                主要方向：{answerText("purpose", report.answers.purpose)}
                。这是回答整理与阅读建议，不是对你的事实判定。
              </p>
            </div>
            <button
              className="outline-button"
              onClick={() => {
                setShowReport(false);
                setEditing("purpose");
              }}
            >
              修改主要方向
            </button>
          </div>
          <section className="detail-block">
            <h3>多维需求 · 不把空白填成答案</h3>
            <dl className="preference-dimensions">
              {report.dimensions.map((d) => (
                <div key={d.key}>
                  <dt>{d.label}</dt>
                  <dd>
                    {d.answer ??
                      stateLabels[d.state as keyof typeof stateLabels] ??
                      "未知"}
                    {d.questionId && path.includes(d.questionId) && (
                      <button
                        onClick={() => setEditing(d.questionId!)}
                        aria-label={`修改${d.label}`}
                      >
                        修改
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          {report.contradictions.length > 0 && (
            <div className="risk-note" role="status">
              <strong>这些答案需要先澄清</strong>
              {report.contradictions.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          )}
          {report.adultWithheld && (
            <div className="risk-note">
              <strong>成年人分支未开启</strong>
              <p>
                未确认成年，因此未处理身体亲密答案，也不展示成年人伴侣推荐。可以修改主要方向，探索友谊、活动或学习等需要。
              </p>
            </div>
          )}
          {!report.goalKnown && (
            <p className="empty-message">
              主要需要还不确定；目前不猜测关系类型。可以补充第一题，或继续保留未知。
            </p>
          )}
          <section className="detail-block">
            <h3>值得进一步了解的关系</h3>
            <p className="field-note">
              通常给出 3–5
              个阅读入口；不足时如实减少，不凑数。先检查你标记的必要条件：不满足排除，属性未知列为待确认。通过后按已知支持项排序，排序不是适配概率。
            </p>
            <label className="hard-choice">
              <input
                type="checkbox"
                checked={denyAll}
                onChange={(e) => setDenyAll(e.target.checked)}
              />
              这些结论不能代表我，暂时否认本轮建议
            </label>
            {denyAll ? (
              <p className="prose">
                已保留你的否认，隐藏本轮建议。可以修改回答或取消否认；不会把否认解释为任何人格特征。
              </p>
            ) : (
              <div className="recommendation-grid">
                {report.recommendations.map((r, index) => (
                  <article className="recommendation-card" key={r.template.id}>
                    <span className="eyebrow">
                      阅读入口 {index + 1} · {r.template.id}
                    </span>
                    <h4>{r.template.title}</h4>
                    <p>{r.template.scope}</p>
                    <p className="field-note">
                      依据：主要方向相符，另有{" "}
                      {
                        r.trace.filter(
                          (t) =>
                            t.questionId !== "purpose" &&
                            t.outcome === "support",
                        ).length
                      }{" "}
                      项已答偏好支持；
                      {r.trace.filter((t) => t.outcome === "unknown").length}{" "}
                      项模板属性未定义。
                      {r.trace.some((t) => t.outcome === "tension")
                        ? "仍有软偏好差异，展开规则查看。"
                        : ""}
                    </p>
                    <EvidenceTrace trace={r.trace} />
                    <div className="recommendation-actions">
                      <Link
                        prefetch={false}
                        href={`/relationships/${r.template.id}`}
                      >
                        去 Wiki 阅读 ↗
                      </Link>
                      <button
                        onClick={() =>
                          setRejected([...rejected, r.template.id])
                        }
                      >
                        这项不代表我
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {!denyAll &&
              report.goalKnown &&
              !report.adultWithheld &&
              report.recommendations.length === 0 && (
                <p className="prose">
                  没有可确认通过必要条件的阅读模板。不会静默放宽条件；可以查看待确认项或修改自己的回答。
                </p>
              )}
          </section>
          {report.pending.length > 0 && !denyAll && (
            <section className="detail-block">
              <h3>必要属性未知 · 仅供待确认阅读</h3>
              <p className="field-note">
                以下不计为已满足要求的推荐。百科名称不足以确认具体安排。
              </p>
              {report.pending.map((r) => (
                <article className="source-record" key={r.template.id}>
                  <h4>{r.template.title}</h4>
                  <EvidenceTrace trace={r.trace} />
                  <Link
                    prefetch={false}
                    href={`/relationships/${r.template.id}`}
                  >
                    了解定义与缺口 ↗
                  </Link>
                </article>
              ))}
            </section>
          )}
          <section className="detail-block">
            <h3>不适合或存在冲突的安排</h3>
            {report.excluded.length ? (
              report.excluded.map((r) => (
                <details key={r.template.id} className="details-disclosure">
                  <summary>{r.template.title} · 被你的必要条件排除</summary>
                  {r.trace
                    .filter((t) => t.outcome === "hard_fail")
                    .map((t) => (
                      <p key={t.questionId}>
                        {questionById[t.questionId].title}：
                        {answerText(t.questionId, report.answers[t.questionId])}
                        ；{t.basis}
                      </p>
                    ))}
                </details>
              ))
            ) : (
              <p className="prose">
                当前没有发现已知必要条件冲突；这不证明现实中的任何人或安排适合你。模板未覆盖的属性仍需确认。
              </p>
            )}
            <p className="prose">
              无论选择什么名称，都不能把你的偏好、一次答应或过去互动当成对方已经同意。
            </p>
          </section>
          <section className="detail-block">
            <h3>仍未确定，需要继续思考</h3>
            {report.unknown.length ? (
              <ul className="reflection-list">
                {report.unknown.map((id) => (
                  <li key={id}>
                    {questionById[id].title}{" "}
                    <span>（{answerText(id, report.answers[id])}）</span>
                    <button onClick={() => setEditing(id)}>补充或修改</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="prose">
                当前分支已回答；未询问的维度、实际对象与具体资源仍未知，不做补全。
              </p>
            )}
            <ul className="reflection-list">
              <li>
                哪个需要必须由同一段关系满足，哪些可以由不同联结分别满足？
              </li>
              <li>
                你能提供怎样的时间和支持，对方的需要又是什么？本工具没有对方资料，不能做双向匹配。
              </li>
              <li>这些期待改变时，你希望如何重新协商或结束？</li>
            </ul>
          </section>
          <section className="detail-block">
            <h3>自己改写这份报告</h3>
            <label className="report-note">
              我的补充与纠正（仅本页内存，不参与自动评分）
              <textarea
                maxLength={2000}
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：我希望深聊，但不希望每天回复。请勿填写身份或联系方式。"
              />
            </label>
            <details className="details-disclosure">
              <summary>查看并修改本轮全部答案</summary>
              {path.map((id) => (
                <div className="answer-review" key={id}>
                  <p>
                    {questionById[id].title}
                    <br />
                    <strong>{answerText(id, report.answers[id])}</strong>
                    {report.answers[id]?.must ? " · 必要条件" : ""}
                  </p>
                  <button onClick={() => setEditing(id)}>修改这题</button>
                </div>
              ))}
            </details>
            {rejected.length > 0 && (
              <button className="text-link" onClick={() => setRejected([])}>
                恢复被否认的候选（{rejected.length}）
              </button>
            )}
          </section>
          <section className="detail-block">
            <h3>自愿分享 · 只分享通用介绍</h3>
            <p className="share-preview">{safeShareText}</p>
            <button className="outline-button" onClick={share}>
              复制这段通用分享文字
            </button>
            <p role="status">{shareStatus}</p>
            <p className="field-note">
              不会分享你的回答、关系方向、候选类型、备注或评分；不会生成带答案的网址。
            </p>
          </section>
          <div className="question-actions">
            {next && (
              <button
                className="outline-button"
                onClick={() => {
                  setShowReport(false);
                  setEditing(null);
                }}
              >
                继续未完成的问题
              </button>
            )}
            <button className="outline-button" onClick={reset}>
              <RotateCcw size={16} />
              清空并重新探索
            </button>
            <Link href="/explore/method">查看规则与准确性边界 ↗</Link>
          </div>
        </div>
      )}
      <p className="field-note explorer-footnote">
        v0.1
        编辑规则原型。没有代表性样本、重测信度或效度校准；自动化测试只检查实现是否遵守声明规则。没有使用收费
        API。
      </p>
    </div>
  );
}
