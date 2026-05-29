ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper: check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin_or_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties: public read published + available/sold/reserved on site
CREATE POLICY "Public read published properties"
  ON properties FOR SELECT
  USING (
    is_published = TRUE
    AND listing_status IN ('available', 'sold', 'reserved')
  );

CREATE POLICY "Admins full access properties"
  ON properties FOR ALL
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());

-- Property images: public via published property
CREATE POLICY "Public read images of published properties"
  ON property_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
        AND p.is_published = TRUE
        AND p.listing_status IN ('available', 'sold', 'reserved')
    )
  );

CREATE POLICY "Admins full access property_images"
  ON property_images FOR ALL
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());

-- Verifications
CREATE POLICY "Public read verified badges"
  ON property_verifications FOR SELECT
  USING (
    status = 'verified'
    AND EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id AND p.is_published = TRUE
    )
  );

CREATE POLICY "Admins full access property_verifications"
  ON property_verifications FOR ALL
  USING (is_admin_or_staff())
  WITH CHECK (is_admin_or_staff());

CREATE POLICY "Public read verification_types"
  ON verification_types FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage verification_types"
  ON verification_types FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Leads: public insert, admin read
CREATE POLICY "Anyone can submit leads"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins read leads"
  ON leads FOR SELECT
  USING (is_admin_or_staff());

CREATE POLICY "Admins update leads"
  ON leads FOR UPDATE
  USING (is_admin_or_staff());
