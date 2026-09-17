import { Link } from "react-router";
import ShieldMark from "../components/ShieldMark.jsx";

const features = [
  {
    title: "Structured incident reports",
    body: "Category, priority, and location are always picked from a fixed set of options — never free text — so every report is consistent and searchable.",
    icon: (
      <path d="M9 12l2 2 4-4M7.8 4h8.4L21 8.2v11.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2.8z" />
    ),
  },
  {
    title: "Real-time community confirmation",
    body: "Neighbors upvote and comment to confirm what's happening, so everyone stays informed as a situation develops.",
    icon: <path d="M12 19V5M5 12l7-7 7 7" />,
  },
  {
    title: "Patrol & admin tools",
    body: "Patrol officers log shifts and checkpoints; admins broadcast zone-based alerts and manage incident status — all role-gated, backend-enforced.",
    icon: (
      <path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6zM8.5 12.2l2.3 2.3 4.7-4.9" />
    ),
  },
  {
    title: "Live safety statistics",
    body: "See real, up-to-the-minute counts of reports, resolutions, and active patrols for your community — never hardcoded.",
    icon: <path d="M4 19V10M10 19V5M16 19v-7M22 19H2" />,
  },
];

const steps = [
  {
    label: "Report",
    body: "File a clear, structured report in under a minute.",
  },
  { label: "Confirm", body: "Neighbors upvote and comment to verify it." },
  { label: "Resolve", body: "Patrols and admins track it through to close." },
];

function FeatureIcon({ children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Abstract, on-brand hero illustration built from the same shield motif used
 *  in the header/footer, rather than an unrelated stock graphic. */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 360 320" className="h-full w-full" aria-hidden="true">
      <circle
        cx="180"
        cy="160"
        r="150"
        fill="none"
        stroke="#5c371c"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <circle
        cx="180"
        cy="160"
        r="105"
        fill="none"
        stroke="#5c371c"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* connecting "neighborhood network" lines */}
      <g stroke="#7a4a26" strokeOpacity="0.55" strokeWidth="1.5">
        <line x1="180" y1="160" x2="84" y2="95" />
        <line x1="180" y1="160" x2="276" y2="95" />
        <line x1="180" y1="160" x2="70" y2="205" />
        <line x1="180" y1="160" x2="290" y2="215" />
        <line x1="180" y1="160" x2="180" y2="270" />
      </g>

      {/* node dots representing residents/reports */}
      {[
        [84, 95],
        [276, 95],
        [70, 205],
        [290, 215],
        [180, 270],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="7"
          fill="#ece2d0"
          stroke="#7a4a26"
          strokeWidth="1.5"
        />
      ))}

      {/* central shield */}
      <g transform="translate(150,120) scale(2.5)">
        <path
          d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6z"
          fill="#2a1d16"
          stroke="#f5efe5"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12.2l2.3 2.3 4.7-4.9"
          stroke="#ece2d0"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-espresso-950 text-cream-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-espresso-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-200">
              <ShieldMark className="h-3.5 w-3.5 text-accent-400" />
              Neighborhood safety, organized
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Report it. Confirm it. Resolve it — together.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-cream-200/85">
              Aegis gives residents, patrol officers, and admins one clear,
              trustworthy place to report incidents, track patrols, and share
              safety alerts — replacing scattered group chats and paper logs
              with a single organized system.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/home"
                className="rounded-lg bg-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700"
              >
                Enter App
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-cream-200/30 px-5 py-3 text-sm font-semibold text-cream-100 transition hover:bg-espresso-900"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="mx-auto h-64 w-64 sm:h-80 sm:w-80">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-espresso-950">
          Everything a neighborhood needs to stay coordinated
        </h2>
        <p className="mt-2 max-w-2xl text-espresso-700">
          Built around one idea: safety information should be structured,
          visible, and easy to act on.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cream-200 text-accent-600">
                <FeatureIcon>{f.icon}</FeatureIcon>
              </div>
              <div>
                <h3 className="font-semibold text-espresso-950">{f.title}</h3>
                <p className="mt-1 text-sm text-espresso-700">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works (condensed) */}
      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-espresso-950">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className="rounded-xl border border-espresso-200/60 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-espresso-950 text-sm font-bold text-cream-50">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-espresso-950">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm text-espresso-700">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-espresso-950 p-8 text-cream-50 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold">See it in action</h2>
            <p className="mt-2 max-w-md text-cream-200/80">
              Explore live community safety statistics, browse recent incidents,
              and see how Community Watch keeps a neighborhood organized.
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <Link
              to="/home"
              className="rounded-lg bg-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-700"
            >
              Enter App
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-cream-200/30 px-5 py-3 text-sm font-semibold text-cream-100 transition hover:bg-espresso-900"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
