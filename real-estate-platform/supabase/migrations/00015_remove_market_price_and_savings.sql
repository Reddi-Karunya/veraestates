-- Remove legacy market_price and computed_savings columns
-- VeraEstates now uses transparent direct pricing model only

-- Drop the market_price column if it exists
ALTER TABLE property_cost_breakdowns
  DROP COLUMN IF EXISTS market_price CASCADE;

-- Drop the computed_savings column if it exists (may be a generated column)
ALTER TABLE property_cost_breakdowns
  DROP COLUMN IF EXISTS computed_savings CASCADE;

-- Drop related indexes if they exist
DROP INDEX IF EXISTS property_cost_breakdowns_market_price_idx;

-- Verify the table structure
-- The table should now only have:
-- property_id, owner_price, registration_cost, legal_verification_cost, 
-- platform_fee, miscellaneous_cost, total_cost, created_at, updated_at
