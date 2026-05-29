import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="contact" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 sm:px-16 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.2),transparent_60%)]" />
          <div className="absolute -right-20 -top-20 size-64 rounded-full border border-gold/10" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full border border-gold/10" />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Start Your Journey
            </p>
            <h2 className="font-display mt-4 text-4xl tracking-tight text-cream sm:text-5xl">
              Ready to find your verified property?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/60">
              Browse our curated listings or speak with our team on WhatsApp —
              we respond within two hours, seven days a week.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 w-full bg-gold px-8 text-base text-navy hover:bg-gold-light sm:w-auto"
                render={<Link href="/properties" />}
              >
                Browse Properties
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full border-cream/20 bg-transparent px-8 text-base text-cream hover:border-gold/50 hover:bg-gold/5 hover:text-gold sm:w-auto"
                render={
                  <a
                    href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20verified%20properties%20on%20VeraEstates."
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle data-icon="inline-start" />
                Chat on WhatsApp
              </Button>
            </div>

            <p className="mt-8 text-sm text-cream/40">
              No account required · Free consultation · Serving Hyderabad,
              Mumbai, Bengaluru &amp; more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
