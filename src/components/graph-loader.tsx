"use client";
import dynamic from "next/dynamic";
const GraphExplorer = dynamic(
  () => import("./graph-explorer").then((m) => m.GraphExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="empty-state" role="status">
        正在打开关系图谱…
      </div>
    ),
  },
);
export function GraphLoader({ initialEntry }: { initialEntry?: string }) {
  return <GraphExplorer initialEntry={initialEntry} />;
}
