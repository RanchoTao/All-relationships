import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  knowledgeById,
  knowledgeCards,
  currentCards,
} from "../src/lib/knowledge";
import {
  V04CardSchema,
  KnowledgeCardSchema,
  type V04Card,
  type KnowledgeCard,
} from "../src/lib/knowledge-schema";
import {
  repeatedFields,
  repeatedSentences,
  bodyCharacters,
  cardQuality,
  referenceErrors,
  legacyTransitionErrors,
} from "../src/lib/knowledge-quality";
import {
  readBaseline,
  frozenLegacyErrors,
} from "../scripts/knowledge-baseline";
import { entries } from "../src/lib/catalog";
import { collectionIndex } from "../src/lib/index-data";
const demo = () => structuredClone(knowledgeById["A04-001"]) as V04Card;
const legacy = () =>
  structuredClone(
    knowledgeCards.find((c) => c.schemaVersion === "0.3-legacy")!,
  );

test("Git baseline reads both the bootstrap aggregate and later frozen files, failing closed when unavailable", () => {
  const tempRoot = path.resolve(tmpdir());
  const directory = fs.mkdtempSync(
    path.join(tempRoot, "allrelationships-baseline-"),
  );
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: directory,
      stdio: "pipe",
      encoding: "utf8",
    });
  try {
    git("init", "-b", "main");
    git("config", "user.name", "Local test");
    git("config", "user.email", "test@example.invalid");
    const card = legacy();
    const folder = path.join(directory, "data/knowledge");
    fs.mkdirSync(path.join(folder, "cards"), { recursive: true });
    fs.writeFileSync(
      path.join(folder, "cards.json"),
      JSON.stringify({ cards: [card] }),
    );
    git("add", ".");
    git("-c", "commit.gpgsign=false", "commit", "-m", "test baseline");
    assert.deepEqual(readBaseline("main", directory).ids, [card.id]);
    fs.writeFileSync(
      path.join(folder, "legacy-allowlist.json"),
      JSON.stringify({ ids: [card.id] }),
    );
    fs.writeFileSync(
      path.join(folder, `cards/${card.id}.json`),
      JSON.stringify(card),
    );
    git("add", ".");
    git("-c", "commit.gpgsign=false", "commit", "-m", "test migration");
    assert.deepEqual(readBaseline("main", directory).cards.get(card.id), card);
    git(
      "rm",
      "data/knowledge/legacy-allowlist.json",
      "data/knowledge/cards.json",
    );
    git("-c", "commit.gpgsign=false", "commit", "-m", "test missing baseline");
    assert.throws(
      () => readBaseline("main", directory),
      /Baseline unavailable/,
    );
  } finally {
    const resolved = path.resolve(directory);
    assert.ok(
      path.dirname(resolved) === tempRoot &&
        path.basename(resolved).startsWith("allrelationships-baseline-"),
    );
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});

