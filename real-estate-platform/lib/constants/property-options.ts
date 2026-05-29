import type {
  ApprovalType,
  ListingStatus,
  OwnershipStatus,
  PropertyType,
  VerificationStatus,
} from "@/types/database";

export const propertyTypeOptions: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial" },
];

export const listingStatusOptions: { value: ListingStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "reserved", label: "Reserved" },
];

export const verificationStatusOptions: {
  value: VerificationStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export const approvalTypeOptions: { value: ApprovalType; label: string }[] = [
  { value: "rera", label: "RERA" },
  { value: "dtcp", label: "DTCP" },
  { value: "hmda", label: "HMDA" },
  { value: "municipal", label: "Municipal" },
  { value: "panchayat", label: "Panchayat" },
  { value: "other", label: "Other" },
];

export const ownershipStatusOptions: {
  value: OwnershipStatus;
  label: string;
}[] = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
  { value: "cooperative", label: "Cooperative" },
  { value: "power_of_attorney", label: "Power of Attorney" },
  { value: "other", label: "Other" },
];

export const areaUnitOptions = [
  { value: "sqft", label: "Sq ft" },
  { value: "sqyd", label: "Sq yd" },
  { value: "acres", label: "Acres" },
  { value: "sqm", label: "Sq m" },
] as const;

export const bhkOptions: number[] = [2, 3, 4, 5];

export const priceRangeOptions = [
  { label: "Any price", min: undefined as number | undefined, max: undefined as number | undefined },
  { label: "Under ₹50 L", min: undefined, max: 50_00_000 },
  { label: "₹50 L – ₹1 Cr", min: 50_00_000, max: 1_00_00_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 1_00_00_000, max: 2_00_00_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 2_00_00_000, max: 5_00_00_000 },
  { label: "Above ₹5 Cr", min: 5_00_00_000, max: undefined },
];

export const commonAmenities = [
  "Lift",
  "Power backup",
  "Parking",
  "Swimming pool",
  "Gym",
  "Clubhouse",
  "Security",
  "Garden",
  "Kids play area",
  "Visitor parking",
];
