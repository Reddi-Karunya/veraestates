import type {
  BudgetRange,
  PropertyPurpose,
  PurchaseTimeline,
} from "@/lib/qualification/types";

export const budgetRangeOptions: {
  value: BudgetRange;
  label: string;
}[] = [
  { value: "under_50L", label: "Under ₹50 Lakh" },
  { value: "50L_1Cr", label: "₹50 Lakh – ₹1 Cr" },
  { value: "1Cr_2Cr", label: "₹1 Cr – ₹2 Cr" },
  { value: "2Cr_5Cr", label: "₹2 Cr – ₹5 Cr" },
  { value: "5Cr_plus", label: "₹5 Cr+" },
];

export const propertyPurposeOptions: {
  value: PropertyPurpose;
  label: string;
  description: string;
}[] = [
  {
    value: "self_use",
    label: "Self Use",
    description: "Moving in or personal residence",
  },
  {
    value: "investment",
    label: "Investment",
    description: "Rental income or capital appreciation",
  },
];

export const purchaseTimelineOptions: {
  value: PurchaseTimeline;
  label: string;
}[] = [
  { value: "immediate", label: "Immediate" },
  { value: "30_days", label: "Within 30 Days" },
  { value: "3_months", label: "Within 3 Months" },
  { value: "6_plus_months", label: "6+ Months" },
];

export const budgetRangeLabels: Record<BudgetRange, string> = Object.fromEntries(
  budgetRangeOptions.map((o) => [o.value, o.label])
) as Record<BudgetRange, string>;

export const propertyPurposeLabels: Record<PropertyPurpose, string> =
  Object.fromEntries(
    propertyPurposeOptions.map((o) => [o.value, o.label])
  ) as Record<PropertyPurpose, string>;

export const purchaseTimelineLabels: Record<PurchaseTimeline, string> =
  Object.fromEntries(
    purchaseTimelineOptions.map((o) => [o.value, o.label])
  ) as Record<PurchaseTimeline, string>;
