CREATE TABLE verification_types (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT
);

INSERT INTO verification_types (code, label, description, sort_order, icon) VALUES
  ('title_clear', 'Title Verified', 'Legal title chain reviewed', 1, 'file-check'),
  ('rera_registered', 'RERA Registered', 'RERA registration verified', 2, 'badge-check'),
  ('site_visit', 'Site Visited', 'On-ground inspection completed', 3, 'map-pin'),
  ('encumbrance_checked', 'Encumbrance Clear', 'No outstanding liens found', 4, 'shield'),
  ('ai_document_scan', 'AI Document Check', 'Automated document analysis', 5, 'scan');
