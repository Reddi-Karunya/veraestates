/** Whitelisted analytics event names */
export const AnalyticsEvents = {
  VIEWED_COST_BREAKDOWN: "viewed_cost_breakdown",
  WHATSAPP_CLICK: "whatsapp_click",
  LEAD_FORM_SUBMIT: "lead_form_submit",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const ANALYTICS_EVENT_LABELS: Record<AnalyticsEventName, string> = {
  viewed_cost_breakdown: "Viewed Cost Breakdown",
  whatsapp_click: "WhatsApp Click",
  lead_form_submit: "Lead Form Submit",
};

export function isValidAnalyticsEvent(name: string): name is AnalyticsEventName {
  return Object.values(AnalyticsEvents).includes(name as AnalyticsEventName);
}
