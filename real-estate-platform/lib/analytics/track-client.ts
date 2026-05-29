"use client";

import { type AnalyticsEventName } from "@/lib/analytics/events";

const viewedProperties = new Set<string>();

function getSessionId(): string {
  const key = "ve_session_id";
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackAnalyticsClient(
  eventName: AnalyticsEventName,
  options?: {
    propertyId?: string;
    metadata?: Record<string, unknown>;
    oncePerSession?: boolean;
  }
): Promise<void> {
  const { propertyId, metadata, oncePerSession } = options ?? {};

  if (oncePerSession && propertyId) {
    const dedupeKey = `${eventName}:${propertyId}`;
    if (viewedProperties.has(dedupeKey)) return;
    viewedProperties.add(dedupeKey);
  }

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        property_id: propertyId,
        session_id: getSessionId(),
        metadata,
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}
