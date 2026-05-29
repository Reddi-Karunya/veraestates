"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteMobileNavProps = {
  variant?: "home" | "default";
};

export function SiteMobileNav({ variant = "default" }: SiteMobileNavProps) {
  const [open, setOpen] = useState(false);
  const isHome = variant === "home";

  const linkClass = cn(
    "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gold/10 hover:text-gold",
    isHome ? "text-cream/80" : "text-muted-foreground"
  );

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          isHome ? "text-cream hover:bg-white/10" : "text-navy hover:bg-muted"
        )}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile navigation"
          className={cn(
            "absolute inset-x-0 top-16 border-b px-6 py-4 shadow-lg",
            isHome
              ? "border-white/10 bg-navy/95 backdrop-blur-md"
              : "border-border/60 bg-cream/98 backdrop-blur-md"
          )}
        >
          <ul className="space-y-1">
            <li>
              <Link href="/properties" className={linkClass} onClick={() => setOpen(false)}>
                Properties
              </Link>
            </li>
            <li>
              <Link
                href={isHome ? "#trust" : "/#trust"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Verification
              </Link>
            </li>
            <li>
              <Link
                href={isHome ? "#why-us" : "/#why-us"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Why Us
              </Link>
            </li>
            <li className="pt-2">
              <Button
                size="sm"
                className="w-full bg-gold text-navy hover:bg-gold-light"
                render={
                  <Link
                    href={isHome ? "#contact" : "/properties"}
                    onClick={() => setOpen(false)}
                  />
                }
              >
                Enquire Now
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
