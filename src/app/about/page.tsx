import Link from "next/link";
import { generalReferences, prototypes, unlinkedEntries } from "@/lib/catalog";
export const metadata = { title: "编辑原则与来源" };
export default function About() {
  return (
    <div className="page-wrap">
      <span className="eyebrow">ABOUT THE MUSEUM / 关于这座馆</span>
      <h1 className="page-title">
        让理解生长，
        <br />
        也让未知可见。
      </h1>
      <p className="page-intro">
        AllRelationships 是一个人类关系百科、分类研究与可视化知识库。479
        项是原始名称和场景的收集量，关系能够重叠，也会随时间改变。
      </p>
      <div className="about-grid">
        <section>
          <h2>一份诚实的知识草稿</h2>
          <p>
            17 个分类、20 个拟议原型族、479 个原始词条完整保留。23
            条具有示例工作定义，456 条待完善，479
            条均未独立审核。分类不是公认学术标准。
          </p>
        </section>
        <section>
          <h2>知识与约定，分别记录</h2>
          <p>
            描述回答“通常如何理解”，约定回答“当事人希望怎样安排”。常见行为不自动成为义务，关系名称也不自动构成承诺。
          </p>
        </section>
        <section>
          <h2>证据有不同的身份</h2>
          <p>
            来源事实、工作定义、理论推论、待验证内容分别表达。当前没有逐条独立文献依据；不会把概览链接复制成
            479 条已经验证的证据。
          </p>
        </section>
        <section>
          <h2>边界，也是知识的一部分</h2>
          <p>
            本馆只提供百科浏览，不收集真实人物的关系资料。非自愿、强制或剥削状态仅作描述与风险研究。不提供匹配、资金托管或签约服务。
          </p>
        </section>
      </div>
      <section className="detail-block">
        <h2>当前数据缺口</h2>
        <div className="prose">
          <p>
            {unlinkedEntries.length} 条记录的原型族值尚不能与 20 个拟议原型 ID
            精确对应。原始值保留，映射等待编辑核对。图谱目前展示目录层次，未补造“变体属于某原型”或“互为相关关系”的语义边。
          </p>
          <p>
            亲密程度、排他性、参与人数等不能从名称猜测。已开放的属性筛选仅摘录明确的工作定义文字；未记录的内容一律为未知。
          </p>
        </div>
      </section>
      <section className="detail-block">
        <h2>20 个拟议原型族</h2>
        <p className="field-note" style={{ marginBottom: 20 }}>
          以下全部来自 v0.2
          草稿，是待审查的建模提议。提议之间可能重叠，也并非都已建立对应词条。
        </p>
        <div className="prototype-list">
          {prototypes.map((p) => (
            <article key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.working_definition_zh}</p>
              <span className="evidence-caption">{p.id} · 提议待审核</span>
            </article>
          ))}
        </div>
      </section>
      <section className="detail-block">
        <h2>原始来源与参考资料</h2>
        <div className="prose">
          <p>
            所有名称和 ID
            来自原始目录，定义及初步类型来自结构化草稿。原始记录、编辑备注与来源链接保留在仓库中。
          </p>
          <p>
            <a href="https://github.com/RanchoTao/All-relationships/tree/main/data">
              查看原始数据
            </a>{" "}
            ·{" "}
            <a href="https://github.com/RanchoTao/All-relationships/blob/main/docs/AllRelationships_taxonomy_review_v0.2.md">
              阅读 v0.2 分类审计
            </a>
          </p>
          <p>
            下列链接是原始词库的参考概览，本站本阶段未独立核验其内容、有效性或对具体词条的支持范围。它们不是逐词条引文。
          </p>
        </div>
        <ol className="reference-list">
          {generalReferences.map((url, i) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                参考概览 {i + 1} · {new URL(url).hostname} ↗
              </a>
            </li>
          ))}
        </ol>
      </section>
      <section className="detail-block">
        <h2>未来：探索此刻的关系需求</h2>
        <p className="prose">
          未来研究多维偏好画像与自适应选题，初步设想为 6–12
          题。本阶段仅预留接口和研究设计，尚无正式算法或题库，也不宣称心理测量效度。结果应当可以查看、修改和否认。
        </p>
        <Link className="text-link" href="/">
          回到馆藏，继续探索 →
        </Link>
      </section>
    </div>
  );
}
