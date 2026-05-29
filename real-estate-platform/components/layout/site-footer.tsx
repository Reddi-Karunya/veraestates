import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <p className="font-display text-xl text-navy">
              Vera<span className="text-gold">Estates</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Verified apartments, villas, and land across India.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/properties" className="transition-colors hover:text-gold">
              All Properties
            </Link>
            <Link href="/#trust" className="transition-colors hover:text-gold">
              Verification
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-gold">
              Contact
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} VeraEstates. Verified real estate for India.
        </p>
      </div>
    </footer>
  );
}
