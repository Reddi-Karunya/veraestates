import {
  Calendar,
  CheckCircle2,
  FileText,
  Handshake,
  MapPinned,
  MessageSquare,
  UserPlus,
  XCircle,
} from "lucide-react";
import { timelineEventLabels } from "@/lib/constants/lead-options";
import type { LeadWithRelations } from "@/lib/data/leads";
import type { LeadTimelineEvent } from "@/types/database";
import { cn } from "@/lib/utils";

const eventIcons: Record<LeadTimelineEvent, typeof MessageSquare> = {
  inquiry_submitted: MessageSquare,
  contacted: CheckCircle2,
  site_visit: MapPinned,
  negotiation: Handshake,
  closed_won: CheckCircle2,
  closed_lost: XCircle,
  note_added: FileText,
  assigned: UserPlus,
  follow_up_set: Calendar,
};

const pipelineOrder: LeadTimelineEvent[] = [
  "inquiry_submitted",
  "contacted",
  "site_visit",
  "negotiation",
  "closed_won",
];

type LeadTimelineProps = {
  events: LeadWithRelations["lead_timeline"];
};

export function LeadTimeline({ events }: LeadTimelineProps) {
  const completedTypes = new Set(events.map((e) => e.event_type));

  return (
    <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg text-navy">Lead timeline</h2>

      <div className="mt-6 flex flex-wrap gap-2">
        {pipelineOrder.map((type) => {
          const done =
            completedTypes.has(type) ||
            (type === "closed_won" && completedTypes.has("closed_lost"));
          const Icon = eventIcons[type];
          return (
            <div
              key={type}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                done
                  ? "border-gold/50 bg-gold/10 text-navy"
                  : "border-border text-muted-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {timelineEventLabels[type]}
            </div>
          );
        })}
      </div>

      {events.length > 0 ? (
        <ol className="relative mt-8 space-y-0 border-l border-border pl-6">
          {events.map((event) => {
            const Icon = eventIcons[event.event_type] ?? MessageSquare;
            return (
              <li key={event.id} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[1.85rem] flex size-7 items-center justify-center rounded-full border border-gold/40 bg-cream text-gold">
                  <Icon className="size-3.5" />
                </span>
                <p className="font-medium text-navy">{event.title}</p>
                {event.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {event.author?.full_name ?? event.author?.email ?? "System"} ·{" "}
                  {new Date(event.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Timeline events will appear as the lead progresses.
        </p>
      )}
    </section>
  );
}
