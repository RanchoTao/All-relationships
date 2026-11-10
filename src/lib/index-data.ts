// Server/build-time only: derives the slim collection index from the full data.
import { definitionFor, effectiveKind, knowledgeById } from "./knowledge";
import {
  attributesFor,
  categoryById,
  displayName,
  entries,
  englishName,
  featuredIds,
  kindLabels,
} from "./catalog";
import type { Entry } from "./schema";
import type { IndexItem } from "./index-model";

export function indexItemFor(e: Entry): IndexItem {
  const card = knowledgeById[e.id];
  const kind = effectiveKind(e);
  const attrs = Object.fromEntries(
    Object.entries(attributesFor(e)).map(([k, c]) => [k, c!.value]),
  );
  const searchText = card
    ? [...card.boundaries, ...card.needs].join(" ")
    : undefined;
  return {
    id: e.id,
    label: e.label_zh,
    name: displayName(e),
    en: englishName(e),
    aliases: e.aliases,
    categoryId: e.category_id,
    categoryName: categoryById[e.category_id].name,
    kind,
    kindLabel: kindLabels[kind] ?? kind,
    definition: definitionFor(e) ?? undefined,
    coverage: card ? card.depth : "pending",
    participants: e.participant_count,
    attrs,
    ...(searchText ? { searchText } : {}),
  };
}

let cache: IndexItem[] | undefined;
export function collectionIndex(): IndexItem[] {
  return (cache ??= entries.map(indexItemFor));
}

/** Featured first, then entries with a card or legacy definition, then the rest. */
export function defaultOrder(items: IndexItem[]): IndexItem[] {
  const rank = (e: IndexItem) => {
    const f = featuredIds.indexOf(e.id);
    if (f >= 0) return f;
    if (e.coverage === "deep") return 50;
    if (e.coverage === "basic") return 100;
    if (e.definition) return 200;
    return 999;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
