"use client";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  entries,
  categories,
  entryById,
  categoryById,
  kindLabels,
  prototypes,
  prototypeById,
} from "@/lib/catalog";

export function GraphExplorer({ initialEntry }: { initialEntry?: string }) {
  const initial = initialEntry ? entryById[initialEntry] : undefined;
  const [category, setCategory] = useState(initial?.category_id ?? "A04");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initial?.id ?? "");
  const [page, setPage] = useState(
    initial
      ? Math.floor(
          entries
            .filter((e) => e.category_id === initial.category_id)
            .findIndex((e) => e.id === initial.id) / 12,
        )
      : 0,
  );
  const [flow, setFlow] = useState<ReactFlowInstance<Node, Edge> | null>(null);
  const [mode, setMode] = useState<"catalog" | "prototypes" | "family">(
    "catalog",
  );
  const [family, setFamily] = useState("friendship");
  const groupEntries = entries.filter((e) =>
    mode === "family"
      ? e.archetype_family === family
      : e.category_id === category,
  );
  const searchResults = useMemo(
    () =>
      query.trim()
        ? entries
            .filter((e) =>
              `${e.label_zh} ${e.id}`
                .toLowerCase()
                .includes(query.trim().toLowerCase()),
            )
            .slice(0, 20)
        : [],
    [query],
  );
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (mode === "prototypes") {
      prototypes.forEach((p, i) =>
        nodes.push({
          id: `prototype:${p.id}`,
          position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 140 },
          data: { label: `${p.name} · 提议待审核` },
          style: { width: 210 },
          connectable: false,
        }),
      );
      return { nodes, edges };
    }
    const members = entries
      .filter((e) =>
        mode === "family"
          ? e.archetype_family === family
          : e.category_id === category,
      )
      .slice(page * 12, (page + 1) * 12);
    const kinds = [...new Set(members.map((e) => e.kind))];
    const categoryNode =
      mode === "family" ? `prototype:${family}` : `category:${category}`;
    nodes.push({
      id: categoryNode,
      type: "input",
      position: { x: 300, y: 0 },
      data: {
        label:
          mode === "family"
            ? `${prototypeById[family].name} · 原稿归属`
            : categoryById[category].name,
      },
      style: { width: 230 },
    });
    kinds.forEach((kind, kindIndex) => {
      const group = members.filter((e) => e.kind === kind),
        kindId = `kind:${kind}`;
      nodes.push({
        id: kindId,
        position: { x: kindIndex * 230, y: 130 },
        data: { label: `${kindLabels[kind]} · 初步` },
        style: { width: 185, background: "#e5ead9" },
      });
      edges.push({
        id: `${categoryNode}-${kindId}`,
        source: categoryNode,
        target: kindId,
        style: {
          stroke: "#a3b39a",
          strokeDasharray: mode === "family" ? "5 4" : undefined,
        },
      });
      group.forEach((e) => {
        const index = members.indexOf(e);
        nodes.push({
          id: e.id,
          position: {
            x: (index % 3) * 300,
            y: 290 + Math.floor(index / 3) * 110,
          },
          data: { label: e.label_zh },
          style: {
            width: 235,
            border: e.id === selected ? "2px solid #a25135" : undefined,
          },
          connectable: false,
        });
        edges.push({
          id: `${kindId}-${e.id}`,
          source: kindId,
          target: e.id,
          style: {
            stroke: "#bec8b5",
            strokeDasharray: mode === "family" ? "5 4" : undefined,
          },
        });
      });
    });
    return { nodes, edges };
  }, [category, selected, mode, page, family]);
  const onInit = useCallback((instance: ReactFlowInstance<Node, Edge>) => {
    setFlow(instance);
  }, []);
  function locate(id: string) {
    const e = entryById[id];
    setMode("catalog");
    setCategory(e.category_id);
    setPage(
      Math.floor(
        entries
          .filter((item) => item.category_id === e.category_id)
          .findIndex((item) => item.id === id) / 12,
      ),
    );
    setSelected(id);
    setQuery("");
    window.history.replaceState(null, "", `/graph?entry=${id}`);
  }
  const selectedNode = nodes.find((node) => node.id === selected);
  const selectedEntry = entryById[selected];
  const selectedPrototype = selected.startsWith("prototype:")
    ? prototypeById[selected.slice(10)]
    : undefined;
  return (
    <>
      <div className="example-pairs">
        <button
          aria-pressed={mode === "catalog"}
          onClick={() => {
            setMode("catalog");
            setPage(0);
            setSelected("");
          }}
        >
          目录关系 · 按分类展开
        </button>
        <button
          aria-pressed={mode === "prototypes"}
          onClick={() => {
            setMode("prototypes");
            setSelected("");
          }}
        >
          20 个拟议原型族
        </button>
      </div>
      <div className="graph-toolbar">
        <label>
          定位词条（搜索全部 479 项）
          <input
            className="select-control"
            type="search"
            placeholder="输入名称、英文括注或稳定 ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="图谱搜索"
          />
        </label>
        <label>
          当前目录
          <select
            className="select-control"
            value={category}
            disabled={mode !== "catalog"}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
              setSelected("");
            }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}（{c.count}）
              </option>
            ))}
          </select>
        </label>
      </div>
      {query && (
        <div className="source-record" role="status">
          {searchResults.length ? (
            <>
              显示前 {searchResults.length} 个匹配项
              <div className="example-pairs">
                {searchResults.map((e) => (
                  <button key={e.id} onClick={() => locate(e.id)}>
                    {e.label_zh} · {e.id}
                  </button>
                ))}
              </div>
            </>
          ) : (
            "未找到匹配词条。试试更短的名称或 ID。"
          )}
        </div>
      )}
      <p className="field-note" style={{ marginBottom: 14 }}>
        显示 {nodes.length} 个概念节点。
        {mode === "family" &&
          "虚线为原稿的未审核归属；不代表已验证的原型—变体谱系。"}
        线条表示目录归类，不表示真实人物之间的关系，也不宣称已建立原型—变体的理论谱系。
      </p>
      <div className="graph-frame" role="region" aria-label="关系知识图谱">
        <ReactFlow
          key={`${mode}-${category}-${page}-${family}`}
          nodes={nodes}
          edges={edges}
          onInit={onInit}
          fitView
          minZoom={0.1}
          maxZoom={1.7}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          onNodeClick={(_, node) => setSelected(node.id)}
          onNodeDoubleClick={(_, node) => {
            void flow?.fitView({
              nodes: [{ id: node.id }],
              duration: 0,
              maxZoom: 1,
            });
          }}
          onNodesChange={() => {}}
        >
          <Background color="#d1d9c7" gap={24} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor="#b7c6a7"
            ariaLabel="图谱缩略导航"
          />
        </ReactFlow>
      </div>
      {selectedEntry && (
        <div className="graph-selection">
          <div>
            <strong>{selectedEntry.label_zh}</strong>
            <p>
              {selectedEntry.wiki_definition_zh
                ? "工作定义 · 未审核"
                : "待完善 · 未审核"}{" "}
              ·{" "}
              {prototypeById[selectedEntry.archetype_family]
                ? "原型归属为草稿记录"
                : "原型归属待核对"}
            </p>
          </div>
          <div className="inline-list">
            <button
              className="outline-button"
              onClick={() => {
                void flow?.fitView({
                  nodes: [{ id: selected }],
                  maxZoom: 1,
                  duration: 0,
                });
              }}
            >
              居中定位
            </button>
            <Link
              className="primary-button"
              href={`/relationships/${selected}`}
            >
              阅读词条 ↗
            </Link>
          </div>
        </div>
      )}
      {selectedNode && !selectedEntry && !selectedPrototype && (
        <div className="source-record">
          <strong>{String(selectedNode.data.label)}</strong>
          <p>
            这是初步分类节点。连线表示当前记录的组织方式，不代表关系互斥或已经验证的理论层级。
          </p>
        </div>
      )}
      {selectedPrototype && (
        <div className="source-record">
          <strong>{selectedPrototype.name} · 拟议原型族</strong>
          <p>{selectedPrototype.working_definition_zh}</p>
          <p>
            工作定义未审核。仅可展开原始字段精确对应的词条，虚线表示未审核的原稿归属。
          </p>
          {entries.some((e) => e.archetype_family === selectedPrototype.id) ? (
            <button
              className="outline-button"
              style={{ marginTop: 12 }}
              onClick={() => {
                setFamily(selectedPrototype.id);
                setMode("family");
                setPage(0);
                setSelected("");
              }}
            >
              展开原稿归属词条
            </button>
          ) : (
            <p>尚无精确对应的词条；映射待研究。</p>
          )}
        </div>
      )}
      {mode !== "prototypes" && (
        <div className="graph-pagination">
          <button
            className="outline-button"
            disabled={page === 0}
            onClick={() => {
              setPage(page - 1);
              setSelected("");
            }}
          >
            上一组
          </button>
          <span>
            {page + 1} / {Math.ceil(groupEntries.length / 12)} 组 · 每组至多 12
            个词条
          </span>
          <button
            className="outline-button"
            disabled={(page + 1) * 12 >= groupEntries.length}
            onClick={() => {
              setPage(page + 1);
              setSelected("");
            }}
          >
            下一组
          </button>
        </div>
      )}
      <p className="graph-caption">
        拖动平移，使用左下角控件缩放，双击节点居中，点击节点查看详情入口。目录模式一次最多展开一个分类；多人关系作为完整概念保留。尚未核验的变体、相关关系及原型映射不绘制成确定的边。
      </p>
      <details className="details-disclosure">
        <summary>无障碍文本目录（当前分类或原型的完整列表）</summary>
        <div className="graph-result-list">
          {mode !== "prototypes"
            ? groupEntries.map((e) => (
                <Link key={e.id} href={`/relationships/${e.id}`}>
                  {e.label_zh}
                </Link>
              ))
            : prototypes.map((p) => (
                <p key={p.id}>
                  {p.name} · {p.working_definition_zh}
                </p>
              ))}
        </div>
      </details>
    </>
  );
}
