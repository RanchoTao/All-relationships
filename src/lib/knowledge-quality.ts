import type { KnowledgeCard } from "./knowledge-schema";

export type QualityIssue = {
  code: string;
  cardIds: string[];
  paths?: string[];
  fragment?: string;
  message: string;
};
type Leaf = { path: string; text: string };
const technicalKeys = new Set([
  "id",
  "schemaVersion",
  "version",
  "batch",
  "depth",
  "targetId",
  "relatedIds",
  "aliasOf",
  "seeAlso",
  "sourceIds",
  "dimension",
  "facets",
  "editor",
  "editedAt",
  "independentReview",
  "humanReviewer",
  "reviewedAt",
  "definitionKind",
  "kind",
]);

/** Prose leaves, including array items: metadata and controlled IDs cannot pad word counts. */
export function proseLeaves(value: unknown, path = ""): Leaf[] {
  if (typeof value === "string") return [{ path, text: value }];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    technicalKeys.has(key)
      ? []
      : proseLeaves(child, path ? `${path}.${key}` : key),
  );
}
function bodyLeaves(card: KnowledgeCard) {
  return proseLeaves(card).filter(
    ({ path }) =>
      path !== "summary" &&
      !path.startsWith("evidence.") &&
      !path.startsWith("concept.") &&
      !path.endsWith(".title"),
  );
}

export function bodyCharacters(card: KnowledgeCard) {
  return bodyLeaves(card).reduce(
    (count, leaf) => count + (leaf.text.match(/[\p{L}\p{N}]/gu)?.length ?? 0),
    0,
  );
}

export const NEAR_TEMPLATE_SHINGLE_SIZE = 8;
export const NEAR_TEMPLATE_THRESHOLD = 0.30;

function bodyShingles(card: KnowledgeCard) {
  const shingles = new Set<string>();
  for (const { text } of bodyLeaves(card)) {
    const chars = text.normalize("NFC").match(/[\p{L}\p{N}]/gu) ?? [];
    for (let i = 0; i <= chars.length - NEAR_TEMPLATE_SHINGLE_SIZE; i++) {
      shingles.add(chars.slice(i, i + NEAR_TEMPLATE_SHINGLE_SIZE).join(""));
    }
  }
  return shingles;
}

type SimilarityPair = {
  cardIds: [string, string];
  similarity: number;
};

/** Compare body-only sets; shingle windows never cross prose fields. */
export function nearTemplateReport(cards: readonly KnowledgeCard[]) {
  const bodies = cards
    .filter((c) => c.schemaVersion === "0.4")
    .map((c) => ({ id: c.id, shingles: bodyShingles(c) }))
    .sort((a, b) => a.id.localeCompare(b.id));
  let comparedPairs = 0;
  let highestPair: SimilarityPair | null = null;
  const matches: SimilarityPair[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const [small, large] =
        a.shingles.size <= b.shingles.size
          ? [a.shingles, b.shingles]
          : [b.shingles, a.shingles];
      let intersection = 0;
      for (const shingle of small) if (large.has(shingle)) intersection++;
      const union = small.size + large.size - intersection;
      const similarity = union ? intersection / union : 0;
      comparedPairs++;
      const pair: SimilarityPair = { cardIds: [a.id, b.id], similarity };
      if (!highestPair || similarity > highestPair.similarity)
        highestPair = pair;
      if (similarity > NEAR_TEMPLATE_THRESHOLD) matches.push(pair);
    }
  }
  return {
    shingleSize: NEAR_TEMPLATE_SHINGLE_SIZE,
    threshold: NEAR_TEMPLATE_THRESHOLD,
    comparedPairs,
    highestPair,
    warnings: matches
      .sort((a, b) => b.similarity - a.similarity)
      .map((pair) => ({
        ...pair,
        severity: "warning" as const,
        code: "near_template",
        message: "v0.4 body shingle similarity exceeds the warning threshold",
      })),
  };
}

export const minimumCharacters = {
  deep: 1500,
  standard: 600,
  brief: 250,
} as const;
const normalize = (s: string) => s.normalize("NFC").replace(/\s/gu, "");

/** A sliding index finds every cross-field 20-code-point match, without quadratic character comparisons. */
export function repeatedFields(card: KnowledgeCard): QualityIssue[] {
  const windows = new Map<string, Set<string>>();
  const pairs = new Set<string>();
  const issues: QualityIssue[] = [];
  for (const leaf of proseLeaves(card)) {
    const chars = Array.from(normalize(leaf.text));
    for (let i = 0; i <= chars.length - 20; i++) {
      const fragment = chars.slice(i, i + 20).join("");
      const paths = windows.get(fragment) ?? new Set<string>();
      for (const other of paths) {
        const pair = [other, leaf.path].sort().join("|");
        if (other === leaf.path || pairs.has(pair)) continue;
        pairs.add(pair);
        issues.push({
          code: "repeated_fields",
          cardIds: [card.id],
          paths: [other, leaf.path],
          fragment,
          message: "Two prose fields share at least 20 consecutive characters",
        });
      }
      paths.add(leaf.path);
      windows.set(fragment, paths);
    }
  }
  return issues;
}

