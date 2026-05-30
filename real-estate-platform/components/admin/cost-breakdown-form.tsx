"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type CostBreakdownField = {
  name: keyof Omit<CostBreakdownComputed, "property_id" | "total_cost">;
  label: string;
  hint?: string;
};

const fields: CostBreakdownField[] = [
  { name: "owner_price", label: COST_LINE_LABELS.owner_price, hint: "Verified property price" },
  { name: "registration_cost", label: COST_LINE_LABELS.registration_cost },
  {
    name: "legal_verification_cost",
    label: COST_LINE_LABELS.legal_verification_cost,
  },
  { name: "platform_fee", label: COST_LINE_LABELS.platform_fee },
  { name: "miscellaneous_cost", label: COST_LINE_LABELS.miscellaneous_cost },
];

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
    owner_price: breakdown.owner_price,
    registration_cost: breakdown.registration_cost,
    legal_verification_cost: breakdown.legal_verification_cost,
    platform_fee: breakdown.platform_fee,
    miscellaneous_cost: breakdown.miscellaneous_cost,
  });

  return (
    <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg text-navy">Cost breakdown</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the property price and transparent fees. Total acquisition cost is calculated automatically.
          </p>
        </div>
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
              {field.hint && (
                <p className="text-xs text-muted-foreground">{field.hint}</p>
              )}
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                step={field.name === "owner_price" ? 100000 : 1000}
                defaultValue={
                  breakdown[field.name] != null ? String(breakdown[field.name]) : ""
                }
                required
              />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Cost preview
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Property price</p>
                  <p className="font-display text-lg text-navy">
                    {formatPriceINR(preview.owner_price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total fees</p>
                  <p className="font-display text-lg text-navy">
                    {formatPriceINR(
                      preview.registration_cost +
                      preview.legal_verification_cost +
                      preview.platform_fee +
                      preview.miscellaneous_cost
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total acquisition cost</p>
                  <p className="font-display text-lg text-gold">
                    {formatPriceINR(preview.total_cost)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground border-t border-border/40 pt-3">
              Total acquisition cost is automatically calculated from the property price and itemized fees.
            </p>
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
