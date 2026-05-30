"use client";

import { useEffect, useRef } from "react";
import { Calculator, Check } from "lucide-react";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackAnalyticsClient } from "@/lib/analytics/track-client";
import { buildCostLineItems, COST_LINE_LABELS } from "@/lib/cost/labels";
import type { CostBreakdownComputed } from "@/lib/cost/types";
import { formatPriceINR } from "@/lib/format-price";

type CostTransparencySectionProps = {
  propertyId: string;
  propertyTitle: string;
  breakdown: CostBreakdownComputed;
};

export function CostTransparencySection({
  propertyId,
  propertyTitle,
  breakdown,
}: CostTransparencySectionProps) {
  const tracked = useRef(false);
  const lineItems = buildCostLineItems(breakdown);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackAnalyticsClient(AnalyticsEvents.VIEWED_COST_BREAKDOWN, {
      propertyId,
      oncePerSession: true,
      metadata: {
        property_title: propertyTitle,
        total_cost: breakdown.total_cost,
      },
    });
  }, [propertyId, propertyTitle, breakdown.total_cost]);

  return (
    <section
      id="cost-transparency"
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="border-b border-border/60 bg-cream/50 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Calculator className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                Direct Deal Advantage
              </p>
              <h2 className="font-display text-2xl text-navy">
                Verified direct seller pricing
              </h2>
            </div>
          </div>
            </div>
        <p className="mt-3 text-sm text-muted-foreground">
          VeraEstates focuses on verified properties, transparent pricing, and direct access to sellers. Buyers can review approvals, documentation status, and total acquisition costs before making an enquiry.
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Owner Verified",
            "Direct Seller Access",
            "Transparent Pricing",
            "Verified Documentation",
            "Approval Authority Displayed",
            "No Hidden Charges",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-navy/5 p-4">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <p className="text-sm font-medium text-navy">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Buyers can review approvals, documentation status, and total acquisition costs before making an enquiry.
        </p>

        <dl className="mt-8 space-y-3">
          {lineItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 border-b border-border/40 pb-3 last:border-0"
            >
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium text-navy">
                {formatPriceINR(item.amount)}
              </dd>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 rounded-lg bg-navy/5 px-4 py-3">
            <dt className="font-medium text-navy">
              {COST_LINE_LABELS.total_cost}
            </dt>
            <dd className="font-display text-xl text-gold">
              {formatPriceINR(breakdown.total_cost)}
            </dd>
          </div>

        </dl>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Estimates are indicative and based on current stamp duty, legal, and
          platform fees for this listing. Final amounts may vary by state and
          transaction specifics. Document-backed breakdowns available on request.
        </p>
      </div>
    </section>
  );
}
