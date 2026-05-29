import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trustScoreColorClass } from "@/lib/trust/score";
import { cn } from "@/lib/utils";

type TrustScoreBadgeProps = {
  score: number;
  isVerified?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function TrustScoreBadge({
  score,
  isVerified,
  size = "sm",
  className,
}: TrustScoreBadgeProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn(
          "border-gold/40 bg-navy/90 font-semibold text-cream backdrop-blur-sm",
          size === "md" && "px-3 py-1 text-sm"
        )}
      >
        <span className={trustScoreColorClass(score)}>{score}</span>
        <span className="text-cream/80">/100</span>
      </Badge>
      {(isVerified || score >= 80) && (
        <Badge
          className={cn(
            "gap-1 border-0 bg-gold text-navy",
            size === "md" && "px-3 py-1 text-sm"
          )}
        >
          <ShieldCheck className="size-3.5" />
          Verified
        </Badge>
      )}
    </div>
  );
}
