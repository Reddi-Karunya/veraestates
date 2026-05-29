import { Flame, Snowflake, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getQualificationTier } from "@/lib/qualification/score";
import type { QualificationTier } from "@/lib/qualification/types";
import { cn } from "@/lib/utils";

type QualificationScoreBadgeProps = {
  score: number | null;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const tierConfig: Record<
  QualificationTier,
  { label: string; icon: typeof Flame; className: string }
> = {
  hot: {
    label: "Hot",
    icon: Flame,
    className: "border-red-500/40 bg-red-50 text-red-800",
  },
  warm: {
    label: "Warm",
    icon: Sun,
    className: "border-amber-500/40 bg-amber-50 text-amber-800",
  },
  cold: {
    label: "Cold",
    icon: Snowflake,
    className: "border-slate-400/40 bg-slate-50 text-slate-700",
  },
};

export function QualificationScoreBadge({
  score,
  showLabel = true,
  size = "sm",
  className,
}: QualificationScoreBadgeProps) {
  if (score == null) {
    return (
      <Badge variant="outline" className={cn("text-muted-foreground", className)}>
        Unscored
      </Badge>
    );
  }

  const tier = getQualificationTier(score);
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        config.className,
        size === "md" && "px-3 py-1 text-sm",
        className
      )}
    >
      <Icon className="size-3.5" />
      {score}
      {showLabel && <span className="opacity-80">· {config.label}</span>}
    </Badge>
  );
}

export function QualificationScoreBar({ score }: { score: number }) {
  const tier = getQualificationTier(score);
  const color =
    tier === "hot"
      ? "bg-red-500"
      : tier === "warm"
        ? "bg-amber-500"
        : "bg-slate-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Qualification score</span>
        <span className="font-medium text-navy">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
