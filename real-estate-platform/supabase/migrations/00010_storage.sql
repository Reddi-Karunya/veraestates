-- Storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  TRUE,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public read property images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Authenticated admin/staff upload
CREATE POLICY "Staff upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND is_admin_or_staff()
  );

CREATE POLICY "Staff update property images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'property-images'
    AND is_admin_or_staff()
  );

CREATE POLICY "Staff delete property images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND is_admin_or_staff()
  );
