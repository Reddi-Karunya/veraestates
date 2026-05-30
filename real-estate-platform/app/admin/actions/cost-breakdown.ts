"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { upsertCostBreakdown } from "@/lib/data/cost-breakdown";
import type { CostBreakdownInput } from "@/lib/cost/types";

function parseCostFormData(formData: FormData): CostBreakdownInput {
  const num = (key: string) => {
    const v = formData.get(key);
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  const owner_price = num("owner_price");
  if (owner_price == null || owner_price < 0) {
    throw new Error("Invalid owner price");
  }

  return {
    owner_price,
    registration_cost: num("registration_cost") ?? 0,
    legal_verification_cost: num("legal_verification_cost") ?? 0,
    platform_fee: num("platform_fee") ?? 0,
    miscellaneous_cost: num("miscellaneous_cost") ?? 0,
  };
}

export async function updateCostBreakdownAction(
  propertyId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();

  try {
    const input = parseCostFormData(formData);
    const result = await upsertCostBreakdown(propertyId, input);
    if (result.error) return { error: result.error };

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath("/properties");

    const slug = formData.get("property_slug");
    if (typeof slug === "string" && slug.length > 0) {
      revalidatePath(`/properties/${slug}`);
    }

    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to save",
    };
  }
}
