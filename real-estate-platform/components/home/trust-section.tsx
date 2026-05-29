import {
  BadgeCheck,
  FileSearch,
  Landmark,
  MapPinned,
  ScanLine,
} from "lucide-react";

const verificationPillars = [
  {
    icon: FileSearch,
    title: "Title Verification",
    description:
      "Legal title chain reviewed by qualified professionals before any listing goes live.",
  },
  {
    icon: Landmark,
    title: "RERA Compliance",
    description:
      "Project registrations and disclosures cross-checked against state RERA databases.",
  },
  {
    icon: MapPinned,
    title: "Site Visit Confirmed",
    description:
      "Our team physically inspects the property, boundaries, and surrounding development.",
  },
  {
    icon: ScanLine,
    title: "AI Document Scan",
    description:
      "Sale deeds and encumbrance certificates analysed for anomalies and risk flags.",
  },
  {
    icon: BadgeCheck,
    title: "Encumbrance Clear",
    description:
      "Outstanding liens and mortgages identified — only clear-title assets are featured.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden bg-navy py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(201,169,98,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Trust & Transparency
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-cream sm:text-5xl">
            Every listing earns its badge
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/60">
            We don&apos;t just aggregate listings — we verify them through a
            rigorous five-step process designed for Indian land and apartment
            buyers.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verificationPillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="group rounded-2xl border border-cream/10 bg-cream/5 p-8 transition-colors hover:border-gold/30 hover:bg-gold/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                  <pillar.icon className="size-5" />
                </div>
                <span className="font-display text-sm text-gold/60">
                  0{index + 1}
                </span>
              </div>
              <h3 className="font-display mt-6 text-xl text-cream">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-t border-cream/10 pt-12">
          {["RERA", "Title Deed", "EC Certificate", "7/12 Extract", "Khata"].map(
            (doc) => (
              <span
                key={doc}
                className="text-xs font-medium uppercase tracking-[0.15em] text-cream/40"
              >
                {doc}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
