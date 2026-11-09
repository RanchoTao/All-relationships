import { Suspense } from "react";
import { ComparisonFromQuery } from "@/components/comparison";
export const metadata = { title: "关系比较" };
export default function ComparePage() {
  return (
    <div className="page-wrap">
      <span className="eyebrow">SIDE BY SIDE / 关系比较</span>
      <h1 className="page-title">相似之间，看见边界。</h1>
      <p className="page-intro">
        把两种关系放在一起，阅读已有的定义与属性。对于还不知道的部分，我们保留空白。
      </p>
      <Suspense fallback={<p role="status">正在读取比较选项…</p>}>
        <ComparisonFromQuery />
      </Suspense>
    </div>
  );
}
