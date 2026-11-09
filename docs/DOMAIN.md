# Moving www.barcodesqr.com to this project

Status on 2026-11-09 (`npm run -s domain:check -- https://www.barcodesqr.com`):
HTTPS, http→https and barcodesqr.com→www already work; the **only** fault
is that both names are attached to an older Vercel project, whose build has
no `/q/<slug>` route. Every printed hosted code points at
`https://www.barcodesqr.com/q/<slug>`, so they all 404 there today, while the
same codes open on `https://barcodesqr.vercel.app/q/<slug>`.

Nothing in the code changes for the move. It is Vercel settings plus four
outside configurations.

## Before

1. **Baseline**: `npm run -s domain:check -- https://barcodesqr.vercel.app --db "$PROD_DATABASE_URL"`
   must say ALL OK. (`$PROD_DATABASE_URL` is the production Neon URL from the
   project's Vercel env, not `.env.local`.)
2. **Note the old project's name** and its domain settings (screenshot) —
   that is the rollback.
3. **Production env vars on this project** (Settings → Environment Variables,
   Production):
   - `APP_URL=https://www.barcodesqr.com` — emailed sign-in links point here.
   - `NEXT_PUBLIC_QR_BASE_URL` — leave **unset** (it defaults to the www
     origin; a value here would change what every new code encodes).
   - `AUTH_SECRET` unchanged — changing it signs everyone out.
4. **Google OAuth client** (Google Cloud → Credentials): add the authorised
   redirect URI `https://www.barcodesqr.com/api/auth/callback/google`. Keep the
   vercel.app one until after the move.
5. **R2 CORS**: already allows every origin (`storage:check` with
   `STORAGE_CORS_ORIGINS=…,https://www.barcodesqr.com` passes) — no change.

## The move (a few minutes; DNS does not change)

Both names already point at Vercel, so this is a re-assignment, not a DNS
change, and takes effect within a minute.

1. Old project → Settings → Domains → remove `www.barcodesqr.com` and
   `barcodesqr.com`.
2. This project → Settings → Domains → add `www.barcodesqr.com` (primary)
   and `barcodesqr.com` set to **Redirect to www.barcodesqr.com (308)**.
3. Redeploy production once (so `APP_URL` is in the build's environment).

## After

1. `npm run -s domain:check -- https://www.barcodesqr.com --slugs kazdMMpn,lwaoDEZM --db "$PROD_DATABASE_URL"`
   → ALL OK means: one-hop redirects, no loops, no vercel.app detours, the
   current deployment, the hosted-page route, old and new codes opening,
   Payment/Feedback leaving for the customer's https link, scans counted,
   event.ics / contact.vcf served.
2. Real phones (Tami): scan one code of every hosted type and every direct
   type; then edit a hosted one and rescan.
3. Sign in on www (Google, and the email link once Resend is set up).
   People signed in on vercel.app sign in once more: cookies are per host.

## Rollback

Reverse the domain assignment: remove both names from this project and add
them back to the old project as they were (the screenshot from step 2). No
DNS change, so it is back within a minute. Nothing in the database depends on
which project serves the domain; codes saved meanwhile keep working on
`barcodesqr.vercel.app/q/<slug>` and come back to www after a later retry.
