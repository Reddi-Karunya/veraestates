-- Buyer qualification engine

CREATE TYPE lead_budget_range AS ENUM (
  'under_50L',
  '50L_1Cr',
  '1Cr_2Cr',
  '2Cr_5Cr',
  '5Cr_plus'
);

CREATE TYPE lead_property_purpose AS ENUM ('self_use', 'investment');

CREATE TYPE lead_purchase_timeline AS ENUM (
  'immediate',
  '30_days',
  '3_months',
  '6_plus_months'
);

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS budget_range lead_budget_range,
  ADD COLUMN IF NOT EXISTS property_purpose lead_property_purpose,
  ADD COLUMN IF NOT EXISTS purchase_timeline lead_purchase_timeline,
  ADD COLUMN IF NOT EXISTS loan_required BOOLEAN,
  ADD COLUMN IF NOT EXISTS preferred_areas TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS qualification_score SMALLINT
    CHECK (qualification_score IS NULL OR (qualification_score >= 0 AND qualification_score <= 100));

CREATE INDEX IF NOT EXISTS leads_qualification_score_idx
  ON leads (qualification_score DESC NULLS LAST, created_at DESC);

-- Auto-set priority from qualification score on insert/update
CREATE OR REPLACE FUNCTION sync_lead_priority_from_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qualification_score IS NOT NULL THEN
    IF NEW.qualification_score >= 70 THEN
      NEW.priority := 'hot';
    ELSIF NEW.qualification_score >= 40 THEN
      NEW.priority := 'warm';
    ELSE
      NEW.priority := 'cold';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_sync_priority_from_score ON leads;
CREATE TRIGGER leads_sync_priority_from_score
  BEFORE INSERT OR UPDATE OF qualification_score ON leads
  FOR EACH ROW
  EXECUTE FUNCTION sync_lead_priority_from_score();
