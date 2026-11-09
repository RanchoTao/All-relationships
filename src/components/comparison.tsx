"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { entries, entryById } from "@/lib/catalog";
import { compareEntries, compareSummary } from "@/lib/compare";

function Picker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const options = entries.filter(
    (e) =>
      e.label_zh.toLowerCase().includes(query.toLowerCase()) ||
      e.id.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="compare-picker">
      <label>
        {label}
        <span className="search-field">
          <Search size={16} />
          <input
            type="search"
            aria-label={`${label}搜索`}
            value={query}
            placeholder="输入名称定位选项…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </span>
        <select
          className="select-control"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {!options.some((e) => e.id === value) && (
            <option value={value}>
              {entryById[value].label_zh}（当前选择）
            </option>
          )}
          {options.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id} · {e.label_zh}
            </option>
          ))}
        </select>
      </label>
      {query && <p className="field-note">找到 {options.length} 个选项</p>}
    </div>
  );
}
export function Comparison({
  initialLeft,
  initialRight,
}: {
  initialLeft: string;
  initialRight: string;
}) {
  const [left, setLeft] = useState(initialLeft);
  const [right, setRight] = useState(initialRight);
  const a = entryById[left],
    b = entryById[right],
    rows = compareEntries(a, b),
    summary = compareSummary(rows);
  function change(l: string, r: string) {
    setLeft(l);
    setRight(r);
    window.history.replaceState(null, "", `/compare?left=${l}&right=${r}`);
  }
  const examples = [
    ["普通朋友 / FWB", "A04-001", "A02-007"],
    ["长期恋情 / Casual Dating", "A01-018", "A01-012"],
    ["室友 / 共同生活伙伴", "A07-001", "A04-029"],
    ["创业合伙人 / 项目合作者", "A10-010", "A10-003"],
  ];
  return (
    <>
      <div className="example-pairs" aria-label="比较示例">
        {examples.map(([label, l, r]) => (
          <button key={l} onClick={() => change(l, r)}>
            {label}
          </button>
        ))}
      </div>
      <div className="compare-selectors">
        <Picker
          label="左侧关系"
          value={left}
          onChange={(v) => change(v, right)}
        />
        <Picker
          label="右侧关系"
          value={right}
          onChange={(v) => change(left, v)}
        />
      </div>
      {left === right && (
        <p className="risk-note" role="status">
          当前选择了同一词条。可以改选另一条关系来比较。
        </p>
      )}
      <div className="compare-summary" aria-live="polite">
        <div>
          <h2>记录中的共同点</h2>
          <p>
            {summary.same.length
              ? `${summary.same.join("、")}的已记录值相同。`
              : "暂无足够的双侧记录来确认共同属性。"}
            分类相同不等于关系等同。
          </p>
        </div>
        <div>
          <h2>差异与未知</h2>
          <p>
            {summary.different.length
              ? `记录值不同的字段：${summary.different.join("、")}。`
              : "暂无可确认的属性差异。"}
            {summary.unknown} 个字段至少一侧缺少资料；不能据此推断相同或不同。
          </p>
        </div>
      </div>
      <p className="field-note">
        手机上可横向滑动表格。工作定义及其摘录均未独立审核；“未知”不是“不存在”。
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="关系对照表，可横向滚动"
      >
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">对照维度</th>
              <th scope="col">
                <Link href={`/relationships/${left}`}>
                  {a.label_zh}{" "}
                  <ArrowUpRight size={13} style={{ display: "inline" }} />
                </Link>
              </th>
              <th scope="col">
                <Link href={`/relationships/${right}`}>
                  {b.label_zh}{" "}
                  <ArrowUpRight size={13} style={{ display: "inline" }} />
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {(["left", "right"] as const).map((side) => (
                  <td key={side}>
                    {row[side] ?? <span className="unknown">未知／未记录</span>}
                    {row.draft && row[side] && (
                      <span className="evidence-caption">
                        工作定义 · 未审核{" "}
                        <Link
                          href={`/relationships/${side === "left" ? left : right}#sources`}
                        >
                          查看依据 ↗
                        </Link>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="detail-block" style={{ marginTop: 35 }}>
        <h2>哪些边界可以讨论？</h2>
        <p className="prose">
          {a.involuntary_or_harm_risk || b.involuntary_or_harm_risk
            ? "选择中包含风险状态，仅供百科描述与风险研究；不生成协商或撮合模板。"
            : "以下只是通用讨论提示，不是这两种关系的事实差异：相处频率与独立空间、资源和费用安排、隐私与信息披露、期待与退出方式。具体安排需要当事人自愿澄清，不因名称自动成立。"}
        </p>
      </section>
    </>
  );
}
