import {
  CheckCircle2,
  Circle,
  Clock,
  Shield,
  XCircle,
} from "lucide-react";
import { trustScoreColorClass, trustScoreLabel } from "@/lib/trust/score";
import type { PropertyVerificationCheckDisplay } from "@/lib/mock-properties";
import { cn } from "@/lib/utils";

type TrustCenterProps = {
  trustScore: number;
  checks: PropertyVerificationCheckDisplay[];
};

function StatusIcon({ status }: { status: string }) {
  if (status === "verified") {
    return <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />;
  }
  if (status === "rejected") {
    return <XCircle className="size-5 shrink-0 text-destructive" />;
  }
  if (status === "expired") {
    return <Clock className="size-5 shrink-0 text-muted-foreground" />;
  }
  return <Circle className="size-5 shrink-0 text-muted-foreground/40" />;
}

export function TrustCenter({ trustScore, checks }: TrustCenterProps) {
  const verifiedCount = checks.filter((c) => c.status === "verified").length;

  return (
    <section
      id="trust-center"
      className="overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-navy via-navy to-navy/95 text-cream"
    >
      <div className="border-b border-cream/10 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Shield className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                Trust Center
              </p>
              <h2 className="font-display text-2xl text-cream">
                Verification & Transparency
              </h2>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wide text-cream/50">
              Trust Score
            </p>
            <p
              className={cn(
                "font-display text-4xl",
                trustScoreColorClass(trustScore)
              )}
            >
              {trustScore}
              <span className="text-2xl text-cream/50">/100</span>
            </p>
            <p className="mt-1 text-sm text-cream/60">{trustScoreLabel(trustScore)}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <p className="text-sm text-cream/70">
          {verifiedCount} of {checks.length} verification checks completed. Every
          item below is reviewed by our team — document uploads coming soon.
        </p>

        <ul className="mt-6 divide-y divide-cream/10">
          {checks.map((check) => (
            <li
              key={check.checkType}
              className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <StatusIcon status={check.status} />
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      check.status === "verified"
                        ? "text-cream"
                        : "text-cream/70"
                    )}
                  >
                    {check.status === "verified" && "✓ "}
                    {check.label}
                  </p>
                  {check.status === "rejected" && (
                    <p className="mt-0.5 text-xs text-red-300">Not verified</p>
                  )}
                  {check.status === "pending" && (
                    <p className="mt-0.5 text-xs text-cream/40">Pending review</p>
                  )}
                </div>
              </div>
              {check.verifiedAt && check.status === "verified" && (
                <p className="shrink-0 text-right text-xs text-cream/50">
                  {new Date(check.verifiedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 rounded-lg border border-cream/10 bg-cream/5 px-4 py-3 text-xs text-cream/50">
          VeraEstates verifies each property through a structured checklist. This
          score reflects completed checks only — not a guarantee of future
          performance. Always conduct independent legal due diligence before
          purchase.
        </p>
      </div>
    </section>
  );
}
