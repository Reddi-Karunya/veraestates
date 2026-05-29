"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeadNotes } from "@/components/admin/leads/lead-notes";
import { LeadTimeline } from "@/components/admin/leads/lead-timeline";
import {
  QualificationScoreBadge,
  QualificationScoreBar,
} from "@/components/admin/leads/qualification-score-badge";
import { updateLeadAction } from "@/app/admin/actions/leads";
import {
  budgetRangeLabels,
  propertyPurposeLabels,
  purchaseTimelineLabels,
} from "@/lib/qualification/options";
import type { QualificationBreakdown } from "@/lib/qualification/types";
import {
  leadPriorityOptions,
  leadSourceLabels,
  leadStatusOptions,
  priorityBadgeClass,
  statusBadgeClass,
} from "@/lib/constants/lead-options";
import type { LeadWithRelations } from "@/lib/data/leads";
import type { StaffProfile } from "@/types/database";

type LeadDetailClientProps = {
  lead: LeadWithRelations;
  staff: StaffProfile[];
};

const statusLabel = Object.fromEntries(
  leadStatusOptions.map((o) => [o.value, o.label])
);

export function LeadDetailClient({ lead, staff }: LeadDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleUpdate(
    field: "status" | "priority" | "assigned_to" | "follow_up_at",
    value: string
  ) {
    startTransition(async () => {
      await updateLeadAction(lead.id, {
        [field]: value === "" ? null : value,
      } as Parameters<typeof updateLeadAction>[1]);
      router.refresh();
    });
  }

  const followUpLocal = lead.follow_up_at
    ? new Date(lead.follow_up_at).toISOString().slice(0, 16)
    : "";

  const breakdown = lead.metadata?.qualification_breakdown as
    | QualificationBreakdown
    | undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl text-navy">{lead.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Created{" "}
                {new Date(lead.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QualificationScoreBadge
                score={lead.qualification_score}
                size="md"
              />
              <Badge
                variant="outline"
                className={statusBadgeClass[lead.status] ?? ""}
              >
                {statusLabel[lead.status] ?? lead.status}
              </Badge>
              <Badge
                variant="outline"
                className={priorityBadgeClass[lead.priority] ?? ""}
              >
                {lead.priority}
              </Badge>
            </div>
          </div>

          {lead.qualification_score != null && (
            <div className="mt-6">
              <QualificationScoreBar score={lead.qualification_score} />
            </div>
          )}

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-4 text-gold" />
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd>
                  <a href={`tel:${lead.phone}`} className="font-medium text-navy hover:text-gold">
                    {lead.phone}
                  </a>
                </dd>
              </div>
            </div>
            {lead.email && (
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 text-gold" />
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-medium text-navy hover:text-gold"
                    >
                      {lead.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            <div className="flex gap-3 sm:col-span-2">
              <MapPin className="mt-0.5 size-4 text-gold" />
              <div>
                <dt className="text-xs text-muted-foreground">Property interested in</dt>
                <dd className="font-medium text-navy">
                  {lead.properties ? (
                    <Link
                      href={`/properties/${lead.properties.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-gold hover:underline"
                    >
                      {lead.properties.title}
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <User className="mt-0.5 size-4 text-gold" />
              <div>
                <dt className="text-xs text-muted-foreground">Source</dt>
                <dd className="font-medium text-navy">
                  {leadSourceLabels[lead.source] ?? lead.source}
                </dd>
              </div>
            </div>
          </dl>

          {lead.message && (
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Initial message
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {lead.message}
              </p>
            </div>
          )}

          {(lead.budget_range ||
            lead.property_purpose ||
            lead.purchase_timeline ||
            lead.loan_required != null) && (
            <section className="mt-8 rounded-lg border border-border/60 bg-cream/30 p-5">
              <h2 className="font-display text-lg text-navy">
                Buyer qualification
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {lead.budget_range && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Budget</dt>
                    <dd className="text-sm font-medium text-navy">
                      {budgetRangeLabels[lead.budget_range]}
                    </dd>
                  </div>
                )}
                {lead.property_purpose && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Purpose</dt>
                    <dd className="text-sm font-medium text-navy">
                      {propertyPurposeLabels[lead.property_purpose]}
                    </dd>
                  </div>
                )}
                {lead.purchase_timeline && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Timeline</dt>
                    <dd className="text-sm font-medium text-navy">
                      {purchaseTimelineLabels[lead.purchase_timeline]}
                    </dd>
                  </div>
                )}
                {lead.loan_required != null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Loan required</dt>
                    <dd className="text-sm font-medium text-navy">
                      {lead.loan_required ? "Yes" : "No"}
                    </dd>
                  </div>
                )}
                {lead.preferred_areas.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">
                      Preferred areas
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {lead.preferred_areas.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="border-gold/30 text-navy"
                        >
                          {area}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {breakdown && (
                <div className="mt-5 border-t border-border/40 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Score breakdown
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground">Budget match</span>
                      <p className="font-medium text-navy">{breakdown.budget_match}/35</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeline</span>
                      <p className="font-medium text-navy">{breakdown.timeline}/30</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loan status</span>
                      <p className="font-medium text-navy">{breakdown.loan_status}/15</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Intent</span>
                      <p className="font-medium text-navy">{breakdown.intent}/20</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </section>

        <LeadTimeline events={lead.lead_timeline} />
        <LeadNotes leadId={lead.id} notes={lead.lead_notes} />
      </div>

      <aside className="space-y-6">
        <section
          className={`rounded-xl border border-border/60 bg-card p-6 shadow-sm ${isPending ? "opacity-70" : ""}`}
        >
          <h2 className="font-display text-lg text-navy">Manage lead</h2>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={lead.status}
                onChange={(e) => handleUpdate("status", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                disabled={isPending}
              >
                {leadStatusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={lead.priority}
                onChange={(e) => handleUpdate("priority", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                disabled={isPending}
              >
                {leadPriorityOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned to</Label>
              <select
                id="assigned_to"
                value={lead.assigned_to ?? ""}
                onChange={(e) => handleUpdate("assigned_to", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                disabled={isPending}
              >
                <option value="">Unassigned</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name || s.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow_up_at" className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Follow-up date
              </Label>
              <Input
                id="follow_up_at"
                type="datetime-local"
                defaultValue={followUpLocal}
                disabled={isPending}
                onBlur={(e) => {
                  const val = e.target.value;
                  handleUpdate(
                    "follow_up_at",
                    val ? new Date(val).toISOString() : ""
                  );
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              render={
                <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" />
              }
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full"
              render={<a href={`tel:${lead.phone}`} />}
            >
              Call
            </Button>
          </div>
        </section>
      </aside>
    </div>
  );
}
