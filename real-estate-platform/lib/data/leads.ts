import { createClient } from "@/lib/supabase/server";
import type {
  LeadNoteRow,
  LeadRow,
  LeadTimelineRow,
  StaffProfile,
} from "@/types/database";

export type LeadDashboardStats = {
  totalLeads: number;
  hotLeads: number;
  followUpDueToday: number;
  wonLeads: number;
  lostLeads: number;
};

export type LeadWithRelations = LeadRow & {
  properties: { id: string; title: string; slug: string } | null;
  assignee: StaffProfile | null;
  lead_notes: (LeadNoteRow & { author: StaffProfile | null })[];
  lead_timeline: (LeadTimelineRow & { author: StaffProfile | null })[];
};

export type LeadListItem = LeadRow & {
  properties: { title: string; slug: string } | null;
  assignee: Pick<StaffProfile, "id" | "full_name" | "email"> | null;
};

function startOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

export async function getLeadDashboardStats(): Promise<LeadDashboardStats> {
  const supabase = await createClient();
  const todayStart = startOfTodayUtc();
  const todayEnd = endOfTodayUtc();

  const [total, hot, followUp, won, lost] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("qualification_score", 70)
      .not("status", "in", '("won","lost")'),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("follow_up_at", todayStart)
      .lte("follow_up_at", todayEnd)
      .not("status", "in", '("won","lost")'),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "won"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "lost"),
  ]);

  return {
    totalLeads: total.count ?? 0,
    hotLeads: hot.count ?? 0,
    followUpDueToday: followUp.count ?? 0,
    wonLeads: won.count ?? 0,
    lostLeads: lost.count ?? 0,
  };
}

export async function getStaffMembers(): Promise<StaffProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .in("role", ["admin", "staff"])
    .order("full_name");

  return (data ?? []) as StaffProfile[];
}

const LEAD_LIST_SELECT = `
  *,
  properties (title, slug),
  assignee:profiles!assigned_to (id, full_name, email)
`;

export async function getAdminLeads(filters?: {
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}): Promise<LeadListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(LEAD_LIST_SELECT)
    .order("qualification_score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.priority) query = query.eq("priority", filters.priority);
  if (filters?.assignedTo === "unassigned") {
    query = query.is("assigned_to", null);
  } else if (filters?.assignedTo) {
    query = query.eq("assigned_to", filters.assignedTo);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[getAdminLeads]", error);
    return [];
  }

  let leads = (data ?? []) as LeadListItem[];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.phone.includes(term) ||
        (l.email?.toLowerCase().includes(term) ?? false) ||
        (l.properties?.title.toLowerCase().includes(term) ?? false)
    );
  }

  return leads;
}

export async function getLeadById(id: string): Promise<LeadWithRelations | null> {
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      properties (id, title, slug),
      assignee:profiles!assigned_to (id, email, full_name, role)
    `
    )
    .eq("id", id)
    .single();

  if (error || !lead) return null;

  const [notesRes, timelineRes] = await Promise.all([
    supabase
      .from("lead_notes")
      .select("*, author:profiles!created_by (id, email, full_name, role)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_timeline")
      .select("*, author:profiles!created_by (id, email, full_name, role)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    ...(lead as LeadRow),
    properties: (lead as LeadRow & { properties: LeadWithRelations["properties"] })
      .properties,
    assignee: (lead as { assignee: StaffProfile | null }).assignee,
    lead_notes: (notesRes.data ?? []) as LeadWithRelations["lead_notes"],
    lead_timeline: (timelineRes.data ?? []) as LeadWithRelations["lead_timeline"],
  };
}
