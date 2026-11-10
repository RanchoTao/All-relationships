/** Historical Phase 1 research contract. Phase 2 executable rules and types live in assessment.ts; no collection endpoint. */
export type PreferenceDimension =
  | "purpose"
  | "emotional_closeness"
  | "romance"
  | "physical_boundaries"
  | "commitment"
  | "exclusivity"
  | "independence"
  | "time"
  | "resources"
  | "negotiated_rules";
export type PreferenceAnswer = {
  itemId: string;
  value: string | null;
  state: "answered" | "unsure" | "skipped" | "not_applicable";
  context?: string;
};
export interface PreferenceProfile {
  schemaVersion: string;
  generatedAt: string;
  scope: "current_self_report";
  dimensions: Partial<
    Record<
      PreferenceDimension,
      {
        description: string;
        supportingItemIds: string[];
        uncertainty: "unknown" | "high" | "moderate";
        userOverride?: string;
        rejected: boolean;
      }
    >
  >;
  limitations: string[];
  scientificStatus: "unvalidated_research_prototype";
}
export interface AssessmentResearchAdapter {
  /** Historical async adapter proposal; the v0.1 implementation uses synchronous pure functions. */
  proposeNext(answers: readonly PreferenceAnswer[]): Promise<{
    itemId: string | null;
    rationale: string;
    stopReason?:
      | "user_stop"
      | "insufficient_items"
      | "burden_limit"
      | "research_precision_target";
  }>;
  summarize(answers: readonly PreferenceAnswer[]): Promise<PreferenceProfile>;
}
