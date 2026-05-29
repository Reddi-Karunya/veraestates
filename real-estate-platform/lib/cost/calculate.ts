import type { CostBreakdownInput } from "@/lib/cost/types";

export function calculateTotalCost(input: CostBreakdownInput): number {
  return (
    input.base_price +
    input.registration_cost +
    input.legal_verification_cost +
    input.platform_fee +
    input.miscellaneous_cost
  );
}

export function calculateEstimatedSavings(
  input: CostBreakdownInput,
  totalCost?: number
): number {
  const total = totalCost ?? calculateTotalCost(input);
  if (
    input.estimated_market_price == null ||
    input.estimated_market_price <= total
  ) {
    return 0;
  }
  return input.estimated_market_price - total;
}

export function computeCostBreakdown(input: CostBreakdownInput) {
  const total_cost = calculateTotalCost(input);
  const estimated_savings = calculateEstimatedSavings(input, total_cost);
  return {
    ...input,
    total_cost,
    estimated_savings,
    has_savings: estimated_savings > 0,
  };
}
