import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "home" | "default";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isHome = variant === "home";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        isHome
          ? "border-b border-white/10 bg-navy/80 backdrop-blur-md"
          : "border-b border-border/60 bg-cream/95 backdrop-blur-md"
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-display text-xl tracking-wide",
              isHome ? "text-cream" : "text-navy"
            )}
          >
            Vera<span className="text-gold">Estates</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          <Link
            href="/properties"
            className={cn(
              "text-sm tracking-wide transition-colors hover:text-gold",
              isHome ? "text-cream/70" : "text-muted-foreground"
            )}
          >
            Properties
          </Link>
          <Link
            href={isHome ? "#trust" : "/#trust"}
            className={cn(
              "text-sm tracking-wide transition-colors hover:text-gold",
              isHome ? "text-cream/70" : "text-muted-foreground"
            )}
          >
            Verification
          </Link>
          <Link
            href={isHome ? "#why-us" : "/#why-us"}
            className={cn(
              "text-sm tracking-wide transition-colors hover:text-gold",
              isHome ? "text-cream/70" : "text-muted-foreground"
            )}
          >
            Why Us
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <SiteMobileNav variant={variant} />
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "hidden sm:inline-flex",
              isHome
                ? "border-gold/40 bg-transparent text-cream hover:bg-gold/10 hover:text-gold"
                : "border-navy/20 text-navy hover:border-gold hover:bg-gold/5"
            )}
            render={<Link href="/properties" />}
          >
            Browse Listings
          </Button>
          <Button
            size="sm"
            className="bg-gold text-navy hover:bg-gold-light"
            render={
              <Link href={isHome ? "#contact" : "/properties"} />
            }
          >
            Enquire Now
          </Button>
        </div>
      </div>
    </header>
  );
}
