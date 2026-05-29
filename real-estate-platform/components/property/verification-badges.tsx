import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type VerificationBadgesProps = {
  badges: string[];
};

export function VerificationBadges({ badges }: VerificationBadgesProps) {
  if (badges.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
        Verified
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge
            key={badge}
            variant="outline"
            className="gap-1.5 border-gold/40 bg-gold/10 px-3 py-1 text-sm text-navy"
          >
            <ShieldCheck className="size-3.5 text-gold" />
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  );
}
