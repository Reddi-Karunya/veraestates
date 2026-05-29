# VeraEstates

Live demo: https://veraestates.vercel.app/

A Next.js real estate platform for verified premium property listings in India. This repository contains the full `real-estate-platform` app, including property discovery, admin pages, Supabase integration, and dynamic property detail routes.

## Features

- Next.js App Router with server components
- Static and dynamic property pages under `/properties`
- Supabase-backed data access for listings and leads
- Admin dashboard for managing properties and verification
- Responsive UI with listing filters and property detail views
- WhatsApp lead capture links and verification badges

## Getting Started

1. Install dependencies:

```bash
cd real-estate-platform
npm install
```

2. Add environment variables in `real-estate-platform/.env.local`.

3. Run the app locally:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local` and set the following values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Deployment

This project is designed to deploy on Vercel. The live site is available at:

- https://veraestates.vercel.app/

## Repository

GitHub: https://github.com/Reddi-Karunya/veraestates

## Notes

- The application uses a Supabase client path that avoids request-scoped APIs during static generation.
- Property detail routes are generated from available slugs and rendered under `/properties/[slug]`.
