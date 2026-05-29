import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@/lib/data/admin";
import type { LeadDashboardStats } from "@/lib/data/leads";
import type { LeadListItem } from "@/lib/data/leads";
import { LeadsDashboardStats } from "@/components/admin/leads/leads-dashboard-stats";
import { QualificationScoreBadge } from "@/components/admin/leads/qualification-score-badge";
import {
  leadStatusOptions,
  statusBadgeClass,
} from "@/lib/constants/lead-options";

const statusLabel = Object.fromEntries(
  leadStatusOptions.map((o) => [o.value, o.label])
);

type DashboardOverviewProps = {
  stats: DashboardStats;
  leadStats: LeadDashboardStats;
  recentLeads: LeadListItem[];
};

export function DashboardOverview({
  stats,
  leadStats,
  recentLeads,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl text-navy">Leads overview</h2>
        <div className="mt-4">
          <LeadsDashboardStats stats={leadStats} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total properties"
          value={stats.totalProperties}
          subtitle={`${stats.publishedCount} published`}
          icon={Building2}
        />
        <StatCard
          title="Total inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
        />
        <StatCard
          title="Available"
          value={stats.listingCounts.available ?? 0}
          icon={CheckCircle2}
        />
        <StatCard
          title="Sold / Reserved"
          value={
            (stats.listingCounts.sold ?? 0) + (stats.listingCounts.reserved ?? 0)
          }
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg text-navy">Verification status</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {(
              [
                ["verified", "Verified", CheckCircle2, "text-emerald-600"],
                ["pending", "Pending", Clock, "text-amber-600"],
                ["rejected", "Rejected", XCircle, "text-destructive"],
                ["expired", "Expired", Clock, "text-muted-foreground"],
              ] as const
            ).map(([key, label, Icon, color]) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-4"
              >
                <Icon className={`size-5 ${color}`} />
                <div>
                  <p className="text-2xl font-semibold text-navy">
                    {stats.verificationCounts[key] ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-navy">Recent inquiries</h2>
            <Link
              href="/admin/leads"
              className="text-xs text-gold hover:underline"
            >
              View all leads
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No inquiries yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-navy hover:text-gold"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    {lead.properties && (
                      <p className="mt-1 truncate text-xs text-gold">
                        {lead.properties.title}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <QualificationScoreBadge
                      score={lead.qualification_score}
                      showLabel={false}
                    />
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${statusBadgeClass[lead.status] ?? ""}`}
                    >
                      {statusLabel[lead.status] ?? lead.status}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
