# La Galerie du Vieux Carré — Vercel deployment

This build includes the editorial residence site plus a functional private-stay inquiry system and password-protected owner dashboard.

## Owner dashboard
Open `/dashboard.html` after deployment. The dashboard shows total page views, unique browser sessions, inquiries, inquiry conversion, daily traffic, most-viewed pages, full guest contact details, inquiry status, and CSV export.

## One-time setup (required for analytics + inquiries)
1. Create a free Supabase project.
2. Open Supabase → SQL Editor and run `supabase-setup.sql` from this ZIP.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` = your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase service-role key (server-side only; never put it in frontend code)
   - `OWNER_DASHBOARD_PASSWORD` = the password you want to use at `/dashboard.html`
   - Optional: `DASHBOARD_SESSION_SECRET` = a long random string for signing dashboard sessions. If omitted, the dashboard password is used for signing.
4. Redeploy the project in Vercel after saving the environment variables.

## Privacy / security design
Traffic tracking is first-party and intentionally lightweight. It records the page, referrer, timestamp and a random browser-session ID; this build does not intentionally store IP addresses or fingerprint visitors. Booking contact data is stored in Supabase and is only requested through the password-protected server-side dashboard API. Supabase Row Level Security is enabled and no browser-readable database policy is created.

## Files added
- `dashboard.html` / `dashboard.js` — owner dashboard
- `api/auth.js` — owner login/session
- `api/dashboard.js` — dashboard data + inquiry status updates
- `api/inquiry.js` — booking inquiry submission
- `api/track.js` — anonymous page-view collection
- `api/_lib.js` — shared server helpers
- `supabase-setup.sql` — database tables

Deploy the *contents* of this folder at the project root.
