# Aegis- A Community Watch Project

A frontend-only React application for neighborhood safety: residents report and
track incidents, patrol officers log shifts, and admins broadcast safety alerts.
Built as Part of my Frontend Development Program project at RAD5 TECH HUB.

## Purpose
Aegis gives a neighborhood one calm, trustworthy, well-organized place to:

- report and browse incidents (theft, vandalism, hazards, and more)
- confirm reports via upvotes and comments
- follow zone-based safety alerts
- track patrol shifts and checkpoint activity (patrol officer / admin)

## Technologies used

- **React** 
- **JavaScript**
- **Vite** 
- **npm** 
- **React Router** 
- **Tailwind CSS v4
- **Fetch API** 

## API used

Base URL: `https://1-community-watch-api.vercel.app/api/v1`
Docs: `https://1-community-watch-api.vercel.app/docs`
OpenAPI spec: `https://1-community-watch-api.vercel.app/openapi.json`

## Authentication method

**httpOnly session cookie** (`community_watch_token`), *not* a frontend-managed JWT.

- The backend sets an httpOnly cookie on register/login. The browser stores and
  sends it automatically; JavaScript never reads or writes it.
- Every request to the API is sent with `credentials: "include"`.
- On app startup, `AuthContext` calls `GET /auth/me` to determine whether a
  session already exists (this is what makes the session survive a page
  refresh). A loading state is shown until this check resolves, so a refresh
  on a protected page never causes a false "logged out" redirect.
- Logout calls `POST /auth/logout`, which clears the cookie server-side; the
  frontend only clears its own React state.

### Why httpOnly cookies instead of a frontend-stored JWT

- The token is never exposed to JavaScript, which meaningfully reduces XSS
  token-theft risk compared to `localStorage`/`sessionStorage`.
- The browser handles attaching/expiring the cookie, so there's no manual
  token bookkeeping, refresh logic, or risk of stale tokens lingering in
  storage.
- It matches how a real production session-based web app is typically built,
  which was an explicit project requirement.

The frontend hides UI it knows a role can't use (for a cleaner experience),
but the backend remains the authority: 401/403 responses are always handled
and surfaced to the user, never assumed away by frontend checks.

## Implemented roles

- **Resident** (fully implemented): report incidents, browse/search/filter,
  view details, upvote, comment, edit own profile, view alerts, delete own
  incidents.
- **Patrol officer** (stretch, implemented): everything a resident can do,
  plus start/checkpoint/end patrol shifts and update incident status.
- **Admin** (stretch, implemented): everything a patrol officer can do, plus
  broadcast safety alerts.

Role-specific UI (patrol controls, status updates, alert broadcast form) is
only rendered for users whose `role` matches -- but the API's own 401/403
responses are still handled if someone reaches an action they're not
authorized for.

## Implemented features

- Dedicated marketing **Landing Page** at `/` (hero, features, how-it-works, CTA)
- Authenticated **Home dashboard** at `/home` (protected): welcome header with
  live community stats, role-aware quick action cards, a recent-incidents
  preview, and an active-alerts preview — the default landing spot right
  after login/register
- Client-side navigation throughout via React Router `<Link>`, no full page reloads
- Register / Login / Logout via httpOnly cookie session
- Session restoration on refresh (`GET /auth/me`) with a proper loading state
- Protected routes (`/profile`, `/incidents`, `/incidents/:id`, `/report`,
  `/alerts`, `/patrols`) that wait for auth to initialize before redirecting
- Profile view + edit (`PATCH /auth/me`)
- Incident feed: search, status/category/priority/zone filters, loading /
  error / empty states
- Incident detail: full info, upvote (with duplicate-request guard), comments,
  owner-only delete UI, patrol/admin status updates
- Report incident form with enum dropdowns (no free-text for category/priority)
  and client-side validation
- Alerts: list with zone/severity filters, admin/patrol broadcast form
- Patrols: list, start/checkpoint/end shift controls for patrol officers/admins
- Responsive layout (375px-1440px+), mobile nav menu, accessible focus states,
  and a single consistent severity color system used everywhere:
  `critical/emergency -> red`, `warning -> amber`, `info -> blue`,
  `success/resolved -> green` -- always paired with a text label, never color alone.



## A note on the httpOnly cookie across origins

The API lives on `1-community-watch-api.vercel.app`, a different origin from
wherever this frontend runs. Cross-site cookies are only stored by the
browser when they're `SameSite=None; Secure`, and `Secure` cookies require
**HTTPS**. That has two practical consequences:

- **Local development** (`npm run dev`, plain `http://localhost`): the dev
  server proxies all `/api/v1/*` requests to the real API (see
  `vite.config.js`), so the browser sees everything as same-origin and the
  cookie is stored normally. No extra setup needed.
- **Production**: deploy the built frontend to an **HTTPS** domain (any of
  the hosts below already do this). As long as the site is served over
  HTTPS, the cross-site `Secure` cookie will be accepted normally — no proxy
  needed once both sides are on HTTPS.

If login ever appears to succeed (200) but you stay logged out, check
DevTools → Application → Cookies for `community_watch_token`. Its absence
almost always means the current origin is `http://` rather than `https://`.

Because this is a client-side-routed SPA, configure your host to rewrite all
unmatched paths to `/index.html` (Vercel and Netlify both do this
automatically for Vite projects; for other hosts add an equivalent rewrite
rule) so deep links like `/incidents/123` work on refresh.

No environment variables are required -- the API base URL is a public,
same-for-everyone constant in `src/lib/api.js`.