// No boilerplate exceptions are currently approved. Additions must be explicitly reviewed.
export const boilerplateAllowlist: readonly string[] = [];
export function repeatedSentences(cards: KnowledgeCard[]): QualityIssue[] {
  const sentences = new Map<string, Set<string>>();
  for (const card of cards) {
    for (const leaf of proseLeaves(card)) {
      for (const part of leaf.text.split(/[。！？!?；;\n]+/u)) {
        const sentence = normalize(part).replace(
          /^[“”「」『』"']+|[“”「」『』"']+$/gu,
          "",
        );
        if (
          Array.from(sentence).length < 15 ||
          boilerplateAllowlist.includes(sentence)
        )
          continue;
        const ids = sentences.get(sentence) ?? new Set<string>();
        ids.add(card.id);
        sentences.set(sentence, ids);
      }
    }
  }
  return [...sentences]
    .filter(([, ids]) => ids.size > 5)
    .map(([fragment, ids]) => ({
      code: "boilerplate",
      cardIds: [...ids].sort(),
      fragment,
      message: "Same sentence occurs in more than five cards",
    }));
}

export function cardQuality(
  card: KnowledgeCard,
  risk: boolean,
): QualityIssue[] {
  const issues = repeatedFields(card);
  if (card.schemaVersion === "0.3-legacy") return issues;
  const add = (code: string, message: string) =>
    issues.push({ code, cardIds: [card.id], message });
  const count = bodyCharacters(card);
  if (count < minimumCharacters[card.depth])
    add(
      "body_too_short",
      `${count} body characters; ${card.depth} requires ${minimumCharacters[card.depth]}`,
    );
  const minTopics = risk ? 0 : card.depth === "brief" ? 1 : 3;
  if (card.negotiables.length < minTopics)
    add("negotiables", `Requires at least ${minTopics} negotiation topics`);
  if (
    new Set(card.negotiables.map((n) => n.topic)).size !==
    card.negotiables.length
  )
    add("negotiables", "Negotiation topics must be distinct");
  if (risk && card.changes.start !== null)
    add(
      "risk_start",
      "Risk entry must not contain how-to-establish instructions",
    );
  if (!risk && !card.changes.start)
    add("missing_start", "Non-risk entry requires a beginning description");
  return issues;
}

export function referenceErrors(
  cards: KnowledgeCard[],
  entryIds: Set<string>,
  sourceIds: Set<string>,
): string[] {
  const errors: string[] = [];
  for (const c of cards) {
    if (!entryIds.has(c.id)) errors.push(`Unknown card ID: ${c.id}`);
    const linked = c.distinctions.map((d) => d.targetId);
    if (c.schemaVersion === "0.4")
      linked.push(
        ...c.relatedIds,
        ...c.seeAlso,
        ...(c.aliasOf ? [c.aliasOf] : []),
      );
    for (const id of linked)
      if (!entryIds.has(id) || id === c.id)
        errors.push(`${c.id}: invalid or self reference ${id}`);
    for (const id of c.evidence.sourceIds)
      if (!sourceIds.has(id)) errors.push(`${c.id}: unknown source ${id}`);
  }
  const byId = new Map(cards.map((c) => [c.id, c]));
  for (const c of cards) {
    const seen = new Set([c.id]);
    let node = c;
    while (node.schemaVersion === "0.4" && node.aliasOf) {
      if (seen.has(node.aliasOf)) {
        errors.push(`${c.id}: alias cycle`);
        break;
      }
      seen.add(node.aliasOf);
      const next = byId.get(node.aliasOf);
      if (!next) break;
      node = next;
    }
  }
  return errors;
}

export function legacyTransitionErrors(
  cards: KnowledgeCard[],
  allowlist: string[],
  baselineIds: string[],
): string[] {
  const errors: string[] = [];
  const current = new Set(allowlist),
    baseline = new Set(baselineIds);
  const byId = new Map(cards.map((c) => [c.id, c]));
  if (current.size !== allowlist.length)
    errors.push("Duplicate legacy allowlist ID");
  if (current.size > baseline.size)
    errors.push("Legacy allowlist grew relative to main/base");
  for (const id of current) {
    if (!baseline.has(id)) errors.push(`New legacy ID is forbidden: ${id}`);
    if (byId.get(id)?.schemaVersion !== "0.3-legacy")
      errors.push(`Allowlisted ID must have a legacy card: ${id}`);
  }
  for (const c of cards) {
    if (c.schemaVersion === "0.3-legacy" && !current.has(c.id))
      errors.push(`Unlisted legacy card: ${c.id}`);
  }
  for (const id of baseline) {
    if (!current.has(id) && byId.get(id)?.schemaVersion !== "0.4")
      errors.push(`Removing legacy requires a v0.4 replacement: ${id}`);
  }
  return errors;
}
