import type {
  BudgetRange,
  LeadQualificationFormData,
  PropertyPurpose,
  PurchaseTimeline,
} from "@/lib/qualification/types";
import { isUuid } from "@/lib/api/request";

const INDIAN_MOBILE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

const BUDGET_RANGES: BudgetRange[] = [
  "under_50L",
  "50L_1Cr",
  "1Cr_2Cr",
  "2Cr_5Cr",
  "5Cr_plus",
];

const PURPOSES: PropertyPurpose[] = ["self_use", "investment"];

const TIMELINES: PurchaseTimeline[] = [
  "immediate",
  "30_days",
  "3_months",
  "6_plus_months",
];

export type LeadValidationResult =
  | { success: true; data: LeadQualificationFormData }
  | { success: false; errors: Record<string, string> };

export function validateLeadInput(
  body: unknown,
  options?: { requireUuid?: boolean }
): LeadValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== "object") {
    return { success: false, errors: { form: "Invalid request body" } };
  }

  const raw = body as Record<string, unknown>;
  const propertyId =
    typeof raw.property_id === "string" ? raw.property_id.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  const budget_range = raw.budget_range as BudgetRange;
  const property_purpose = raw.property_purpose as PropertyPurpose;
  const purchase_timeline = raw.purchase_timeline as PurchaseTimeline;
  const loan_required = raw.loan_required;
  const preferred_areas = Array.isArray(raw.preferred_areas)
    ? raw.preferred_areas.filter((a): a is string => typeof a === "string")
    : [];

  if (!propertyId) {
    errors.property_id = "Property is required";
  } else if (options?.requireUuid && !isUuid(propertyId)) {
    errors.property_id = "Invalid property";
  }
  if (!name || name.length < 2) errors.name = "Please enter your full name";
  if (!phone || !INDIAN_MOBILE_REGEX.test(phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid Indian mobile number";
  }
  if (!BUDGET_RANGES.includes(budget_range)) {
    errors.budget_range = "Select a budget range";
  }
  if (!PURPOSES.includes(property_purpose)) {
    errors.property_purpose = "Select property purpose";
  }
  if (!TIMELINES.includes(purchase_timeline)) {
    errors.purchase_timeline = "Select a purchase timeline";
  }
  if (typeof loan_required !== "boolean") {
    errors.loan_required = "Indicate if you need a loan";
  }
  if (preferred_areas.length === 0) {
    errors.preferred_areas = "Select at least one preferred area";
  }
  if (preferred_areas.length > 10) {
    errors.preferred_areas = "Select up to 10 preferred areas";
  }
  if (preferred_areas.some((a) => a.length > 120)) {
    errors.preferred_areas = "Preferred area value is too long";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      propertyId,
      name,
      phone,
      budget_range,
      property_purpose,
      purchase_timeline,
      loan_required: loan_required as boolean,
      preferred_areas,
    },
  };
}
