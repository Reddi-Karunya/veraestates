-- Redesign cost transparency: Direct Owner Pricing & Buyer Savings

-- Add new columns to property_cost_breakdowns
ALTER TABLE property_cost_breakdowns
  ADD COLUMN IF NOT EXISTS owner_price NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS market_price NUMERIC(14, 2);

-- Migrate existing data: base_price -> owner_price, estimated_market_price -> market_price
UPDATE property_cost_breakdowns
SET 
  owner_price = COALESCE(owner_price, base_price),
  market_price = COALESCE(market_price, estimated_market_price)
WHERE owner_price IS NULL OR market_price IS NULL;

-- Drop the old computed_savings column if it exists (to recreate with new logic)
ALTER TABLE property_cost_breakdowns
  DROP COLUMN IF EXISTS estimated_savings;

-- Add new computed_savings based on market_price - owner_price (transparent model)
ALTER TABLE property_cost_breakdowns
  ADD COLUMN computed_savings NUMERIC(14, 2) GENERATED ALWAYS AS (
    CASE
      WHEN market_price IS NOT NULL
        AND market_price >= owner_price
      THEN market_price - owner_price
      ELSE 0
    END
  ) STORED;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS property_cost_breakdowns_market_price_idx 
  ON property_cost_breakdowns (market_price);

CREATE INDEX IF NOT EXISTS property_cost_breakdowns_owner_price_idx 
  ON property_cost_breakdowns (owner_price);

-- Add comment for clarity in database
COMMENT ON COLUMN property_cost_breakdowns.owner_price IS 
  'Direct seller price verified by VeraEstates';

COMMENT ON COLUMN property_cost_breakdowns.market_price IS 
  'Typical broker-assisted market price in the local area';

COMMENT ON COLUMN property_cost_breakdowns.computed_savings IS 
  'Estimated buyer savings: market_price - owner_price';
