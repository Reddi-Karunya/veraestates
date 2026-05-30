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

export function calculateComputedSavings(
  input: CostBreakdownInput
): number {
  if (
    input.market_price == null ||
    input.market_price < input.owner_price
  ) {
    return 0;
  }
  return input.market_price - input.owner_price;
}

export function computeCostBreakdown(input: CostBreakdownInput) {
  const total_cost = calculateTotalCost(input);
  const computed_savings = calculateComputedSavings(input);
  return {
    ...input,
    total_cost,
    computed_savings,
    has_savings: computed_savings > 0,
  };
}
