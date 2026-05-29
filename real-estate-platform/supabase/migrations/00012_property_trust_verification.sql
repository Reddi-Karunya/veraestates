-- Property Trust & Verification Center

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS trust_score INT NOT NULL DEFAULT 0
    CHECK (trust_score >= 0 AND trust_score <= 100);

CREATE INDEX IF NOT EXISTS properties_trust_score_idx ON properties (trust_score DESC);

-- Check type catalog (document upload FK-ready for future)
CREATE TABLE verification_check_types (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT,
  supports_document_upload BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO verification_check_types (code, label, description, sort_order, icon) VALUES
  ('owner_identity', 'Owner Identity Verified', 'Seller identity and authority to sell confirmed', 1, 'user-check'),
  ('rera', 'RERA Verified', 'RERA registration and disclosures validated', 2, 'badge-check'),
  ('vmrda', 'VMRDA Verified', 'VMRDA / planning authority compliance checked', 3, 'landmark'),
  ('dtcp', 'DTCP Verified', 'DTCP layout approval verified where applicable', 4, 'file-check'),
  ('encumbrance_certificate', 'Encumbrance Certificate Verified', 'EC reviewed — no outstanding encumbrances', 5, 'shield'),
  ('registration_documents', 'Registration Documents Verified', 'Sale deed and chain of title documents reviewed', 6, 'file-text'),
  ('site_visit', 'Site Visit Completed', 'On-ground inspection completed by our team', 7, 'map-pin'),
  ('property_images', 'Property Images Verified', 'Listing photos match on-site condition', 8, 'image'),
  ('location', 'Location Verified', 'Address, coordinates, and landmarks confirmed', 9, 'map')
ON CONFLICT (code) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

CREATE TABLE property_verification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  check_type TEXT NOT NULL REFERENCES verification_check_types (code) ON DELETE CASCADE,
  status verification_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, check_type)
);

CREATE INDEX property_verification_checks_property_id_idx
  ON property_verification_checks (property_id);

CREATE INDEX property_verification_checks_status_idx
  ON property_verification_checks (status);

CREATE TRIGGER property_verification_checks_updated_at
  BEFORE UPDATE ON property_verification_checks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Trust score calculation
CREATE OR REPLACE FUNCTION calculate_property_trust_score(p_property_id UUID)
RETURNS INT AS $$
DECLARE
  total_checks INT;
  verified_count INT;
BEGIN
  SELECT COUNT(*) INTO total_checks
  FROM property_verification_checks
  WHERE property_id = p_property_id;

  IF total_checks = 0 THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO verified_count
  FROM property_verification_checks
  WHERE property_id = p_property_id AND status = 'verified';

  RETURN ROUND((verified_count::numeric / total_checks::numeric) * 100)::INT;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION refresh_property_trust_score(p_property_id UUID)
RETURNS VOID AS $$
DECLARE
  score INT;
  verified_count INT;
  total_count INT;
BEGIN
  score := calculate_property_trust_score(p_property_id);

  SELECT COUNT(*) FILTER (WHERE status = 'verified'), COUNT(*)
  INTO verified_count, total_count
  FROM property_verification_checks
  WHERE property_id = p_property_id;

  UPDATE properties
  SET
    trust_score = score,
    verification_status = CASE
      WHEN total_count > 0 AND verified_count = total_count THEN 'verified'::verification_status
      WHEN verified_count > 0 THEN 'pending'::verification_status
      ELSE verification_status
    END
  WHERE id = p_property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION on_verification_check_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM refresh_property_trust_score(
    COALESCE(NEW.property_id, OLD.property_id)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER verification_check_trust_score
  AFTER INSERT OR UPDATE OR DELETE ON property_verification_checks
  FOR EACH ROW
  EXECUTE FUNCTION on_verification_check_change();

-- Seed checks for new properties
CREATE OR REPLACE FUNCTION init_property_verification_checks()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO property_verification_checks (property_id, check_type, status)
  SELECT NEW.id, code, 'pending'::verification_status
  FROM verification_check_types
  ON CONFLICT (property_id, check_type) DO NOTHING;

  PERFORM refresh_property_trust_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER property_init_verification_checks
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION init_property_verification_checks();

-- Backfill checks for existing properties
INSERT INTO property_verification_checks (property_id, check_type, status, verified_at, notes)
SELECT p.id, vct.code, 'pending'::verification_status, NULL, NULL
FROM properties p
CROSS JOIN verification_check_types vct
ON CONFLICT (property_id, check_type) DO NOTHING;

-- Migrate legacy property_verifications where codes overlap
UPDATE property_verification_checks pvc
SET
  status = pv.status,
  verified_at = pv.verified_at,
  verified_by = pv.verified_by,
  notes = pv.notes
FROM property_verifications pv
WHERE pvc.property_id = pv.property_id
  AND (
    (pvc.check_type = 'rera' AND pv.verification_type = 'rera_registered')
    OR (pvc.check_type = 'site_visit' AND pv.verification_type = 'site_visit')
    OR (pvc.check_type = 'encumbrance_certificate' AND pv.verification_type = 'encumbrance_checked')
    OR (pvc.check_type = 'registration_documents' AND pv.verification_type = 'title_clear')
  );

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM properties LOOP
    PERFORM refresh_property_trust_score(r.id);
  END LOOP;
END $$;

-- RLS
ALTER TABLE verification_check_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_verification_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read verification check types"
  ON verification_check_types FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read checks for published properties"
  ON property_verification_checks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.is_published = TRUE
        AND p.listing_status IN ('available', 'sold', 'reserved')
    )
  );

CREATE POLICY "Staff full access property_verification_checks"
  ON property_verification_checks FOR ALL
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());
