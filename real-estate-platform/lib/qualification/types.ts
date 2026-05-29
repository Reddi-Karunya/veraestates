export type BudgetRange =
  | "under_50L"
  | "50L_1Cr"
  | "1Cr_2Cr"
  | "2Cr_5Cr"
  | "5Cr_plus";

export type PropertyPurpose = "self_use" | "investment";

export type PurchaseTimeline =
  | "immediate"
  | "30_days"
  | "3_months"
  | "6_plus_months";

export type QualificationTier = "hot" | "warm" | "cold";

export type QualificationInput = {
  budget_range: BudgetRange;
  property_purpose: PropertyPurpose;
  purchase_timeline: PurchaseTimeline;
  loan_required: boolean;
  preferred_areas: string[];
  property_price_inr: number;
};

export type QualificationBreakdown = {
  budget_match: number;
  timeline: number;
  loan_status: number;
  intent: number;
};

export type QualificationResult = {
  score: number;
  tier: QualificationTier;
  breakdown: QualificationBreakdown;
};

export type LeadQualificationFormData = {
  propertyId: string;
  name: string;
  phone: string;
  budget_range: BudgetRange;
  property_purpose: PropertyPurpose;
  purchase_timeline: PurchaseTimeline;
  loan_required: boolean;
  preferred_areas: string[];
};
