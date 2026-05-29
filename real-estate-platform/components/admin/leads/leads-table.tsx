import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QualificationScoreBadge } from "@/components/admin/leads/qualification-score-badge";
import {
  leadSourceLabels,
  leadStatusOptions,
  priorityBadgeClass,
  statusBadgeClass,
} from "@/lib/constants/lead-options";
import type { LeadListItem } from "@/lib/data/leads";

type LeadsTableProps = {
  leads: LeadListItem[];
};

const statusLabel = Object.fromEntries(
  leadStatusOptions.map((o) => [o.value, o.label])
);

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        No leads match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Qualification</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className={cn(
                "group",
                lead.qualification_score != null &&
                  lead.qualification_score >= 70 &&
                  "bg-red-50/30"
              )}
            >
              <TableCell>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-medium text-navy hover:text-gold"
                >
                  {lead.name}
                </Link>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </TableCell>
              <TableCell>
                <QualificationScoreBadge score={lead.qualification_score} />
              </TableCell>
              <TableCell>
                {lead.properties ? (
                  <Link
                    href={`/properties/${lead.properties.slug}`}
                    target="_blank"
                    className="text-sm text-gold hover:underline"
                  >
                    {lead.properties.title}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm capitalize">
                {leadSourceLabels[lead.source] ?? lead.source}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusBadgeClass[lead.status] ?? ""}
                >
                  {statusLabel[lead.status] ?? lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={priorityBadgeClass[lead.priority] ?? ""}
                >
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {lead.assignee?.full_name ?? lead.assignee?.email ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
