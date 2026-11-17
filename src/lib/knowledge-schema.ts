import { z } from "zod";
import { dimensions } from "./assessment";

const text = z.string().min(8);
const list = z.array(text).min(1);
export const LegacyCardSchema = z
  .object({
    schemaVersion: z.literal("0.3-legacy"),
    id: z.string().regex(/^A\d{2}-\d{3}$/),
    version: z.literal("0.3.0"),
    batch: z.enum(["P2-01", "P2-02"]),
    depth: z.enum(["deep", "basic"]),
    concept: z.object({
      kind: z.enum([
        "archetype",
        "variant",
        "scenario",
        "structure",
        "lifecycle",
        "role",
        "composite",
      ]),
      rationale: text,
    }),
    definition: text,
    scope: text,
    scenarios: list,
    participants: z.array(z.string().min(2)).min(1),
    needs: list,
    interactions: list,
    properties: z.object({
      emotion: text,
      time: text,
      economics: text,
      material: text,
      autonomy: text,
    }),
    boundaries: list,
    misconceptions: list,
    conflicts: list,
    distinctions: z.array(z.object({ targetId: z.string(), text })).min(1),
    changes: list,
    facets: z.record(z.string(), z.string()),
    evidence: z.object({
      definitionKind: z.literal("working_definition"),
      editor: z.string(),
      editedAt: z.string(),
      sourceIds: z.array(z.string()),
      independentReview: z.literal("pending"),
      humanReviewer: z.null(),
      unverifiedHypotheses: z.array(text),
      note: text,
    }),
    deepDive: z.array(z.object({ title: z.string(), text })),
  })
  .strict()
  .superRefine((c, ctx) => {
    if (c.depth === "deep" && c.deepDive.length < 4)
      ctx.addIssue({
        code: "custom",
        message: "Deep card requires extended sections",
      });
  });

const id = z.string().regex(/^A\d{2}-\d{3}$/);
const uniqueIds = z
  .array(id)
  .refine((ids) => new Set(ids).size === ids.length, "Duplicate IDs");
const sentenceCount = (s: string) =>
  s.split(/[。！？!?]+/u).filter((p) => p.trim()).length;
const evidence = z
  .object({
    definitionKind: z.literal("working_definition"),
    editor: text,
    editedAt: z.iso.date(),
    sourceIds: z
      .array(z.string().min(1))
      .refine((ids) => new Set(ids).size === ids.length),
    independentReview: z.enum([
      "pending",
      "ai_drafted",
      "ai_self_checked",
      "reviewed",
    ]),
    humanReviewer: z.string().min(2).nullable(),
    reviewedAt: z.iso.date().optional(),
    reviewReason: text.optional(),
    unverifiedHypotheses: z.array(text),
    note: text,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.independentReview === "reviewed") {
      if (!value.humanReviewer || !value.reviewedAt || !value.reviewReason)
        ctx.addIssue({
          code: "custom",
          message: "Human review requires reviewer, date and reason",
        });
    } else if (
      value.humanReviewer !== null ||
      value.reviewedAt ||
      value.reviewReason
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Unreviewed draft cannot claim human review",
      });
    }
  });

export const V04CardSchema = z
  .object({
    schemaVersion: z.literal("0.4"),
    id,
    version: z.literal("0.4.0"),
    batch: z.string().min(1),
    depth: z.enum(["deep", "standard", "brief"]),
    concept: z
      .object({
        kind: z.enum([
          "archetype",
          "variant",
          "scenario",
          "structure",
          "lifecycle",
          "role",
          "composite",
        ]),
        rationale: text,
      })
      .strict(),
    summary: text.refine(
      (s) => Array.from(s).length <= 60 && sentenceCount(s) === 1,
      "Summary must be one sentence, at most 60 characters",
    ),
    definition: text.refine(
      (s) => sentenceCount(s) >= 2 && sentenceCount(s) <= 4,
      "Definition requires 2–4 sentences",
    ),
    scope: text,
    whatItLooksLike: z.array(text).min(2).max(4),
    participants: list,
    needs: list,
    interactions: list,
    properties: z
      .object({
        emotion: text,
        time: text,
        economics: text,
        material: text,
        autonomy: text,
      })
      .strict(),
    boundaries: list,
    negotiables: z.array(
      z
        .object({
          topic: z.string().min(2),
          options: z
            .array(z.string().min(2))
            .min(2)
            .max(4)
            .refine((values) => new Set(values).size === values.length),
          dimension: z.enum(
            Object.keys(dimensions) as [
              keyof typeof dimensions,
              ...(keyof typeof dimensions)[],
            ],
          ),
        })
        .strict(),
    ),
    commonDealbreakers: list,
    misconceptions: z.array(text).min(2),
    distinctions: z
      .array(z.object({ targetId: id, text }).strict())
      .min(2)
      .refine(
        (items) =>
          new Set(items.map((item) => item.targetId)).size === items.length,
        "Distinct neighbors required",
      ),
    changes: z
      .object({ start: text.nullable(), evolve: text, end: text })
      .strict(),
    relatedIds: uniqueIds,
    aliasOf: id.optional(),
    seeAlso: uniqueIds,
    facets: z.partialRecord(
      z.enum([
        "purpose",
        "intimacy",
        "duration",
        "cohabitation",
        "resources",
        "romance",
        "sexual",
        "structure",
      ]),
      z.string().min(1),
    ),
    evidence,
    deepDive: z.array(z.object({ title: z.string().min(2), text }).strict()),
  })
  .strict()
  .superRefine((card, ctx) => {
    if (card.summary === card.definition)
      ctx.addIssue({
        code: "custom",
        message: "Summary is not the definition",
      });
    if (card.depth === "deep" && card.deepDive.length < 2)
      ctx.addIssue({
        code: "custom",
        message: "Deep card requires at least two extended sections",
      });
  });

export const KnowledgeCardSchema = z.discriminatedUnion("schemaVersion", [
  LegacyCardSchema,
  V04CardSchema,
]);
export type KnowledgeCard = z.infer<typeof KnowledgeCardSchema>;
export type LegacyCard = z.infer<typeof LegacyCardSchema>;
export type V04Card = z.infer<typeof V04CardSchema>;
