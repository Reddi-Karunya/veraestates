import { NextResponse } from "next/server";
import { isValidAnalyticsEvent } from "@/lib/analytics/events";
import { isUuid, readJsonBody } from "@/lib/api/request";
import { trackAnalyticsEvent } from "@/lib/data/cost-breakdown";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const raw = parsed.body as Record<string, unknown>;
  const eventName = typeof raw.event_name === "string" ? raw.event_name : "";
  const propertyId =
    typeof raw.property_id === "string" ? raw.property_id : undefined;
  const sessionId =
    typeof raw.session_id === "string" ? raw.session_id.slice(0, 64) : undefined;
  const metadata =
    raw.metadata && typeof raw.metadata === "object"
      ? (raw.metadata as Record<string, unknown>)
      : {};

  if (!isValidAnalyticsEvent(eventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (propertyId && !isUuid(propertyId)) {
    return NextResponse.json({ error: "Invalid property id" }, { status: 400 });
  }

  await trackAnalyticsEvent({
    eventName,
    propertyId,
    sessionId,
    metadata,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
