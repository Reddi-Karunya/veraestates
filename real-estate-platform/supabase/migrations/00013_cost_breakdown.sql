-- Transparent cost breakdown & analytics

CREATE TABLE property_cost_breakdowns (
  property_id UUID PRIMARY KEY REFERENCES properties (id) ON DELETE CASCADE,
  base_price NUMERIC(14, 2) NOT NULL,
  registration_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  legal_verification_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(14, 2) NOT NULL DEFAULT 0,
  miscellaneous_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  estimated_market_price NUMERIC(14, 2),
  total_cost NUMERIC(14, 2) GENERATED ALWAYS AS (
    base_price
    + registration_cost
    + legal_verification_cost
    + platform_fee
    + miscellaneous_cost
  ) STORED,
  estimated_savings NUMERIC(14, 2) GENERATED ALWAYS AS (
    CASE
      WHEN estimated_market_price IS NOT NULL
        AND estimated_market_price > (
          base_price
          + registration_cost
          + legal_verification_cost
          + platform_fee
          + miscellaneous_cost
        )
      THEN estimated_market_price - (
        base_price
        + registration_cost
        + legal_verification_cost
        + platform_fee
        + miscellaneous_cost
      )
      ELSE 0
    END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER property_cost_breakdowns_updated_at
  BEFORE UPDATE ON property_cost_breakdowns
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Default breakdown when property is created (estimates from list price)
CREATE OR REPLACE FUNCTION init_property_cost_breakdown()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO property_cost_breakdowns (
    property_id,
    base_price,
    registration_cost,
    legal_verification_cost,
    platform_fee,
    miscellaneous_cost,
    estimated_market_price
  ) VALUES (
    NEW.id,
    NEW.price_inr,
    ROUND(NEW.price_inr * 0.07, 2),
    25000,
    ROUND(NEW.price_inr * 0.01, 2),
    15000,
    ROUND(NEW.price_inr * 1.08, 2)
  )
  ON CONFLICT (property_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER property_init_cost_breakdown
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION init_property_cost_breakdown();

-- Backfill existing properties
INSERT INTO property_cost_breakdowns (
  property_id,
  base_price,
  registration_cost,
  legal_verification_cost,
  platform_fee,
  miscellaneous_cost,
  estimated_market_price
)
SELECT
  id,
  price_inr,
  ROUND(price_inr * 0.07, 2),
  25000,
  ROUND(price_inr * 0.01, 2),
  15000,
  ROUND(price_inr * 1.08, 2)
FROM properties
ON CONFLICT (property_id) DO NOTHING;

-- Reusable analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  property_id UUID REFERENCES properties (id) ON DELETE SET NULL,
  session_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX analytics_events_event_name_idx ON analytics_events (event_name);
CREATE INDEX analytics_events_property_id_idx ON analytics_events (property_id, created_at DESC);
CREATE INDEX analytics_events_created_at_idx ON analytics_events (created_at DESC);

ALTER TABLE property_cost_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read cost breakdown for published properties
CREATE POLICY "Public read cost breakdown"
  ON property_cost_breakdowns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.is_published = TRUE
        AND p.listing_status IN ('available', 'sold', 'reserved')
    )
  );

CREATE POLICY "Staff manage cost breakdown"
  ON property_cost_breakdowns FOR ALL
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());

-- Public can log whitelisted analytics events
CREATE POLICY "Public insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (
    event_name IN (
      'viewed_cost_breakdown',
      'whatsapp_click',
      'lead_form_submit'
    )
  );

CREATE POLICY "Staff read analytics events"
  ON analytics_events FOR SELECT
  USING (is_admin_or_staff());
