import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import SeverityBadge from "../components/SeverityBadge.jsx";
import { ALERT_SEVERITIES, formatDateTime } from "../lib/constants.js";

const initialFilters = { zone: "", severity: "" };
const initialBroadcast = {
  title: "",
  message: "",
  severity: "warning",
  targetZone: "",
  expiresInHours: 24,
};

export default function Alerts() {
  const { user } = useAuth();
  const canBroadcast =
    user?.role === "admin" || user?.role === "patrol_officer";

  const [filters, setFilters] = useState(initialFilters);
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [broadcastForm, setBroadcastForm] = useState(initialBroadcast);
  const [broadcastError, setBroadcastError] = useState(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async (f) => {
    setStatus("loading");
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.zone) params.set("zone", f.zone);
      if (f.severity) params.set("severity", f.severity);
      const qs = params.toString();
      const data = await api.get(`/alerts${qs ? `?${qs}` : ""}`);
      setAlerts(Array.isArray(data) ? data : (data?.alerts ?? []));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Couldn't load alerts.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(e) {
    e.preventDefault();
    load(filters);
  }

  async function handleBroadcast(e) {
    e.preventDefault();
    setBroadcastError(null);
    setBroadcastSuccess(false);

    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      setBroadcastError("Title and message are required.");
      return;
    }

    setBroadcasting(true);
    try {
      await api.post("/alerts", {
        title: broadcastForm.title.trim(),
        message: broadcastForm.message.trim(),
        severity: broadcastForm.severity,
        ...(broadcastForm.targetZone.trim()
          ? { targetZone: broadcastForm.targetZone.trim() }
          : {}),
        expiresInHours: Number(broadcastForm.expiresInHours) || 24,
      });
      setBroadcastForm(initialBroadcast);
      setBroadcastSuccess(true);
      await load(filters);
    } catch (err) {
      setBroadcastError(err.message || "Couldn't broadcast this alert.");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-espresso-950">
            Safety alerts
          </h1>
          <p className="mt-1 text-sm text-espresso-600">
            Active neighborhood-wide and zone-specific notices.
          </p>
        </div>
        {canBroadcast && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700"
          >
            {showForm ? "Close" : "Broadcast alert"}
          </button>
        )}
      </div>

      {canBroadcast && showForm && (
        <form
          onSubmit={handleBroadcast}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-espresso-600">
            Broadcast a new alert
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="alert-title"
                className="mb-1 block text-sm font-medium text-espresso-800"
              >
                Title
              </label>
              <input
                id="alert-title"
                value={broadcastForm.title}
                onChange={(e) =>
                  setBroadcastForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="alert-severity"
                className="mb-1 block text-sm font-medium text-espresso-800"
              >
                Severity
              </label>
              <select
                id="alert-severity"
                value={broadcastForm.severity}
                onChange={(e) =>
                  setBroadcastForm((f) => ({ ...f, severity: e.target.value }))
                }
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              >
                {ALERT_SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="alert-message"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Message
            </label>
            <textarea
              id="alert-message"
              rows={3}
              value={broadcastForm.message}
              onChange={(e) =>
                setBroadcastForm((f) => ({ ...f, message: e.target.value }))
              }
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="alert-zone"
                className="mb-1 block text-sm font-medium text-espresso-800"
              >
                Target zone{" "}
                <span className="font-normal text-espresso-500">
                  (optional)
                </span>
              </label>
              <input
                id="alert-zone"
                value={broadcastForm.targetZone}
                onChange={(e) =>
                  setBroadcastForm((f) => ({
                    ...f,
                    targetZone: e.target.value,
                  }))
                }
                placeholder="All Districts"
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="alert-expiry"
                className="mb-1 block text-sm font-medium text-espresso-800"
              >
                Expires in (hours)
              </label>
              <input
                id="alert-expiry"
                type="number"
                min="1"
                value={broadcastForm.expiresInHours}
                onChange={(e) =>
                  setBroadcastForm((f) => ({
                    ...f,
                    expiresInHours: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              />
            </div>
          </div>

          {broadcastError && (
            <p className="text-sm text-red-600">{broadcastError}</p>
          )}
          {broadcastSuccess && (
            <p className="text-sm text-green-700">
              Alert broadcast successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={broadcasting}
            className="self-start rounded-lg bg-espresso-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-espresso-800 disabled:opacity-60"
          >
            {broadcasting ? "Broadcasting…" : "Broadcast"}
          </button>
        </form>
      )}

      <form
        onSubmit={applyFilters}
        className="mt-6 flex flex-col gap-3 rounded-xl border border-espresso-200/60 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="filter-zone"
            className="mb-1 block text-xs font-medium text-espresso-700"
          >
            Zone
          </label>
          <input
            id="filter-zone"
            value={filters.zone}
            onChange={(e) =>
              setFilters((f) => ({ ...f, zone: e.target.value }))
            }
            placeholder="e.g. Oak Ridge"
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="filter-severity"
            className="mb-1 block text-xs font-medium text-espresso-700"
          >
            Severity
          </label>
          <select
            id="filter-severity"
            value={filters.severity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, severity: e.target.value }))
            }
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          >
            <option value="">All severities</option>
            {ALERT_SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-espresso-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-espresso-800"
        >
          Apply
        </button>
      </form>

      <div className="mt-6">
        {status === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-espresso-100 bg-white"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => load(filters)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && alerts.length === 0 && (
          <div className="rounded-xl border border-dashed border-espresso-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-espresso-900">
              No active alerts
            </p>
            <p className="mt-1 text-sm text-espresso-600">
              There are no safety alerts matching these filters right now.
            </p>
          </div>
        )}

        {status === "success" && alerts.length > 0 && (
          <ul className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-xs text-espresso-500">
                    {formatDateTime(alert.createdAt)}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-espresso-950">
                  {alert.title}
                </h3>
                <p className="mt-1 text-sm text-espresso-700">
                  {alert.message}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-espresso-500">
                  {alert.targetZone && <span>Zone: {alert.targetZone}</span>}
                  {alert.broadcastBy?.name && (
                    <span>By {alert.broadcastBy.name}</span>
                  )}
                  {alert.expiresAt && (
                    <span>Expires {formatDateTime(alert.expiresAt)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
