import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getDashboardStats } from "@/lib/data/admin";
import { getAdminLeads, getLeadDashboardStats } from "@/lib/data/leads";

export const metadata: Metadata = {
  title: "Dashboard | VeraEstates Admin",
};

export default async function AdminDashboardPage() {
  const [stats, leadStats, recentLeads] = await Promise.all([
    getDashboardStats(),
    getLeadDashboardStats(),
    getAdminLeads(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-navy">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Overview of properties, inquiries, and verification
      </p>
      <div className="mt-8">
        <DashboardOverview
          stats={stats}
          leadStats={leadStats}
          recentLeads={recentLeads.slice(0, 8)}
        />
      </div>
    </div>
  );
}
