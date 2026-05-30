import { createClient } from "@/lib/supabase/server";
import { calculateTrustScore } from "@/lib/trust/score";
import { verificationCheckLabels, VERIFICATION_CHECK_CODES } from "@/lib/constants/verification-checks";
import type {
  VerificationCheckRow,
  VerificationCheckTypeRow,
} from "@/types/database";

export type VerificationCheckWithType = VerificationCheckRow & {
  check_types: VerificationCheckTypeRow;
  verifier: { full_name: string | null; email: string } | null;
};

export function filterVerificationChecks(
  checks: VerificationCheckWithType[]
): VerificationCheckWithType[] {
  const allowed = new Set(VERIFICATION_CHECK_CODES);
  return checks.filter((check) => allowed.has(check.check_type as typeof VERIFICATION_CHECK_CODES[number]));
}

export async function getVerificationCheckTypes(): Promise<
  VerificationCheckTypeRow[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("verification_check_types")
    .select("*")
    .order("sort_order");

  return (
    (data ?? []) as VerificationCheckTypeRow[]
  ).filter((type) => VERIFICATION_CHECK_CODES.includes(type.code as any));
}

export async function getPropertyVerificationChecks(
  propertyId: string
): Promise<VerificationCheckWithType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_verification_checks")
    .select(
      `
      *,
      check_types:verification_check_types (*),
      verifier:profiles!verified_by (full_name, email)
    `
    )
    .eq("property_id", propertyId);

  if (error) {
    console.error("[getPropertyVerificationChecks]", error);
    return [];
  }

  const checks = (data ?? []) as VerificationCheckWithType[];
  return filterVerificationChecks(checks).sort(
    (a, b) => (a.check_types?.sort_order ?? 0) - (b.check_types?.sort_order ?? 0)
  );
}

export async function ensurePropertyChecksInitialized(
  propertyId: string
): Promise<void> {
  const supabase = await createClient();
  const types = await getVerificationCheckTypes();

  if (types.length === 0) return;

  const rows = types.map((t) => ({
    property_id: propertyId,
    check_type: t.code,
    status: "pending" as const,
  }));

  await supabase
    .from("property_verification_checks")
    .upsert(rows, { onConflict: "property_id,check_type", ignoreDuplicates: true });
}

/** Mock fallback checks for dev without Supabase */
export function getMockVerificationChecks(propertyId: string): VerificationCheckWithType[] {
  const now = new Date().toISOString();
  const codes = Object.entries(verificationCheckLabels);
  const verifiedCount = codes.length;

  return codes.map(([code, label], i) => {
    const verified = i < verifiedCount;
    return {
      id: `mock-${propertyId}-${code}`,
      property_id: propertyId,
      check_type: code,
      status: verified ? "verified" : "pending",
      verified_by: verified ? "mock-admin" : null,
      verified_at: verified ? now : null,
      notes: null,
      created_at: now,
      updated_at: now,
      check_types: {
        code,
        label,
        description: null,
        sort_order: i + 1,
        icon: null,
        supports_document_upload: true,
      },
      verifier: verified
        ? { full_name: "VeraEstates Team", email: "verify@veraestates.in" }
        : null,
    };
  });
}

export function checksToDisplayBadges(
  checks: VerificationCheckWithType[]
): string[] {
  return filterVerificationChecks(checks)
    .filter((c) => c.status === "verified")
    .map(
      (c) =>
        c.check_types?.label ??
        verificationCheckLabels[c.check_type as keyof typeof verificationCheckLabels] ??
        c.check_type
    );
}

export function resolveTrustScore(
  dbScore: number | undefined,
  checks: VerificationCheckWithType[]
): number {
  const activeChecks = filterVerificationChecks(checks);
  return calculateTrustScore(activeChecks);
}
