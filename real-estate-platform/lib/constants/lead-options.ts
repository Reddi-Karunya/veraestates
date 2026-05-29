import type { LeadPriority, LeadStatus } from "@/types/database";

export const leadStatusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "site_visit_scheduled", label: "Site Visit Scheduled" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const leadPriorityOptions: { value: LeadPriority; label: string }[] = [
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

export const leadSourceLabels: Record<string, string> = {
  form: "Website Form",
  whatsapp_click: "WhatsApp",
};

export const timelineEventLabels: Record<string, string> = {
  inquiry_submitted: "Inquiry Submitted",
  contacted: "Contacted",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  closed_won: "Closed — Won",
  closed_lost: "Closed — Lost",
  note_added: "Note Added",
  assigned: "Assigned",
  follow_up_set: "Follow-up Set",
};

export const priorityBadgeClass: Record<LeadPriority, string> = {
  hot: "border-red-500/40 bg-red-50 text-red-800",
  warm: "border-amber-500/40 bg-amber-50 text-amber-800",
  cold: "border-slate-400/40 bg-slate-50 text-slate-700",
};

export const statusBadgeClass: Record<string, string> = {
  new: "border-blue-500/40 bg-blue-50 text-blue-800",
  contacted: "border-violet-500/40 bg-violet-50 text-violet-800",
  site_visit_scheduled: "border-cyan-500/40 bg-cyan-50 text-cyan-800",
  negotiating: "border-amber-500/40 bg-amber-50 text-amber-800",
  won: "border-emerald-500/40 bg-emerald-50 text-emerald-800",
  lost: "border-red-500/40 bg-red-50 text-red-800",
};
