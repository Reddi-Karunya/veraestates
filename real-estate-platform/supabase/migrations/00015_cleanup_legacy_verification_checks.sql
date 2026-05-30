-- Remove legacy approval verification checks from the trust checklist.
-- These codes are no longer part of the buyer-facing verification checklist.

DELETE FROM property_verification_checks
WHERE check_type IN ('rera', 'vmrda', 'dtcp');

DELETE FROM verification_check_types
WHERE code IN ('rera', 'vmrda', 'dtcp');

DO $$
DECLARE
  property_row RECORD;
BEGIN
  FOR property_row IN SELECT id FROM properties LOOP
    PERFORM refresh_property_trust_score(property_row.id);
  END LOOP;
END $$;