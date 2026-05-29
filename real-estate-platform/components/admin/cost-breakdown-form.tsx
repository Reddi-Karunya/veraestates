"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsBadge } from "@/components/property/savings-badge";
import { updateCostBreakdownAction } from "@/app/admin/actions/cost-breakdown";
import { COST_LINE_LABELS } from "@/lib/cost/labels";
import { computeCostBreakdown } from "@/lib/cost/calculate";
import type { CostBreakdownComputed } from "@/lib/cost/types";
import { formatPriceINR } from "@/lib/format-price";

type CostBreakdownFormProps = {
  propertyId: string;
  breakdown: CostBreakdownComputed;
  viewCount?: number;
  propertySlug?: string;
};

const fields = [
  { name: "base_price", label: COST_LINE_LABELS.base_price },
  { name: "registration_cost", label: COST_LINE_LABELS.registration_cost },
  {
    name: "legal_verification_cost",
    label: COST_LINE_LABELS.legal_verification_cost,
  },
  { name: "platform_fee", label: COST_LINE_LABELS.platform_fee },
  { name: "miscellaneous_cost", label: COST_LINE_LABELS.miscellaneous_cost },
  {
    name: "estimated_market_price",
    label: COST_LINE_LABELS.estimated_market_price,
  },
] as const;

export function CostBreakdownForm({
  propertyId,
  breakdown,
  viewCount = 0,
  propertySlug,
}: CostBreakdownFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCostBreakdownAction.bind(null, propertyId),
    {}
  );

  const preview = computeCostBreakdown({
    base_price: breakdown.base_price,
    registration_cost: breakdown.registration_cost,
    legal_verification_cost: breakdown.legal_verification_cost,
    platform_fee: breakdown.platform_fee,
    miscellaneous_cost: breakdown.miscellaneous_cost,
    estimated_market_price: breakdown.estimated_market_price,
  });

  return (
    <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-navy">Cost breakdown</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shown to buyers in the Cost Transparency section on the property page.
          </p>
        </div>
        {preview.has_savings && (
          <SavingsBadge savings={preview.estimated_savings} size="md" />
        )}
      </div>

      {viewCount > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Analytics: &quot;Viewed Cost Breakdown&quot; recorded {viewCount} time
          {viewCount === 1 ? "" : "s"}.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {propertySlug && (
          <input type="hidden" name="property_slug" value={propertySlug} />
        )}
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-emerald-600">Cost breakdown saved.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                step={field.name === "base_price" ? 100000 : 1000}
                defaultValue={
                  breakdown[field.name] != null ? String(breakdown[field.name]) : ""
                }
                required={field.name !== "estimated_market_price"}
              />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Computed preview
          </p>
          <div className="mt-2 flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Total acquisition</p>
              <p className="font-display text-lg text-gold">
                {formatPriceINR(preview.total_cost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Buyer savings</p>
              <p className="font-display text-lg text-emerald-600">
                {formatPriceINR(preview.estimated_savings)}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-gold text-navy hover:bg-gold-light"
          disabled={isPending}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Save cost breakdown
        </Button>
      </form>
    </section>
  );
}
