import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import IncidentCard from "../components/IncidentCard.jsx";
import SeverityBadge from "../components/SeverityBadge.jsx";
import { formatDateTime } from "../lib/constants.js";

function QuickAction({ to, title, body, icon }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-2 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-200 text-accent-600">
        {icon}
      </div>
      <h3 className="font-semibold text-espresso-950 group-hover:text-accent-600">{title}</h3>
      <p className="text-sm text-espresso-600">{body}</p>
    </Link>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-lg bg-espresso-800 p-4">
      <div className="text-2xl font-bold text-white">{value ?? "—"}</div>
      <div className="mt-1 text-xs text-cream-200/70">{label}</div>
    </div>
  );
}

function SectionState({ status, error, onRetry, emptyMessage }) {
  if (status === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl border border-espresso-100 bg-white" />
        ))}
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }
  if (status === "empty") {
    return (
      <div className="rounded-xl border border-dashed border-espresso-200 bg-white px-6 py-8 text-center text-sm text-espresso-600">
        {emptyMessage}
      </div>
    );
  }
  return null;
}

export default function Home() {
  const { user } = useAuth();
  const canManage = user?.role === "patrol_officer" || user?.role === "admin";

  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading");

  const [incidents, setIncidents] = useState([]);
  const [incidentsStatus, setIncidentsStatus] = useState("loading");
  const [incidentsError, setIncidentsError] = useState(null);

  const [alerts, setAlerts] = useState([]);
  const [alertsStatus, setAlertsStatus] = useState("loading");
  const [alertsError, setAlertsError] = useState(null);

  async function loadStats() {
    setStatsStatus("loading");
    try {
      const data = await api.get("/public/stats");
      setStats(data?.overview ?? data);
      setStatsStatus("success");
    } catch {
      setStatsStatus("error");
    }
  }

  async function loadIncidents() {
    setIncidentsStatus("loading");
    setIncidentsError(null);
    try {
      const data = await api.get("/incidents");
      const list = (Array.isArray(data) ? data : data?.incidents ?? []).slice(0, 4);
      setIncidents(list);
      setIncidentsStatus(list.length === 0 ? "empty" : "success");
    } catch (err) {
      setIncidentsError(err.message || "Couldn't load recent incidents.");
      setIncidentsStatus("error");
    }
  }

  async function loadAlerts() {
    setAlertsStatus("loading");
    setAlertsError(null);
    try {
      const data = await api.get("/alerts");
      const list = (Array.isArray(data) ? data : data?.alerts ?? []).slice(0, 3);
      setAlerts(list);
      setAlertsStatus(list.length === 0 ? "empty" : "success");
    } catch (err) {
      setAlertsError(err.message || "Couldn't load alerts.");
      setAlertsStatus("error");
    }
  }

  useEffect(() => {
    loadStats();
    loadIncidents();
    loadAlerts();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Welcome header */}
      <div className="rounded-2xl bg-espresso-950 p-6 text-cream-50 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cream-200/70">
              Welcome back
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {user?.name || "Neighbor"}
              {user?.zone ? <span className="font-normal text-cream-200/80"> · {user.zone}</span> : null}
            </h1>
            {user?.role && (
              <span className="mt-2 inline-block rounded-full bg-espresso-800 px-2.5 py-1 text-xs font-medium capitalize text-cream-100">
                {user.role.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 sm:w-auto">
            {statsStatus === "loading" && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[72px] w-28 animate-pulse rounded-lg bg-espresso-800" />
                ))}
              </>
            )}
            {statsStatus === "success" && (
              <>
                <StatPill label="Reported" value={stats?.totalIncidentsReported} />
                <StatPill label="Resolved" value={stats?.resolvedIncidents} />
                <StatPill label="Active alerts" value={stats?.activeSafetyAlerts} />
              </>
            )}
            {statsStatus === "error" && (
              <p className="text-sm text-cream-200/70">Live stats unavailable right now.</p>
            )}
          </div>
        </div>
      </div>

      
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          to="/report"
          title="Report an incident"
          body="File a new report in your neighborhood."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        />
        <QuickAction
          to="/incidents"
          title="Browse incidents"
          body="Search, filter, and track community reports."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
          }
        />
        <QuickAction
          to="/alerts"
          title="Safety alerts"
          body="View active zone and neighborhood-wide alerts."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6z" />
            </svg>
          }
        />
        {canManage ? (
          <QuickAction
            to="/patrols"
            title="Patrol shifts"
            body="Start a shift, log checkpoints, and manage status."
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
          />
        ) : (
          <QuickAction
            to="/profile"
            title="Your profile"
            body="Update your contact details and zone."
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            }
          />
        )}
      </div>

      
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-espresso-950">Recent incidents</h2>
            <Link to="/incidents" className="text-sm font-medium text-accent-600 hover:underline">
              View all →
            </Link>
          </div>

          {incidentsStatus === "success" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          ) : (
            <SectionState
              status={incidentsStatus}
              error={incidentsError}
              onRetry={loadIncidents}
              emptyMessage="No incidents reported yet. Be the first to report one."
            />
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-espresso-950">Active alerts</h2>
            <Link to="/alerts" className="text-sm font-medium text-accent-600 hover:underline">
              View all →
            </Link>
          </div>

          {alertsStatus === "success" ? (
            <ul className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <li key={alert.id} className="rounded-xl border border-espresso-200/60 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-xs text-espresso-500">{formatDateTime(alert.createdAt)}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-espresso-950">{alert.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-espresso-600">{alert.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <SectionState
              status={alertsStatus}
              error={alertsError}
              onRetry={loadAlerts}
              emptyMessage="No active alerts right now."
            />
          )}
        </div>
      </div>
    </div>
  );
}
