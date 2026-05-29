"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ensurePropertyChecksInitialized } from "@/lib/data/verification";
import type { VerificationStatus } from "@/types/database";

export async function updateVerificationCheckAction(
  checkId: string,
  propertyId: string,
  data: {
    status: VerificationStatus;
    notes?: string;
  }
) {
  const { userId } = await requireAdmin();
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    status: data.status,
    notes: data.notes?.trim() || null,
  };

  if (data.status === "verified") {
    payload.verified_at = new Date().toISOString();
    payload.verified_by = userId;
  } else if (data.status === "rejected" || data.status === "pending") {
    payload.verified_at = null;
    payload.verified_by = null;
  }

  const { error } = await supabase
    .from("property_verification_checks")
    .update(payload)
    .eq("id", checkId);

  if (error) throw new Error(error.message);

  const { data: property } = await supabase
    .from("properties")
    .select("slug")
    .eq("id", propertyId)
    .single();

  revalidatePath(`/admin/properties/${propertyId}/verify`);
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  if (property?.slug) {
    revalidatePath(`/properties/${property.slug}`);
  }
  revalidatePath("/properties");
  revalidatePath("/admin/properties");

  return { success: true };
}

export async function initializePropertyChecksAction(propertyId: string) {
  await requireAdmin();
  await ensurePropertyChecksInitialized(propertyId);
  revalidatePath(`/admin/properties/${propertyId}/verify`);
  return { success: true };
}
