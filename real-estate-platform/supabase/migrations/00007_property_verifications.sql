CREATE TABLE property_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL REFERENCES verification_types (code) ON DELETE CASCADE,
  status verification_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, verification_type)
);

CREATE INDEX property_verifications_property_id_idx ON property_verifications (property_id);

CREATE TRIGGER property_verifications_updated_at
  BEFORE UPDATE ON property_verifications
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
