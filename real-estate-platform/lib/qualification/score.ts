import type {
  BudgetRange,
  QualificationInput,
  QualificationResult,
  QualificationTier,
  PurchaseTimeline,
} from "@/lib/qualification/types";

const BUDGET_BOUNDS: Record<
  BudgetRange,
  { min: number; max: number }
> = {
  under_50L: { min: 0, max: 5_000_000 },
  "50L_1Cr": { min: 5_000_000, max: 10_000_000 },
  "1Cr_2Cr": { min: 10_000_000, max: 20_000_000 },
  "2Cr_5Cr": { min: 20_000_000, max: 50_000_000 },
  "5Cr_plus": { min: 50_000_000, max: Number.POSITIVE_INFINITY },
};

const TIMELINE_SCORES: Record<PurchaseTimeline, number> = {
  immediate: 30,
  "30_days": 24,
  "3_months": 15,
  "6_plus_months": 5,
};

export function scoreBudgetMatch(
  budgetRange: BudgetRange,
  propertyPriceInr: number
): number {
  const { min, max } = BUDGET_BOUNDS[budgetRange];
  const effectiveMax = max === Number.POSITIVE_INFINITY ? min * 3 : max;

  if (propertyPriceInr >= min && propertyPriceInr <= effectiveMax) {
    return 35;
  }

  const rangeMid = max === Number.POSITIVE_INFINITY ? min * 1.5 : (min + max) / 2;
  const diffRatio =
    Math.abs(propertyPriceInr - rangeMid) /
    Math.max(rangeMid, propertyPriceInr, 1);

  if (diffRatio <= 0.15) return 25;
  if (diffRatio <= 0.3) return 15;
  return 5;
}

export function scoreTimeline(timeline: PurchaseTimeline): number {
  return TIMELINE_SCORES[timeline];
}

export function scoreLoanStatus(
  loanRequired: boolean,
  timeline: PurchaseTimeline
): number {
  if (!loanRequired) return 15;

  if (timeline === "immediate" || timeline === "30_days") return 12;
  if (timeline === "3_months") return 8;
  return 4;
}

export function scoreIntent(purpose: QualificationInput["property_purpose"]): number {
  return purpose === "self_use" ? 20 : 14;
}

export function getQualificationTier(score: number): QualificationTier {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function computeQualificationScore(
  input: QualificationInput
): QualificationResult {
  const budget_match = scoreBudgetMatch(
    input.budget_range,
    input.property_price_inr
  );
  const timeline = scoreTimeline(input.purchase_timeline);
  const loan_status = scoreLoanStatus(
    input.loan_required,
    input.purchase_timeline
  );
  const intent = scoreIntent(input.property_purpose);

  const score = Math.min(
    100,
    Math.max(0, budget_match + timeline + loan_status + intent)
  );

  return {
    score,
    tier: getQualificationTier(score),
    breakdown: { budget_match, timeline, loan_status, intent },
  };
}
