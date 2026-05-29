import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { readJsonBody } from "@/lib/api/request";
import { properties as mockProperties } from "@/lib/mock-properties";
import { computeQualificationScore } from "@/lib/qualification/score";
import { validateLeadInput } from "@/lib/validations/lead";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json(
      { errors: { form: parsed.error } },
      { status: parsed.status }
    );
  }

  const result = validateLeadInput(parsed.body, {
    requireUuid: isSupabaseConfigured(),
  });
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const { data } = result;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: property } = await supabase
        .from("properties")
        .select("id, price_inr")
        .eq("id", data.propertyId)
        .single();

      if (!property) {
        return NextResponse.json(
          { errors: { property_id: "Property not found" } },
          { status: 404 }
        );
      }

      const qualification = computeQualificationScore({
        budget_range: data.budget_range,
        property_purpose: data.property_purpose,
        purchase_timeline: data.purchase_timeline,
        loan_required: data.loan_required,
        preferred_areas: data.preferred_areas,
        property_price_inr: Number(property.price_inr),
      });

      const { error } = await supabase.from("leads").insert({
        property_id: data.propertyId,
        name: data.name,
        phone: data.phone,
        source: "form",
        budget_range: data.budget_range,
        property_purpose: data.property_purpose,
        purchase_timeline: data.purchase_timeline,
        loan_required: data.loan_required,
        preferred_areas: data.preferred_areas,
        qualification_score: qualification.score,
        metadata: {
          user_agent: request.headers.get("user-agent"),
          qualification_breakdown: qualification.breakdown,
          qualification_tier: qualification.tier,
        },
      });

      if (error) {
        console.error("[leads]", error);
        return NextResponse.json(
          { errors: { form: "Failed to save enquiry" } },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error("[leads]", e);
      return NextResponse.json(
        { errors: { form: "Database unavailable" } },
        { status: 503 }
      );
    }
  } else {
    const property = mockProperties.find((p) => p.id === data.propertyId);
    if (!property) {
      return NextResponse.json(
        { errors: { property_id: "Property not found" } },
        { status: 404 }
      );
    }

    const qualification = computeQualificationScore({
      budget_range: data.budget_range,
      property_purpose: data.property_purpose,
      purchase_timeline: data.purchase_timeline,
      loan_required: data.loan_required,
      preferred_areas: data.preferred_areas,
      property_price_inr: property.priceInr,
    });

    console.info("[lead]", {
      propertyTitle: property.title,
      ...data,
      qualification,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    { success: true, message: "Enquiry received" },
    { status: 201 }
  );
}
