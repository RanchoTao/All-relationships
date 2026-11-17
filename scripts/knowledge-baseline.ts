import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import type { KnowledgeCard } from "../src/lib/knowledge-schema";

export function readBaseline(
  ref = process.env.LEGACY_BASE_REF || "origin/main",
  cwd = process.cwd(),
) {
  if (!/^[A-Za-z0-9_./-]+$/.test(ref) || ref.startsWith("-"))
    throw new Error("Invalid baseline ref");
  const commit = execFileSync(
    "git",
    ["rev-parse", "--verify", `${ref}^{commit}`],
    { encoding: "utf8", cwd },
  ).trim();
  const read = (path: string) => {
    try {
      return execFileSync("git", ["show", `${commit}:${path}`], {
        encoding: "utf8",
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch {
      return null;
    }
  };
  const allowlist = read("data/knowledge/legacy-allowlist.json");
  const cards = new Map<string, Record<string, unknown>>();
  let ids: string[];
  if (allowlist !== null) {
    ids = JSON.parse(allowlist).ids;
    for (const id of ids) {
      const card = read(`data/knowledge/cards/${id}.json`);
      if (!card) throw new Error(`Missing baseline legacy card: ${id}`);
      cards.set(id, JSON.parse(card));
    }
  } else {
    // One-time bootstrap: trust only the cards actually committed on pre-migration main.
    const aggregate = read("data/knowledge/cards.json");
    if (!aggregate)
      throw new Error(
        "Baseline unavailable; fetch main/history instead of disabling the guard",
      );
    const legacy = JSON.parse(aggregate).cards as Record<string, unknown>[];
    ids = legacy.map((c) => String(c.id));
    for (const card of legacy) cards.set(String(card.id), card);
  }
  if (
    !Array.isArray(ids) ||
    ids.some((id) => !/^A\d{2}-\d{3}$/.test(id)) ||
    new Set(ids).size !== ids.length
  )
    throw new Error("Invalid baseline allowlist");
  return { ref, commit, ids, cards, read };
}
export function frozenLegacyErrors(
  cards: KnowledgeCard[],
  baseline: Map<string, Record<string, unknown>>,
) {
  const errors: string[] = [];
  for (const card of cards) {
    if (card.schemaVersion !== "0.3-legacy") continue;
    const before = baseline.get(card.id);
    if (!before) {
      errors.push(`No legacy baseline for ${card.id}`);
      continue;
    }
    const withoutVersion = (c: Record<string, unknown>) =>
      Object.fromEntries(
        Object.entries(c).filter(([key]) => key !== "schemaVersion"),
      );
    if (!isDeepStrictEqual(withoutVersion(card), withoutVersion(before)))
      errors.push(
        `Legacy content changed: ${card.id}; rewrite as v0.4 instead`,
      );
  }
  return errors;
}
