import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { computeCostBreakdown } from "@/lib/cost/calculate";
import type { CostBreakdownComputed, CostBreakdownInput } from "@/lib/cost/types";
import type { PropertyCostBreakdownRow } from "@/types/database";

function rowToComputed(row: PropertyCostBreakdownRow): CostBreakdownComputed {
  const input: CostBreakdownInput = {
    owner_price: Number(row.owner_price ?? 0),
    registration_cost: Number(row.registration_cost ?? 0),
    legal_verification_cost: Number(row.legal_verification_cost ?? 0),
    platform_fee: Number(row.platform_fee ?? 0),
    miscellaneous_cost: Number(row.miscellaneous_cost ?? 0),
  };

  const computed = computeCostBreakdown(input);
  return {
    property_id: row.property_id,
    ...computed,
    total_cost: Number(row.total_cost ?? computed.total_cost),
  };
}

export function getMockCostBreakdown(
  propertyId: string,
  basePrice: number
): CostBreakdownComputed {
  const input: CostBreakdownInput = {
    owner_price: basePrice,
    registration_cost: Math.round(basePrice * 0.07),
    legal_verification_cost: 25_000,
    platform_fee: Math.round(basePrice * 0.01),
    miscellaneous_cost: 15_000,
  };
  return {
    property_id: propertyId,
    ...computeCostBreakdown(input),
  };
}

export async function getCostBreakdownByPropertyId(
  propertyId: string,
  fallbackBasePrice?: number
): Promise<CostBreakdownComputed | null> {
  if (!isSupabaseConfigured()) {
    if (fallbackBasePrice == null) return null;
    return getMockCostBreakdown(propertyId, fallbackBasePrice);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_cost_breakdowns")
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (error) {
    console.error("[getCostBreakdownByPropertyId]", error);
    return null;
  }

  if (!data) {
    if (fallbackBasePrice == null) return null;
    return getMockCostBreakdown(propertyId, fallbackBasePrice);
  }

  return rowToComputed(data as PropertyCostBreakdownRow);
}

export async function upsertCostBreakdown(
  propertyId: string,
  input: CostBreakdownInput
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("property_cost_breakdowns").upsert({
    property_id: propertyId,
    owner_price: input.owner_price,
    registration_cost: input.registration_cost,
    legal_verification_cost: input.legal_verification_cost,
    platform_fee: input.platform_fee,
    miscellaneous_cost: input.miscellaneous_cost,
  });

  if (error) return { error: error.message };
  return {};
}

export async function trackAnalyticsEvent(params: {
  eventName: string;
  propertyId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.info("[analytics]", params);
    return;
  }

  const supabase = await createClient();
  await supabase.from("analytics_events").insert({
    event_name: params.eventName,
    property_id: params.propertyId ?? null,
    session_id: params.sessionId ?? null,
    metadata: params.metadata ?? {},
  });
}

export async function getCostBreakdownViewCount(
  propertyId: string
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId)
    .eq("event_name", "viewed_cost_breakdown");

  return count ?? 0;
}
