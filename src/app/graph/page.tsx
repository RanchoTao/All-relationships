import { GraphLoader } from "@/components/graph-loader";
import { Suspense } from "react";
export const metadata = { title: "关系图谱" };
export default function GraphPage() {
  return (
    <div className="page-wrap">
      <span className="eyebrow">THE CONNECTION ATLAS / 关系图谱</span>
      <h1 className="page-title">换个视角，看见联结。</h1>
      <p className="page-intro">
        从目录走向概念，探索关系的层次。当前图谱诚实呈现已有分类；更完整的原型、变体和演化连线，等待证据补足。
      </p>
      <Suspense fallback={<p role="status">正在读取图谱位置…</p>}>
        <GraphLoader />
      </Suspense>
    </div>
  );
}
