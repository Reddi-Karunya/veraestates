"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addLeadNoteAction } from "@/app/admin/actions/leads";
import type { LeadWithRelations } from "@/lib/data/leads";

type LeadNotesProps = {
  leadId: string;
  notes: LeadWithRelations["lead_notes"];
};

export function LeadNotes({ leadId, notes }: LeadNotesProps) {
  const [state, formAction, isPending] = useActionState(
    addLeadNoteAction.bind(null, leadId),
    {}
  );

  return (
    <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg text-navy">Notes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Internal notes visible only to your team
      </p>

      <form action={formAction} className="mt-6 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="note-body">Add note</Label>
          <Textarea
            id="note-body"
            name="body"
            rows={3}
            placeholder="Called buyer, scheduled site visit for Saturday..."
            required
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button
          type="submit"
          size="sm"
          className="bg-gold text-navy hover:bg-gold-light"
          disabled={isPending}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Save note
        </Button>
      </form>

      {notes.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-border/60 bg-muted/30 p-4"
            >
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {note.body}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {note.author?.full_name ?? note.author?.email ?? "Team"} ·{" "}
                {new Date(note.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">No notes yet.</p>
      )}
    </section>
  );
}
