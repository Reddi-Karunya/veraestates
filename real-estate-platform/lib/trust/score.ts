import type { VerificationCheckRow } from "@/types/database";

export const TRUST_SCORE_MAX = 100;

export function calculateTrustScore(
  checks: Pick<VerificationCheckRow, "status">[]
): number {
  if (checks.length === 0) return 0;
  const verified = checks.filter((c) => c.status === "verified").length;
  return Math.round((verified / checks.length) * TRUST_SCORE_MAX);
}

export function isFullyVerified(score: number, checkCount: number): boolean {
  return checkCount > 0 && score === TRUST_SCORE_MAX;
}

export function trustScoreLabel(score: number): string {
  if (score >= 100) return "Fully Verified";
  if (score >= 80) return "Highly Trusted";
  if (score >= 50) return "Partially Verified";
  if (score > 0) return "Verification In Progress";
  return "Pending Verification";
}

export function trustScoreColorClass(score: number): string {
  if (score >= 100) return "text-emerald-600";
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-muted-foreground";
}
