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
            17 个分类、20 个拟议原型族、479 个原始词条完整保留。新增 60
            张完整基础卡，其中 20 张深度卡；其余 419 张继续建设。全部 479
            条尚未独立人工审核。分类是编辑工作模型，不是公认学术标准。
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
            来源事实、工作定义、理论推论、待验证内容分别表达。新增来源登记记录具体支持命题、查询日期和适用限制；AI
            来源核对不等于独立人工审核，也不会把概览链接复制成 479
            条已经验证的证据。
          </p>
        </section>
        <section>
          <h2>边界，也是知识的一部分</h2>
          <p>
            本馆提供百科浏览与浏览器内存中的偏好探索，不默认上传或保存私人答案。非自愿、强制或剥削状态仅作描述与风险研究。不提供匹配、资金托管或签约服务。
          </p>
        </section>
      </div>
      <section className="detail-block">
        <h2>当前数据缺口</h2>
        <div className="prose">
          <p>
            {unlinkedEntries.length} 条记录的原型族值尚不能与 20 个拟议原型 ID
            精确对应。原始值保留，映射等待编辑核对。图谱目前仍展示目录层次；新增
            60 张卡片有明确的相近概念对比链接，但这些是待独立审核的编辑判断。
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
        <h2>现在：探索此刻的关系需求</h2>
        <p className="prose">
          已实现本地偏好探索 v0.1：14 题题库按分支选 6–12 题，34
          个阅读模板。必要条件失败会排除，属性未知保留待确认；结果可修改和否认。没有心理测量学效度证据，测试通过只表明实现符合已声明规则。
        </p>
        <Link className="text-link" href="/explore">
          开始关系偏好探索 →
        </Link>
      </section>
    </div>
  );
}
