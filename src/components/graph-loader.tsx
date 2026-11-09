"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
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
export function GraphLoader() {
  const initialEntry = useSearchParams().get("entry") ?? undefined;
  return (
    <GraphExplorer
      key={initialEntry ?? "overview"}
      initialEntry={initialEntry}
    />
  );
}
