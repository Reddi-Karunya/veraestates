import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadsDashboardStats } from "@/components/admin/leads/leads-dashboard-stats";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import { LeadsToolbar } from "@/components/admin/leads/leads-toolbar";
import {
  getAdminLeads,
  getLeadDashboardStats,
  getStaffMembers,
} from "@/lib/data/leads";

export const metadata: Metadata = {
  title: "Leads | VeraEstates Admin",
};

type LeadsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    assigned?: string;
    filter?: string;
  }>;
};

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;

  const [stats, staff, allLeads] = await Promise.all([
    getLeadDashboardStats(),
    getStaffMembers(),
    getAdminLeads({
      search: params.search,
      status: params.status,
      priority: params.priority,
      assignedTo: params.assigned,
    }),
  ]);

  let leads = allLeads;

  if (params.filter === "follow_up_today") {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    leads = allLeads.filter((l) => {
      if (!l.follow_up_at) return false;
      const d = new Date(l.follow_up_at);
      return d >= start && d <= end && !["won", "lost"].includes(l.status);
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy">Lead management</h1>
        <p className="mt-1 text-muted-foreground">
          Track inquiries, assign staff, and close deals
        </p>
      </div>

      <LeadsDashboardStats stats={stats} />

      <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-muted" />}>
        <LeadsToolbar staff={staff} />
      </Suspense>

      {params.filter === "follow_up_today" && (
        <p className="text-sm text-gold">
          Showing leads with follow-up scheduled for today
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        {leads.length} {leads.length === 1 ? "lead" : "leads"}
      </p>

      <LeadsTable leads={leads} />
    </div>
  );
}