test("migration preserves every legacy field and index never synthesizes summaries", () => {
  const baseline = readBaseline();
  const allow = JSON.parse(
    fs.readFileSync("data/knowledge/legacy-allowlist.json", "utf8"),
  ).ids;
  assert.deepEqual(
    legacyTransitionErrors(knowledgeCards, allow, baseline.ids),
    [],
  );
  assert.deepEqual(frozenLegacyErrors(knowledgeCards, baseline.cards), []);
  for (const c of knowledgeCards) {
    assert.deepEqual(
      JSON.parse(fs.readFileSync(`data/knowledge/cards/${c.id}.json`, "utf8")),
      c,
    );
    const item = collectionIndex().find((e) => e.id === c.id)!;
    if (c.schemaVersion === "0.3-legacy") {
      assert.ok(!("summary" in c) && !("negotiables" in c));
      assert.equal(item.summary, undefined);
      assert.equal(item.coverage, "legacy");
      assert.equal(item.definition, c.definition);
    } else assert.equal(item.summary, c.summary);
  }
  const changed = legacy();
  changed.definition += "修改旧卡的内容必须触发拒绝。";
  assert.ok(frozenLegacyErrors([changed], baseline.cards).length);
});
test("legacy admission is a shrinking set, not merely a count", () => {
  const card = legacy();
  const id = card.id;
  assert.deepEqual(legacyTransitionErrors([card], [id], [id]), []);
  assert.ok(legacyTransitionErrors([card], [], [id]).length);
  assert.ok(legacyTransitionErrors([card], [id], []).length);
  assert.ok(legacyTransitionErrors([card], [id], ["A99-999"]).length);
  assert.ok(legacyTransitionErrors([card], [id, id], [id]).length);
  assert.ok(legacyTransitionErrors([], [], [id]).length);
  const promoted = { ...demo(), id };
  assert.deepEqual(legacyTransitionErrors([promoted], [], [id]), []);
  assert.ok(legacyTransitionErrors([promoted], [id], [id]).length);
});
test("schema rejects incomplete prose, unknown dimensions/facets and fake review metadata", () => {
  assert.ok(V04CardSchema.safeParse(demo()).success);
  assert.ok(
    !KnowledgeCardSchema.safeParse({ ...demo(), schemaVersion: "0.3-legacy" })
      .success,
  );
  for (const patch of [
    { summary: "字".repeat(61) },
    { summary: "第一句话。第二句话。" },
    { definition: "这只有一句工作定义。" },
    { whatItLooksLike: ["仅有一条虚构生活情境。"] },
    { misconceptions: [] },
    { distinctions: [] },
    { facets: { invented: "猜测值" } },
    {
      negotiables: [
        { topic: "时间安排", dimension: "invented", options: ["早晨", "夜晚"] },
      ],
    },
    { evidence: { ...demo().evidence, independentReview: "reviewed" } },
    { evidence: { ...demo().evidence, humanReviewer: "假审核人" } },
  ])
    assert.ok(
      !V04CardSchema.safeParse({ ...demo(), ...patch }).success,
      JSON.stringify(patch),
    );
  assert.ok(
    V04CardSchema.safeParse({
      ...demo(),
      evidence: {
        ...demo().evidence,
        independentReview: "reviewed",
        humanReviewer: "测试用人类审核字段",
        reviewedAt: "2026-11-18",
        reviewReason: "仅验证字段结构，不是真实审核。",
      },
    }).success,
  );
});
test("20-character duplicates fail across fields and inside list items; 19 do not", () => {
  const text = "甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉";
  const stub = (a: string, b: string) =>
    ({ id: "A04-001", needs: [a, b] }) as KnowledgeCard;
  assert.equal(repeatedFields(stub(text, text)).length, 1);
  assert.equal(
    repeatedFields(stub(text.slice(0, 19), text.slice(0, 19))).length,
    0,
  );
  assert.equal(repeatedFields(stub(`首${text}尾`, `异${text}另`)).length, 1);
});
test("boilerplate threshold counts distinct cards and includes legacy/new crossings", () => {
  const sentence = "这是一句用于边界测试而不是实际百科内容的样板句。";
  const cards = Array.from({ length: 6 }, (_, i) => ({
    ...legacy(),
    id: `A99-00${i}`,
    definition: sentence,
  }));
  const matched = (n: number) =>
    repeatedSentences(cards.slice(0, n)).filter(
      (i) => i.fragment === sentence.slice(0, -1),
    );
  assert.equal(matched(5).length, 0);
  assert.equal(matched(6).length, 1);
  assert.deepEqual(
    repeatedSentences([{ ...demo(), needs: Array(6).fill(sentence) }]),
    [],
  );
});
test("word limits exclude metadata, source notes and controlled attributes", () => {
  const card = demo();
  const count = bodyCharacters(card);
  card.evidence.note += "伪造长度".repeat(1000);
  card.facets.purpose = "虚构".repeat(1000);
  assert.equal(bodyCharacters(card), count);
  for (const depth of ["deep", "standard", "brief"] as const) {
    const short = { ...demo(), depth };
    short.deepDive = [];
    short.whatItLooksLike = [];
    short.needs = [];
    short.interactions = [];
    short.boundaries = [];
    short.commonDealbreakers = [];
    short.misconceptions = [];
    short.distinctions = [];
    short.negotiables = [];
    short.definition = "短";
    short.scope = "短";
    short.participants = [];
    short.changes = { start: "短", evolve: "短", end: "短" };
    short.properties = {
      emotion: "短",
      time: "短",
      economics: "短",
      material: "短",
      autonomy: "短",
    };
    assert.ok(
      cardQuality(short, false).some((i) => i.code === "body_too_short"),
      depth,
    );
  }
});
test("negotiation and risk boundaries enforce depth-aware counts", () => {
  const card = demo();
  card.negotiables = [];
  assert.ok(cardQuality(card, false).some((i) => i.code === "negotiables"));
  card.depth = "brief";
  assert.ok(cardQuality(card, false).some((i) => i.code === "negotiables"));
  card.negotiables = [demo().negotiables[0]];
  assert.ok(!cardQuality(card, false).some((i) => i.code === "negotiables"));
  card.negotiables = [];
  assert.ok(cardQuality(card, true).some((i) => i.code === "risk_start"));
  card.changes.start = null;
  assert.ok(
    !cardQuality(card, true).some(
      (i) => i.code === "negotiables" || i.code === "risk_start",
    ),
  );
});
test("unknown sources, self links, missing links and alias cycles are rejected", () => {
  const entryIds = new Set(entries.map((e) => e.id));
  const sourceIds = new Set(["SEP-FRIEND"]);
  const card = demo();
  assert.deepEqual(referenceErrors([card], entryIds, sourceIds), []);
  card.evidence.sourceIds.push("INVENTED");
  card.relatedIds.push(card.id);
  card.seeAlso.push("A99-999");
  assert.equal(referenceErrors([card], entryIds, sourceIds).length, 3);
  const a = demo(),
    b = { ...demo(), id: "A04-007" };
  a.aliasOf = b.id;
  b.aliasOf = a.id;
  assert.ok(
    referenceErrors([a, b], entryIds, sourceIds).some((e) =>
      e.includes("alias cycle"),
    ),
  );
});
test("authored v0.4 example passes gates, legacy repetition remains visible", () => {
  for (const card of currentCards)
    assert.deepEqual(cardQuality(card, false), []);
  assert.ok(
    knowledgeCards.some(
      (c) => c.schemaVersion === "0.3-legacy" && repeatedFields(c).length,
    ),
  );
  assert.ok(repeatedSentences(knowledgeCards).length);
});
