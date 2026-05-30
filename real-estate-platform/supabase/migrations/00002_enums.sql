-- Enum types
CREATE TYPE user_role AS ENUM ('admin', 'staff');

CREATE TYPE property_type AS ENUM ('apartment', 'land', 'villa', 'commercial');

CREATE TYPE listing_status AS ENUM ('available', 'sold', 'reserved');

CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');

CREATE TYPE approval_type AS ENUM (
  'rera',
  'vmrda',
  'dtcp',
  'gvmc',
  'panchayat',
  'municipal',
  'hmda',
  'other'
);

CREATE TYPE ownership_status AS ENUM (
  'freehold',
  'leasehold',
  'cooperative',
  'power_of_attorney',
  'other'
);

CREATE TYPE area_unit AS ENUM ('sqft', 'sqyd', 'acres', 'sqm');

CREATE TYPE lead_source AS ENUM ('form', 'whatsapp_click');

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'closed');
