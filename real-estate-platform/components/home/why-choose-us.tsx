import Image from "next/image";
import { Clock, MessageCircle, Sparkles, Users } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "Curated, Not Crowdsourced",
    description:
      "Every property is selected by our team — no spam listings, no duplicate ads, no bait-and-switch pricing.",
  },
  {
    icon: Users,
    title: "Dedicated Relationship Manager",
    description:
      "One point of contact from first enquiry to site visit scheduling — available on WhatsApp within hours.",
  },
  {
    icon: Clock,
    title: "Faster Due Diligence",
    description:
      "Pre-verified documentation means you spend less time with lawyers and more time making decisions.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-First Experience",
    description:
      "Instant enquiries, visit coordination, and document sharing — the way Indian buyers actually prefer to communicate.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Luxury interior living space"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-xl border border-gold/20 bg-navy p-6 shadow-2xl lg:block">
              <p className="font-display text-4xl text-gold">12+</p>
              <p className="mt-1 text-sm text-cream/70">Years of market expertise</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              The VeraEstates Difference
            </p>
            <h2 className="font-display mt-3 text-4xl tracking-tight text-navy sm:text-5xl">
              Why discerning buyers choose us
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We built VeraEstates for buyers who refuse to compromise — on
              legality, transparency, or the quality of their next home or
              investment plot.
            </p>

            <ul className="mt-12 space-y-8">
              {reasons.map((reason) => (
                <li key={reason.title} className="flex gap-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                    <reason.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-navy">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
