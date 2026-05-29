-- Lead management: extended status, priority, notes, timeline, assignment

CREATE TYPE lead_priority AS ENUM ('hot', 'warm', 'cold');

CREATE TYPE lead_timeline_event AS ENUM (
  'inquiry_submitted',
  'contacted',
  'site_visit',
  'negotiation',
  'closed_won',
  'closed_lost',
  'note_added',
  'assigned',
  'follow_up_set'
);

-- Extend lead_status (existing: new, contacted, closed)
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'site_visit_scheduled';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'negotiating';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'won';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'lost';

-- Migrate legacy closed → won
UPDATE leads SET status = 'won' WHERE status::text = 'closed';

-- New columns on leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS priority lead_priority NOT NULL DEFAULT 'warm',
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS leads_priority_idx ON leads (priority);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads (assigned_to);
CREATE INDEX IF NOT EXISTS leads_follow_up_at_idx ON leads (follow_up_at);

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Lead notes
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX lead_notes_lead_id_idx ON lead_notes (lead_id, created_at DESC);

-- Lead timeline
CREATE TABLE lead_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  event_type lead_timeline_event NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX lead_timeline_lead_id_idx ON lead_timeline (lead_id, created_at DESC);

-- Timeline helpers
CREATE OR REPLACE FUNCTION insert_lead_timeline(
  p_lead_id UUID,
  p_event_type lead_timeline_event,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_created_by UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO lead_timeline (lead_id, event_type, title, description, metadata, created_by)
  VALUES (p_lead_id, p_event_type, p_title, p_description, p_metadata, p_created_by);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION lead_status_to_timeline_event(st lead_status)
RETURNS lead_timeline_event AS $$
BEGIN
  RETURN CASE st::text
    WHEN 'new' THEN 'inquiry_submitted'::lead_timeline_event
    WHEN 'contacted' THEN 'contacted'::lead_timeline_event
    WHEN 'site_visit_scheduled' THEN 'site_visit'::lead_timeline_event
    WHEN 'negotiating' THEN 'negotiation'::lead_timeline_event
    WHEN 'won' THEN 'closed_won'::lead_timeline_event
    WHEN 'lost' THEN 'closed_lost'::lead_timeline_event
    ELSE 'inquiry_submitted'::lead_timeline_event
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION on_lead_insert_timeline()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM insert_lead_timeline(
    NEW.id,
    'inquiry_submitted',
    'Inquiry submitted',
    COALESCE(NEW.message, 'New lead received'),
    jsonb_build_object('source', NEW.source)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER lead_insert_timeline
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION on_lead_insert_timeline();

CREATE OR REPLACE FUNCTION on_lead_status_change_timeline()
RETURNS TRIGGER AS $$
DECLARE
  evt lead_timeline_event;
  lbl TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    evt := lead_status_to_timeline_event(NEW.status);
    lbl := CASE NEW.status::text
      WHEN 'new' THEN 'Inquiry submitted'
      WHEN 'contacted' THEN 'Contacted'
      WHEN 'site_visit_scheduled' THEN 'Site visit scheduled'
      WHEN 'negotiating' THEN 'Negotiation started'
      WHEN 'won' THEN 'Closed — Won'
      WHEN 'lost' THEN 'Closed — Lost'
      ELSE 'Status updated'
    END;
    PERFORM insert_lead_timeline(
      NEW.id,
      evt,
      lbl,
      'Status changed from ' || OLD.status::text || ' to ' || NEW.status::text,
      jsonb_build_object('from', OLD.status, 'to', NEW.status)
    );
  END IF;

  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to AND NEW.assigned_to IS NOT NULL THEN
    PERFORM insert_lead_timeline(
      NEW.id,
      'assigned',
      'Lead assigned',
      NULL,
      jsonb_build_object('assigned_to', NEW.assigned_to)
    );
  END IF;

  IF OLD.follow_up_at IS DISTINCT FROM NEW.follow_up_at AND NEW.follow_up_at IS NOT NULL THEN
    PERFORM insert_lead_timeline(
      NEW.id,
      'follow_up_set',
      'Follow-up scheduled',
      to_char(NEW.follow_up_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI'),
      jsonb_build_object('follow_up_at', NEW.follow_up_at)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER lead_update_timeline
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION on_lead_status_change_timeline();

CREATE OR REPLACE FUNCTION on_lead_note_insert_timeline()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM insert_lead_timeline(
    NEW.lead_id,
    'note_added',
    'Note added',
    left(NEW.body, 200),
    jsonb_build_object('note_id', NEW.id),
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER lead_note_insert_timeline
  AFTER INSERT ON lead_notes
  FOR EACH ROW
  EXECUTE FUNCTION on_lead_note_insert_timeline();

-- RLS
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read team profiles for assignment"
  ON profiles FOR SELECT
  USING (is_admin_or_staff());

CREATE POLICY "Staff read lead_notes"
  ON lead_notes FOR SELECT
  USING (is_admin_or_staff());

CREATE POLICY "Staff insert lead_notes"
  ON lead_notes FOR INSERT
  WITH CHECK (is_admin_or_staff());

CREATE POLICY "Staff delete own lead_notes"
  ON lead_notes FOR DELETE
  USING (is_admin_or_staff() AND (created_by = auth.uid() OR is_admin()));

CREATE POLICY "Staff read lead_timeline"
  ON lead_timeline FOR SELECT
  USING (is_admin_or_staff());

CREATE POLICY "Staff insert lead_timeline"
  ON lead_timeline FOR INSERT
  WITH CHECK (is_admin_or_staff());
