import { z } from "zod";

export const EvidenceSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "source_fact",
    "working_definition",
    "theoretical_inference",
    "unverified",
  ]),
  source: z.string(),
  locator: z.string(),
  quote: z.string().optional(),
  review: z.enum(["unreviewed", "reviewed"]),
  reviewedAt: z.string().optional(),
});
export const ClaimSchema = z.object({
  value: z.string(),
  evidenceIds: z.array(z.string()).min(1),
});
export const ReferenceSchema = z
  .string()
  .url()
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Only HTTP(S) evidence links are accepted",
  );
export const AttributeKeys = [
  "purpose",
  "intimacy",
  "duration",
  "participants",
  "cohabitation",
  "resources",
  "romance",
  "sexual",
  "structure",
] as const;
export type AttributeKey = (typeof AttributeKeys)[number];
export const EntrySchema = z.object({
  id: z.string().regex(/^A\d{2}-\d{3}$/),
  label_zh: z.string().min(1),
  category_id: z.string(),
  domain: z.string(),
  family: z.string(),
  kind: z.string(),
  archetype_family: z.string(),
  scope: z.literal("descriptive_wiki"),
  wiki_definition_zh: z.string().nullable(),
  definition_status: z.enum(["working_draft", "not_yet_written", "reviewed"]),
  evidence_status: z.enum(["unreviewed", "reviewed"]),
  source_refs: z.array(ReferenceSchema),
  aliases: z.array(z.string()),
  participant_count: z.string(),
  matchmaking_treatment: z.string(),
  adult_only_for_intimate_matching: z.boolean(),
  involuntary_or_harm_risk: z.boolean(),
  original: z.object({ classification: z.string(), handling: z.string() }),
  review_notes: z.array(z.string()),
});
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  classification: z.string(),
  proposed_platform_handling: z.string(),
  count: z.number(),
});
export const PrototypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  working_definition_zh: z.string(),
  status: z.literal("proposal_needs_review"),
});
export const DraftSchema = z.object({
  metadata: z
    .object({
      exact_entry_count: z.number(),
      category_count: z.number(),
      version: z.string(),
    })
    .passthrough(),
  category_summary: z.array(CategorySchema),
  prototype_families: z.array(PrototypeSchema),
  entries: z.array(EntrySchema),
});
export type Entry = z.infer<typeof EntrySchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Claim = z.infer<typeof ClaimSchema>;

// Descriptive knowledge and normative rules never share a field.
export const RelationshipKnowledgeSchema = z.object({
  entryId: z.string(),
  archetypes: z.array(ClaimSchema),
  variants: z.array(ClaimSchema),
  contexts: z.array(ClaimSchema),
  attributes: z.partialRecord(z.enum(AttributeKeys), ClaimSchema),
  overview: ClaimSchema.optional(),
  fullDefinition: ClaimSchema.optional(),
  boundaries: z.array(ClaimSchema),
  rightsAndResponsibilities: z.array(ClaimSchema),
  roles: z.array(ClaimSchema),
  interactions: z.array(ClaimSchema),
  conflicts: z.array(ClaimSchema),
  lifecycle: z.array(
    z.object({ from: z.string(), to: z.string(), claim: ClaimSchema }),
  ),
  links: z.array(
    z.object({
      targetId: z.string(),
      relation: z.enum([
        "variant_of",
        "related_to",
        "context_of",
        "composite_of",
      ]),
      evidenceIds: z.array(z.string()).min(1),
    }),
  ),
  evidence: z.array(EvidenceSchema),
});
export interface RelationshipRules {
  id: string;
  kind: "negotiable_proposal";
  scopeEntryIds: string[];
  text: string;
  consentRequired: true;
  evidenceIds: string[];
  jurisdiction?: string;
}
// A relation instance can have any number of participants and coexist with other relations.
export interface RelationshipStructure {
  id: string;
  participantRoles: { roleId: string; label: string }[];
  memberships: { relationId: string; roleIds: string[] }[]; // hyperedges, never forced into pairs
  validFrom?: string;
  validTo?: string;
  overlappingRelationIds: string[];
}
