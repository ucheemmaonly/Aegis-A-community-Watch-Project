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
- **Tailwind CSS v4**
- **Fetch API** 

## API used

Base URL: `https://1-community-watch-api.vercel.app/api/v1`
Docs: `https://1-community-watch-api.vercel.app/docs`
OpenAPI spec: `https://1-community-watch-api.vercel.app/openapi.json`

## Authentication method

**JWT Bearer token** stored in `localStorage`, sent via `Authorization: Bearer`
header on every request.

- On register/login the API returns a JWT token in its response body. The
  frontend stores it in `localStorage` and attaches it to every subsequent
  request as an `Authorization: Bearer <token>` header.
- On app startup `AuthContext` checks for a stored token and calls
  `GET /auth/me` to hydrate user state. A loading spinner is shown until this
  check resolves, so a page refresh never causes a false "logged out" redirect.
- Logout calls `POST /auth/logout` and clears the token from `localStorage`.

### Why JWT bearer instead of httpOnly cookie

The API supports both cookie auth and JWT bearer auth. Cookie auth works
seamlessly in development (the Vite dev server proxies requests to make them
same-origin), but **fails in production** when the frontend and API are on
different origins unless the server sets `SameSite=None; Secure` on the cookie.
Since the API is a third-party service we don't control, JWT bearer auth is the
reliable choice for a deployed frontend — the token travels in a header, so
cross-origin restrictions don't apply.

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
- Register / Login / Logout via JWT bearer token
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



## A note on cross-origin API calls

The API lives on `1-community-watch-api.vercel.app`, a different origin from
wherever this frontend runs. Using JWT bearer auth (an `Authorization` header)
avoids the cross-origin cookie restrictions entirely — the token is attached
manually to each request and doesn't depend on browser cookie policies.

- **Local development** (`npm run dev`): the dev server proxies all
  `/api/v1/*` requests to the real API (see `vite.config.js`), so CORS is
  never an issue during development.
- **Production**: the `Authorization` header is sent directly to the API's
  absolute URL. As long as the API accepts cross-origin bearer requests (it
  does), this works on any HTTPS host without additional configuration.

If login appears to succeed but you stay logged out, check DevTools →
Application → Local Storage for the `cw_token` key. Its absence means the
token wasn't extracted from the login response — inspect the Network tab to
see the actual response shape.

Because this is a client-side-routed SPA, configure your host to rewrite all
unmatched paths to `/index.html` (Vercel and Netlify both do this
automatically for Vite projects; for other hosts add an equivalent rewrite
rule) so deep links like `/incidents/123` work on refresh.

No environment variables are required -- the API base URL is a public,
same-for-everyone constant in `src/lib/api.js`.


