import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPriceINR } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type SavingsBadgeProps = {
  savings: number;
  className?: string;
  size?: "sm" | "md";
};

export function SavingsBadge({ savings, className, size = "sm" }: SavingsBadgeProps) {
  if (savings <= 0) return null;

  return (
    <Badge
      className={cn(
        "gap-1 border-0 bg-emerald-600 text-white hover:bg-emerald-600",
        size === "md" && "px-3 py-1 text-sm",
        className
      )}
    >
      <TrendingDown className="size-3.5" />
      Save {formatPriceINR(savings)}
    </Badge>
  );
}
