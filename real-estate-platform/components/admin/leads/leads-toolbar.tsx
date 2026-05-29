"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  leadPriorityOptions,
  leadStatusOptions,
} from "@/lib/constants/lead-options";
import type { StaffProfile } from "@/types/database";
import { cn } from "@/lib/utils";

type LeadsToolbarProps = {
  staff: StaffProfile[];
};

export function LeadsToolbar({ staff }: LeadsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const assigned = searchParams.get("assigned") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "filter") {
      params.delete("filter");
    }
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`/admin/leads?${params.toString()}`);
    });
  }

  const selectClass =
    "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/20";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 lg:flex-row lg:items-center",
        isPending && "opacity-70"
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name, phone, email, property..."
          className="pl-9"
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("search", (e.target as HTMLInputElement).value);
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== search) update("search", e.target.value);
          }}
        />
      </div>
      <select
        value={status}
        onChange={(e) => update("status", e.target.value)}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {leadStatusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => update("priority", e.target.value)}
        className={selectClass}
      >
        <option value="">All priorities</option>
        {leadPriorityOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={assigned}
        onChange={(e) => update("assigned", e.target.value)}
        className={selectClass}
      >
        <option value="">All assignees</option>
        <option value="unassigned">Unassigned</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.full_name || s.email}
          </option>
        ))}
      </select>
    </div>
  );
}
