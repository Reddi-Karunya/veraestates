export type UserRole = "admin" | "staff";
export type PropertyType = "apartment" | "land" | "villa" | "commercial";
export type ListingStatus = "available" | "sold" | "reserved";
export type VerificationStatus = "pending" | "verified" | "rejected" | "expired";
export type ApprovalType =
  | "rera"
  | "dtcp"
  | "panchayat"
  | "municipal"
  | "hmda"
  | "other";
export type OwnershipStatus =
  | "freehold"
  | "leasehold"
  | "cooperative"
  | "power_of_attorney"
  | "other";
export type AreaUnit = "sqft" | "sqyd" | "acres" | "sqm";
export type LeadSource = "form" | "whatsapp_click";
export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "negotiating"
  | "won"
  | "lost"
  | "closed";
export type LeadPriority = "hot" | "warm" | "cold";
export type LeadBudgetRange =
  | "under_50L"
  | "50L_1Cr"
  | "1Cr_2Cr"
  | "2Cr_5Cr"
  | "5Cr_plus";
export type LeadPropertyPurpose = "self_use" | "investment";
export type LeadPurchaseTimeline =
  | "immediate"
  | "30_days"
  | "3_months"
  | "6_plus_months";
export type LeadTimelineEvent =
  | "inquiry_submitted"
  | "contacted"
  | "site_visit"
  | "negotiation"
  | "closed_won"
  | "closed_lost"
  | "note_added"
  | "assigned"
  | "follow_up_set";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type VerificationCheckTypeRow = {
  code: string;
  label: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
  supports_document_upload: boolean;
};

export type VerificationCheckRow = {
  id: string;
  property_id: string;
  check_type: string;
  status: VerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string;
  property_type: PropertyType;
  price_inr: number;
  city: string;
  state: string;
  locality: string;
  location: Record<string, unknown>;
  area_value: number | null;
  area_unit: AreaUnit | null;
  area_label: string | null;
  approval_type: ApprovalType | null;
  ownership_status: OwnershipStatus | null;
  amenities: string[];
  google_maps_url: string | null;
  verification_status: VerificationStatus;
  trust_score: number;
  listing_status: ListingStatus;
  is_published: boolean;
  is_featured: boolean;
  specs: Record<string, unknown>;
  whatsapp_number: string | null;
  view_count: number;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyImageRow = {
  id: string;
  property_id: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
};

export type PropertyVerificationRow = {
  id: string;
  property_id: string;
  verification_type: string;
  status: VerificationStatus;
  notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  property_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to: string | null;
  follow_up_at: string | null;
  budget_range: LeadBudgetRange | null;
  property_purpose: LeadPropertyPurpose | null;
  purchase_timeline: LeadPurchaseTimeline | null;
  loan_required: boolean | null;
  preferred_areas: string[];
  qualification_score: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type LeadNoteRow = {
  id: string;
  lead_id: string;
  body: string;
  created_by: string | null;
  created_at: string;
};

export type LeadTimelineRow = {
  id: string;
  lead_id: string;
  event_type: LeadTimelineEvent;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
};

export type StaffProfile = Pick<Profile, "id" | "email" | "full_name" | "role">;

export type VerificationTypeRow = {
  code: string;
  label: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
};

export type PropertyWithImages = PropertyRow & {
  property_images: PropertyImageRow[];
};

export type PropertyCostBreakdownRow = {
  property_id: string;
  base_price: number;
  registration_cost: number;
  legal_verification_cost: number;
  platform_fee: number;
  miscellaneous_cost: number;
  estimated_market_price: number | null;
  total_cost: number;
  estimated_savings: number;
  created_at: string;
  updated_at: string;
};

export type AnalyticsEventRow = {
  id: string;
  event_name: string;
  property_id: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
