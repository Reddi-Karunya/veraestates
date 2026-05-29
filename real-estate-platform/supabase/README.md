# Supabase setup

## 1. Create project

Create a project at [supabase.com](https://supabase.com) (Mumbai `ap-south-1` recommended).

## 2. Run migrations

**Option A — Supabase CLI**

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

**Option B — SQL Editor**

Run each file in `supabase/migrations/` in order (`00001` through `00014`).

Migration `00013_cost_breakdown.sql` adds `property_cost_breakdowns` (with computed `total_cost` / `estimated_savings`) and `analytics_events` for buyer cost transparency tracking.

Migration `00014_buyer_qualification.sql` adds buyer qualification fields to `leads` (`budget_range`, `property_purpose`, `purchase_timeline`, `loan_required`, `preferred_areas`, `qualification_score`) and auto-syncs priority from score.

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Create admin user

1. Supabase Dashboard → **Authentication** → **Users** → **Add user**
2. Email + password
3. SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## 5. Storage

Migration `00010_storage.sql` creates the `property-images` public bucket. Confirm it under **Storage** in the dashboard.

## 6. Sign in

Open [http://localhost:3000/login](http://localhost:3000/login) → redirects to `/admin` after login.
