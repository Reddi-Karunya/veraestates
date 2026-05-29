import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-display mt-2 text-3xl text-navy">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
