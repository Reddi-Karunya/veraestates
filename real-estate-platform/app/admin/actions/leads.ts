"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import type { LeadPriority, LeadStatus } from "@/types/database";

export async function updateLeadAction(
  leadId: string,
  data: {
    status?: LeadStatus;
    priority?: LeadPriority;
    assigned_to?: string | null;
    follow_up_at?: string | null;
  }
) {
  await requireAdmin();
  const supabase = await createClient();

  const payload: Record<string, unknown> = { ...data };
  if (data.assigned_to === "") payload.assigned_to = null;

  const { error } = await supabase
    .from("leads")
    .update(payload)
    .eq("id", leadId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function addLeadNoteAction(
  leadId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const { userId } = await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();

  if (!body || body.length < 2) {
    return { error: "Note must be at least 2 characters" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    body,
    created_by: userId,
  });

  if (error) return { error: error.message };

  revalidatePath(`/admin/leads/${leadId}`);
  return {};
}

export async function deleteLeadNoteAction(noteId: string, leadId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}
