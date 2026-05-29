CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL DEFAULT '',
  property_type property_type NOT NULL,
  price_inr NUMERIC(14, 2) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  locality TEXT NOT NULL,
  location JSONB NOT NULL DEFAULT '{}',
  area_value NUMERIC(12, 2),
  area_unit area_unit DEFAULT 'sqft',
  area_label TEXT,
  approval_type approval_type,
  ownership_status ownership_status,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  google_maps_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  listing_status listing_status NOT NULL DEFAULT 'available',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  specs JSONB NOT NULL DEFAULT '{}',
  whatsapp_number TEXT,
  view_count INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX properties_slug_idx ON properties (slug);
CREATE INDEX properties_city_state_idx ON properties (city, state);
CREATE INDEX properties_listing_status_idx ON properties (listing_status);
CREATE INDEX properties_is_published_idx ON properties (is_published) WHERE is_published = TRUE;
CREATE INDEX properties_published_at_idx ON properties (published_at DESC NULLS LAST);
CREATE INDEX properties_property_type_idx ON properties (property_type);
CREATE INDEX properties_verification_status_idx ON properties (verification_status);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
