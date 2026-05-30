import type { CostBreakdownComputed, CostLineItem } from "@/lib/cost/types";

export const COST_LINE_LABELS = {
  owner_price: "Owner Direct Price",
  registration_cost: "Registration Charges",
  legal_verification_cost: "Legal Verification Fee",
  platform_fee: "Platform Service Fee",
  miscellaneous_cost: "Miscellaneous Charges",
  total_cost: "Total Acquisition Cost",
  market_price: "Typical Broker-Assisted Market Price",
  computed_savings: "You Save",
} as const;

export function buildCostLineItems(
  breakdown: CostBreakdownComputed
): CostLineItem[] {
  return [
    { key: "owner_price", label: COST_LINE_LABELS.owner_price, amount: breakdown.owner_price },
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
