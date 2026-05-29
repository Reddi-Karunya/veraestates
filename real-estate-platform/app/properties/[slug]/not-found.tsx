import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
        Not found
      </p>
      <h1 className="font-display mt-3 text-4xl text-navy">Property unavailable</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        This listing may have been sold or removed. Browse our verified properties
        to find your next home or investment.
      </p>
      <Button
        className="mt-8 bg-gold text-navy hover:bg-gold-light"
        render={<Link href="/properties" />}
      >
        View all properties
      </Button>
    </div>
  );
}
