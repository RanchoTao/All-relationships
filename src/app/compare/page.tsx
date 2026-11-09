import { Comparison } from "@/components/comparison";
import { entryById } from "@/lib/catalog";
export const metadata = { title: "关系比较" };
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const params = await searchParams;
  const left = params.left && entryById[params.left] ? params.left : "A04-001";
  const right =
    params.right && entryById[params.right]
      ? params.right
      : left === "A02-007"
        ? "A04-001"
        : "A02-007";
  return (
    <div className="page-wrap">
      <span className="eyebrow">SIDE BY SIDE / 关系比较</span>
      <h1 className="page-title">相似之间，看见边界。</h1>
      <p className="page-intro">
        把两种关系放在一起，阅读已有的定义与属性。对于还不知道的部分，我们保留空白。
      </p>
      <Comparison initialLeft={left} initialRight={right} />
    </div>
  );
}
