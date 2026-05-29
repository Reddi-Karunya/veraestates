import Link from "next/link";
import { CalendarClock, Flame, MessageSquare, ThumbsDown, Trophy } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import type { LeadDashboardStats } from "@/lib/data/leads";

type LeadsDashboardStatsProps = {
  stats: LeadDashboardStats;
};

export function LeadsDashboardStats({ stats }: LeadsDashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total leads"
        value={stats.totalLeads}
        icon={MessageSquare}
      />
      <StatCard
        title="Hot leads"
        value={stats.hotLeads}
        subtitle="Score 70+"
        icon={Flame}
        className="ring-1 ring-red-500/20"
      />
      <Link href="/admin/leads?filter=follow_up_today" className="block">
        <StatCard
          title="Follow-up today"
          value={stats.followUpDueToday}
          icon={CalendarClock}
          className="transition-shadow hover:shadow-md"
        />
      </Link>
      <StatCard
        title="Won"
        value={stats.wonLeads}
        icon={Trophy}
      />
      <StatCard
        title="Lost"
        value={stats.lostLeads}
        icon={ThumbsDown}
      />
    </div>
  );
}
