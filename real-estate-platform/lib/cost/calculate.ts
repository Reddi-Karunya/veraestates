import type { CostBreakdownInput } from "@/lib/cost/types";

export function calculateTotalCost(input: CostBreakdownInput): number {
  return (
    input.owner_price +
    input.registration_cost +
    input.legal_verification_cost +
    input.platform_fee +
    input.miscellaneous_cost
  );
}

export function computeCostBreakdown(input: CostBreakdownInput) {
  return {
    ...input,
    total_cost: calculateTotalCost(input),
  };
}
