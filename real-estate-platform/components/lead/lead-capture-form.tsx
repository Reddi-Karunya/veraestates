"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { trackAnalyticsClient } from "@/lib/analytics/track-client";
import { getPreferredAreaOptions } from "@/lib/qualification/areas";
import {
  budgetRangeOptions,
  propertyPurposeOptions,
  purchaseTimelineOptions,
} from "@/lib/qualification/options";
import type {
  BudgetRange,
  PropertyPurpose,
  PurchaseTimeline,
} from "@/lib/qualification/types";
import { cn } from "@/lib/utils";

type LeadCaptureFormProps = {
  propertyId: string;
  propertyTitle: string;
  propertyCity?: string;
  propertyLocality?: string;
};

const STEPS = [
  "Contact",
  "Budget",
  "Purpose",
  "Timeline",
  "Loan",
  "Areas",
] as const;

type FormState = {
  name: string;
  phone: string;
  budget_range: BudgetRange | "";
  property_purpose: PropertyPurpose | "";
  purchase_timeline: PurchaseTimeline | "";
  loan_required: boolean | null;
  preferred_areas: string[];
};

function OptionCard({
  selected,
  onClick,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
        selected
          ? "border-gold bg-gold/10 ring-1 ring-gold/40"
          : "border-border/60 bg-background hover:border-gold/40"
      )}
    >
      <span className="font-medium text-navy">{label}</span>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
    </button>
  );
}

export function LeadCaptureForm({
  propertyId,
  propertyTitle,
  propertyCity,
  propertyLocality,
}: LeadCaptureFormProps) {
  const areaOptions = getPreferredAreaOptions();
  const defaultArea =
    propertyLocality && propertyCity
      ? `${propertyLocality}, ${propertyCity}`
      : null;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    budget_range: "",
    property_purpose: "",
    purchase_timeline: "",
    loan_required: null,
    preferred_areas: defaultArea ? [defaultArea] : [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function validateStep(current: number): boolean {
    const nextErrors: Record<string, string> = {};

    if (current === 0) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        nextErrors.name = "Enter your full name";
      }
      if (!/^(\+91[\-\s]?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
        nextErrors.phone = "Enter a valid Indian mobile number";
      }
    }
    if (current === 1 && !form.budget_range) {
      nextErrors.budget_range = "Select your budget range";
    }
    if (current === 2 && !form.property_purpose) {
      nextErrors.property_purpose = "Select property purpose";
    }
    if (current === 3 && !form.purchase_timeline) {
      nextErrors.purchase_timeline = "Select a timeline";
    }
    if (current === 4 && form.loan_required === null) {
      nextErrors.loan_required = "Please select an option";
    }
    if (current === 5 && form.preferred_areas.length === 0) {
      nextErrors.preferred_areas = "Select at least one area";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleArea(area: string) {
    setForm((prev) => ({
      ...prev,
      preferred_areas: prev.preferred_areas.includes(area)
        ? prev.preferred_areas.filter((a) => a !== area)
        : [...prev.preferred_areas, area],
    }));
  }

  async function handleSubmit() {
    if (!validateStep(5)) return;

    setStatus("loading");
    setErrors({});

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          name: form.name.trim(),
          phone: form.phone.trim(),
          budget_range: form.budget_range,
          property_purpose: form.property_purpose,
          purchase_timeline: form.purchase_timeline,
          loan_required: form.loan_required,
          preferred_areas: form.preferred_areas,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: "Something went wrong. Please try again." });
        setStatus("error");
        return;
      }

      trackAnalyticsClient(AnalyticsEvents.LEAD_FORM_SUBMIT, {
        propertyId,
        metadata: { property_title: propertyTitle },
      });

      setStatus("success");
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="size-6" />
        </div>
        <p className="font-display mt-4 text-lg text-navy">Thank you!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve received your enquiry for {propertyTitle}. Our team will
          contact you within 2 hours with options matched to your preferences.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            setStatus("idle");
            setStep(0);
            setForm({
              name: "",
              phone: "",
              budget_range: "",
              property_purpose: "",
              purchase_timeline: "",
              loan_required: null,
              preferred_areas: defaultArea ? [defaultArea] : [],
            });
          }}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-live="polite">
      <div role="group" aria-label={`Step ${step + 1}: ${STEPS[step]}`}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="mt-2 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={STEPS[i]}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-gold" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Full name</Label>
            <Input
              id="lead-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Mobile number</Label>
            <Input
              id="lead-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            What is your budget for this purchase?
          </p>
          {budgetRangeOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={form.budget_range === opt.value}
              onClick={() => setForm({ ...form, budget_range: opt.value })}
              label={opt.label}
            />
          ))}
          {errors.budget_range && (
            <p className="text-xs text-destructive">{errors.budget_range}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            What is the purpose of this property?
          </p>
          {propertyPurposeOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={form.property_purpose === opt.value}
              onClick={() =>
                setForm({ ...form, property_purpose: opt.value })
              }
              label={opt.label}
              description={opt.description}
            />
          ))}
          {errors.property_purpose && (
            <p className="text-xs text-destructive">{errors.property_purpose}</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            When are you planning to buy?
          </p>
          {purchaseTimelineOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={form.purchase_timeline === opt.value}
              onClick={() =>
                setForm({ ...form, purchase_timeline: opt.value })
              }
              label={opt.label}
            />
          ))}
          {errors.purchase_timeline && (
            <p className="text-xs text-destructive">
              {errors.purchase_timeline}
            </p>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Do you require a home loan?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard
              selected={form.loan_required === true}
              onClick={() => setForm({ ...form, loan_required: true })}
              label="Yes"
              description="Need financing"
            />
            <OptionCard
              selected={form.loan_required === false}
              onClick={() => setForm({ ...form, loan_required: false })}
              label="No"
              description="Cash / pre-approved"
            />
          </div>
          {errors.loan_required && (
            <p className="text-xs text-destructive">{errors.loan_required}</p>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Select your preferred areas (choose one or more)
          </p>
          <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto">
            {areaOptions.map((area) => {
              const selected = form.preferred_areas.includes(area.value);
              return (
                <button
                  key={area.value}
                  type="button"
                  onClick={() => toggleArea(area.value)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-gold bg-gold/15 text-navy"
                      : "border-border/60 text-muted-foreground hover:border-gold/40"
                  )}
                >
                  <MapPin className="size-3" />
                  {area.label}
                </button>
              );
            })}
          </div>
          {errors.preferred_areas && (
            <p className="text-xs text-destructive">{errors.preferred_areas}</p>
          )}
        </div>
      )}

      {errors.form && (
        <p className="text-sm text-destructive">{errors.form}</p>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={goBack}>
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            className="flex-1 bg-gold text-navy hover:bg-gold-light"
            onClick={goNext}
          >
            Continue
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1 bg-gold text-navy hover:bg-gold-light"
            disabled={status === "loading"}
            onClick={handleSubmit}
          >
            {status === "loading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send data-icon="inline-start" />
            )}
            Submit enquiry
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        No account required · We respond within 2 hours
      </p>
    </div>
  );
}
