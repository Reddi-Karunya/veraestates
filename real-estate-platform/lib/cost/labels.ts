import type { CostBreakdownComputed, CostLineItem } from "@/lib/cost/types";

export const COST_LINE_LABELS = {
  base_price: "Property Price",
  registration_cost: "Registration Charges",
  legal_verification_cost: "Legal Verification Fee",
  platform_fee: "Platform Service Fee",
  miscellaneous_cost: "Miscellaneous Charges",
  total_cost: "Total Acquisition Cost",
  estimated_market_price: "Estimated Market Price",
  estimated_savings: "Estimated Buyer Savings",
} as const;

export function buildCostLineItems(
  breakdown: CostBreakdownComputed
): CostLineItem[] {
  return [
    { key: "base_price", label: COST_LINE_LABELS.base_price, amount: breakdown.base_price },
    {
      key: "registration_cost",
      label: COST_LINE_LABELS.registration_cost,
      amount: breakdown.registration_cost,
    },
    {
      key: "legal_verification_cost",
      label: COST_LINE_LABELS.legal_verification_cost,
      amount: breakdown.legal_verification_cost,
    },
    {
      key: "platform_fee",
      label: COST_LINE_LABELS.platform_fee,
      amount: breakdown.platform_fee,
    },
    {
      key: "miscellaneous_cost",
      label: COST_LINE_LABELS.miscellaneous_cost,
      amount: breakdown.miscellaneous_cost,
    },
  ];
}
