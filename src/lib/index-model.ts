// Pure, data-free helpers for the collection index.
// The home page builds a slim IndexItem[] on the server and ships only that
// to the browser, instead of the full 479-entry draft and every knowledge card.
import Fuse from "fuse.js";
import type { AttributeKey } from "./schema";

export type Coverage = "deep" | "basic" | "pending";

export interface IndexItem {
  id: string;
  label: string;
  name: string;
  en?: string;
  aliases: string[];
  categoryId: string;
  categoryName: string;
  kind: string;
  kindLabel: string;
  definition?: string;
  coverage: Coverage;
  participants: string;
  attrs: Partial<Record<AttributeKey, string>>;
  searchText?: string;
}

export interface Filters {
  query: string;
  category: string;
  kind: string;
  status: string;
  participants: string;
  coverage: string;
  attributes: Partial<Record<AttributeKey, string>>;
}
export const emptyFilters: Filters = {
  query: "",
  category: "",
  kind: "",
  status: "",
  participants: "",
  coverage: "",
  attributes: {},
};

export const facetKeys = [
  "purpose",
  "intimacy",
  "duration",
  "cohabitation",
  "resources",
  "romance",
  "sexual",
  "structure",
] as const satisfies readonly AttributeKey[];

export const coverageLabels: Record<Coverage, string> = {
  deep: "深度卡",
  basic: "基础卡",
  pending: "待建设",
};

export function createSearch(items: IndexItem[]) {
  const fuse = new Fuse(items, {
    keys: [
      "id",
      "label",
      "aliases",
      "definition",
      "searchText",
      "categoryName",
      "kindLabel",
    ],
    threshold: 0.25,
    ignoreLocation: true,
  });
  return function search(filters: Filters): IndexItem[] {
    const q = filters.query.trim();
    const found = q ? fuse.search(q).map((r) => r.item) : items;
    return found.filter(
      (e) =>
        (!filters.category || e.categoryId === filters.category) &&
        (!filters.kind || e.kind === filters.kind) &&
        (!filters.status ||
          (e.definition ? "working_draft" : "not_yet_written") ===
            filters.status) &&
        (!filters.coverage ||
          (filters.coverage === "pending"
            ? e.coverage === "pending"
            : filters.coverage === "complete"
              ? e.coverage !== "pending"
              : e.coverage === filters.coverage)) &&
        (!filters.participants || e.participants === filters.participants) &&
        Object.entries(filters.attributes).every(
          ([key, value]) =>
            !value || (e.attrs[key as AttributeKey] ?? "unknown") === value,
        ),
    );
  };
}

export function facetOptionsFor(items: IndexItem[]) {
  return Object.fromEntries(
    facetKeys.map((key) => [
      key,
      [
        ...new Set(
          items.map((e) => e.attrs[key]).filter((v): v is string => !!v),
        ),
      ],
    ]),
  ) as Record<(typeof facetKeys)[number], string[]>;
}
