import Fuse from "fuse.js";
import { entries, attributesFor, categoryById, kindLabels } from "./catalog";
import type { AttributeKey, Entry } from "./schema";

export interface Filters {
  query: string;
  category: string;
  kind: string;
  status: string;
  participants: string;
  attributes: Partial<Record<AttributeKey, string>>;
}
export const emptyFilters: Filters = {
  query: "",
  category: "",
  kind: "",
  status: "",
  participants: "",
  attributes: {},
};
const fuse = new Fuse(
  entries.map((e) => ({
    ...e,
    categoryName: categoryById[e.category_id].name,
    kindName: kindLabels[e.kind],
  })),
  {
    keys: [
      "id",
      "label_zh",
      "aliases",
      "wiki_definition_zh",
      "categoryName",
      "kindName",
    ],
    threshold: 0.25,
    ignoreLocation: true,
  },
);
export function searchEntries(filters: Filters): Entry[] {
  const q = filters.query.trim();
  const found = q ? fuse.search(q).map((result) => result.item) : entries;
  return found.filter(
    (e) =>
      (!filters.category || e.category_id === filters.category) &&
      (!filters.kind || e.kind === filters.kind) &&
      (!filters.status || e.definition_status === filters.status) &&
      (!filters.participants || e.participant_count === filters.participants) &&
      Object.entries(filters.attributes).every(
        ([key, value]) =>
          !value ||
          (attributesFor(e)[key as AttributeKey]?.value ?? "unknown") === value,
      ),
  );
}
export const facetOptions = Object.fromEntries(
  Object.keys({
    purpose: 1,
    intimacy: 1,
    duration: 1,
    cohabitation: 1,
    resources: 1,
    romance: 1,
    sexual: 1,
    structure: 1,
  }).map((key) => [
    key,
    [
      ...new Set(
        entries
          .map((e) => attributesFor(e)[key as AttributeKey]?.value)
          .filter((v): v is string => !!v),
      ),
    ],
  ]),
) as Record<AttributeKey, string[]>;
