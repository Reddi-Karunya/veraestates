export const VERIFICATION_CHECK_CODES = [
  "owner_identity",
  "encumbrance_certificate",
  "registration_documents",
  "site_visit",
  "property_images",
  "location",
] as const;

export type VerificationCheckCode = (typeof VERIFICATION_CHECK_CODES)[number];

/** Fallback labels when DB catalog unavailable */
export const verificationCheckLabels: Record<VerificationCheckCode, string> = {
  owner_identity: "Owner Identity Verified",
  encumbrance_certificate: "Encumbrance Certificate Verified",
  registration_documents: "Registration Documents Verified",
  site_visit: "Site Visit Completed",
  property_images: "Property Images Verified",
  location: "Location Verified",
};
