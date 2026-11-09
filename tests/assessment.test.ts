import test from "node:test";
import assert from "node:assert/strict";
import {
  assess,
  questions,
  templates,
  questionPath,
  nextQuestion,
  updateAnswer,
  sanitizeAnswers,
  activeAnswers,
  safeShareText,
  type Answers,
} from "../src/lib/assessment";
import { entryById } from "../src/lib/catalog";
import { knowledgeById } from "../src/lib/knowledge";
const a = (values: Record<string, string>, hard: string[] = []): Answers =>
  Object.fromEntries(
    Object.entries(values).map(([id, value]) => [
      id,
      { state: "answered", value, must: hard.includes(id) },
    ]),
  );
const base = {
  emotion: "regular",
  commitment: "trial",
  time: "weekly",
  independence: "high",
  rules: "explicit",
};
test("published question and template references are unique and resolvable", () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  assert.equal(new Set(templates.map((t) => t.id)).size, templates.length);
  for (const t of templates) {
    assert.ok(entryById[t.id]);
    assert.ok(knowledgeById[t.id]);
    assert.notEqual(knowledgeById[t.id].concept.kind, "lifecycle");
    for (const [id, s] of Object.entries(t.signals)) {
      assert.ok(s.basis.length > 20);
      for (const v of s.values)
        assert.ok(
          questions
            .find((q) => q.id === id)
            ?.options.some((o) => o.value === v),
        );
    }
  }
});
test("long-term, friendship, activity and research scenarios produce distinct, explained reading pools", () => {
  const scenarios = [
    a({
      ...base,
      purpose: "romantic",
      age: "adult",
      romance: "yes",
      commitment: "long",
      emotion: "deep",
    }),
    a({ ...base, purpose: "friendship", emotion: "deep", commitment: "long" }),
    a({ ...base, purpose: "activity", activity: "sport", emotion: "light" }),
    a({
      ...base,
      purpose: "research",
      research: "produce",
      resources: "limited",
    }),
  ];
  const rows = scenarios.map((s) => assess(s));
  for (const r of rows) {
    assert.ok(r.recommendations.length >= 3 && r.recommendations.length <= 5);
    assert.ok(
      r.recommendations.every((c) => c.trace[0].questionId === "purpose"),
    );
  }
  assert.ok(rows[0].recommendations.some((r) => r.template.id === "A01-018"));
  assert.ok(rows[1].recommendations.some((r) => r.template.id === "A04-007"));
  assert.ok(
    rows[2].recommendations
      .slice(0, 3)
      .every((r) => r.template.id.startsWith("A06")),
  );
  assert.ok(
    rows[3].recommendations
      .slice(0, 3)
      .some((r) => r.template.id === "A09-014"),
  );
});
test("deterministic branches stay between 6 and 12 and insensitive routes never ask adult questions", () => {
  for (const goal of [
    "romantic",
    "friendship",
    "activity",
    "research",
    "learning",
    "living",
    "community",
  ])
    for (const age of ["adult", "not_adult", "decline"]) {
      const input = a({ purpose: goal, age });
      const p = questionPath(input);
      assert.ok(p.length >= 6 && p.length <= 12);
      assert.equal(new Set(p).size, p.length);
      if (goal !== "romantic" || age !== "adult")
        assert.ok(!p.includes("physical") && !p.includes("exclusivity"));
      assert.deepEqual(questionPath(input), p);
    }
  assert.equal(nextQuestion({}), "purpose");
});
test("hard failures exclude; hard unknowns are pending, never treated as passes", () => {
  const romantic = a(
    {
      ...base,
      purpose: "romantic",
      age: "adult",
      commitment: "long",
      romance: "yes",
      housing: "apart",
    },
    ["housing", "commitment"],
  );
  const r = assess(romantic);
  assert.ok(r.recommendations.every((x) => x.template.id === "A01-028"));
  assert.ok(r.pending.some((x) => x.template.id === "A01-018"));
  assert.ok(r.excluded.some((x) => x.template.id === "A01-011"));
  const exclusive = assess(
    a(
      { ...base, purpose: "romantic", age: "adult", exclusivity: "exclusive" },
      ["exclusivity"],
    ),
  );
  assert.equal(exclusive.recommendations.length, 0);
  assert.ok(exclusive.pending.length > 0);
});
test("unknown, skip, not-applicable and unasked remain separate and do not score", () => {
  const input: Answers = {
    ...a({ purpose: "friendship" }),
    emotion: { state: "unsure", value: "deep", must: true },
    time: { state: "skipped", value: null, must: false },
    commitment: { state: "not_applicable", value: null, must: false },
  };
  const r = assess(input);
  assert.equal(r.dimensions.find((d) => d.key === "emotion")?.state, "unsure");
  assert.equal(r.dimensions.find((d) => d.key === "time")?.state, "skipped");
  assert.equal(
    r.dimensions.find((d) => d.key === "commitment")?.state,
    "not_applicable",
  );
  assert.equal(r.dimensions.find((d) => d.key === "romance")?.state, "unasked");
  assert.ok(r.recommendations.every((x) => x.trace.length === 1));
  assert.equal(r.answers.emotion.value, null);
  assert.equal(r.answers.emotion.must, false);
  assert.equal(assess({}).recommendations.length, 0);
});
test("answer edits remove hidden branch data including adult answers", () => {
  const input = a({
    ...base,
    purpose: "romantic",
    age: "adult",
    physical: "no_sex",
    exclusivity: "exclusive",
    romance: "yes",
  });
  const changed = updateAnswer(input, "purpose", {
    state: "answered",
    value: "research",
    must: false,
  });
  assert.ok(!changed.age && !changed.physical && !changed.romance);
  assert.equal(nextQuestion(changed), "research");
  const gate = updateAnswer(input, "age", {
    state: "answered",
    value: "decline",
    must: false,
  });
  assert.ok(!gate.physical && !gate.exclusivity);
  assert.equal(assess(gate).recommendations.length, 0);
});
test("conflicting romance direction stays unresolved, never silently overwritten", () => {
  const r = assess(
    a({ ...base, purpose: "romantic", age: "adult", romance: "no" }),
  );
  assert.equal(r.contradictions.length, 1);
  assert.equal(r.recommendations.length, 0);
  assert.equal(r.answers.romance.value, "no");
});
test("changes alter ordering; denials remove recommendations and do not infer traits", () => {
  const one = assess(a({ ...base, purpose: "activity", activity: "food" }));
  const two = assess(a({ ...base, purpose: "activity", activity: "sport" }));
  assert.notEqual(
    one.recommendations[0].template.id,
    two.recommendations[0].template.id,
  );
  const id = one.recommendations[0].template.id;
  assert.ok(
    !assess(a({ ...base, purpose: "activity", activity: "food" }), [
      id,
    ]).recommendations.some((r) => r.template.id === id),
  );
});
test("malformed or injected answers and hidden dimensions cannot influence results", () => {
  assert.deepEqual(
    sanitizeAnswers({
      purpose: { state: "answered", value: "fake", must: false },
    }),
    {},
  );
  assert.deepEqual(
    sanitizeAnswers({
      purpose: {
        state: "answered",
        value: "friendship",
        must: true,
        extra: "x",
      },
    }),
    {},
  );
  assert.deepEqual(
    activeAnswers(a({ purpose: "research", physical: "no_sex", age: "adult" })),
    a({ purpose: "research" }),
  );
  assert.ok(!safeShareText.includes("A01-"));
  assert.ok(!safeShareText.includes("身体"));
});
test("all supported paths can terminate with unknowns without filling them", () => {
  for (const goal of [
    "romantic",
    "friendship",
    "activity",
    "research",
    "learning",
    "living",
    "community",
  ]) {
    let answers = a({
      purpose: goal,
      ...(goal === "romantic" ? { age: "adult" } : {}),
    });
    let n = 0;
    while (nextQuestion(answers)) {
      answers = updateAnswer(answers, nextQuestion(answers)!, {
        state: "skipped",
        value: null,
        must: false,
      });
      assert.ok(++n <= 12);
    }
    assert.ok(assess(answers).unknown.length >= 5);
  }
});
