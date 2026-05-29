CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties (id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source lead_source NOT NULL DEFAULT 'form',
  status lead_status NOT NULL DEFAULT 'new',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leads_property_id_idx ON leads (property_id);
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX leads_status_idx ON leads (status);
