"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateVerificationCheckAction } from "@/app/admin/actions/verification";
import { trustScoreColorClass } from "@/lib/trust/score";
import type { VerificationCheckWithType } from "@/lib/data/verification";
import type { VerificationStatus } from "@/types/database";
import { cn } from "@/lib/utils";

type VerificationPanelProps = {
  propertyId: string;
  propertyTitle: string;
  trustScore: number;
  checks: VerificationCheckWithType[];
};

const statusOptions: { value: VerificationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Approve" },
  { value: "rejected", label: "Reject" },
];

export function VerificationPanel({
  propertyId,
  propertyTitle,
  trustScore,
  checks,
}: VerificationPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(checks.map((c) => [c.id, c.notes ?? ""]))
  );

  function handleUpdate(checkId: string, status: VerificationStatus) {
    startTransition(async () => {
      await updateVerificationCheckAction(checkId, propertyId, {
        status,
        notes: notes[checkId],
      });
      router.refresh();
    });
  }

  const verifiedCount = checks.filter((c) => c.status === "verified").length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl text-navy">{propertyTitle}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Trust score</p>
            <p className={cn("font-display text-3xl", trustScoreColorClass(trustScore))}>
              {trustScore}/100
            </p>
          </div>
          <Badge variant="outline">
            {verifiedCount}/{checks.length} checks passed
          </Badge>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Approve or reject each verification check. Score updates automatically.
          Document upload support will be added in a future release.
        </p>
      </div>

      <div className="space-y-4">
        {checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              "rounded-xl border bg-card p-5 shadow-sm transition-opacity",
              isPending && "opacity-70",
              check.status === "verified" && "border-emerald-500/30",
              check.status === "rejected" && "border-destructive/30"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-medium text-navy">
                  {check.check_types?.label ?? check.check_type}
                </h3>
                {check.check_types?.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {check.check_types.description}
                  </p>
                )}
                {check.verified_at && check.status === "verified" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Verified{" "}
                    {new Date(check.verified_at).toLocaleString("en-IN")}
                    {check.verifier?.full_name && ` by ${check.verifier.full_name}`}
                  </p>
                )}
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 capitalize",
                  check.status === "verified" && "border-emerald-500/40 text-emerald-700",
                  check.status === "rejected" && "border-destructive/40 text-destructive"
                )}
              >
                {check.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`notes-${check.id}`}>Notes</Label>
              <Textarea
                id={`notes-${check.id}`}
                rows={2}
                value={notes[check.id] ?? ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [check.id]: e.target.value }))
                }
                placeholder="Internal notes for this check..."
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  size="sm"
                  variant={check.status === opt.value ? "default" : "outline"}
                  className={
                    opt.value === "verified" && check.status === "verified"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : opt.value === "rejected" && check.status === "rejected"
                        ? "bg-destructive text-white hover:bg-destructive/90"
                        : opt.value === "verified"
                          ? "border-emerald-500/40 hover:bg-emerald-50"
                          : opt.value === "rejected"
                            ? "border-destructive/40 hover:bg-destructive/5"
                            : ""
                  }
                  disabled={isPending}
                  onClick={() => handleUpdate(check.id, opt.value)}
                >
                  {isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : opt.value === "verified" ? (
                    <CheckCircle2 data-icon="inline-start" />
                  ) : opt.value === "rejected" ? (
                    <XCircle data-icon="inline-start" />
                  ) : null}
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
