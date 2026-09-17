import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { CHECKPOINT_STATUSES, formatDateTime } from "../lib/constants.js";

const patrolStatusStyle = {
  active: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-green-50 text-green-700 ring-green-200",
  scheduled: "bg-amber-50 text-amber-700 ring-amber-200",
};

function StartPatrolForm({ onStarted }) {
  const [form, setForm] = useState({ zone: "", initialNotes: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.zone.trim()) {
      setError("Zone is required to start a patrol.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/patrols/start", {
        zone: form.zone.trim(),
        initialNotes: form.initialNotes.trim(),
      });
      setForm({ zone: "", initialNotes: "" });
      await onStarted();
    } catch (err) {
      setError(err.message || "Couldn't start the patrol.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="patrol-zone"
          className="mb-1 block text-xs font-medium text-espresso-700"
        >
          Zone
        </label>
        <input
          id="patrol-zone"
          value={form.zone}
          onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
          placeholder="Oak Ridge Sector B"
          className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
        />
      </div>
      <div className="flex-[2]">
        <label
          htmlFor="patrol-notes"
          className="mb-1 block text-xs font-medium text-espresso-700"
        >
          Initial notes (optional)
        </label>
        <input
          id="patrol-notes"
          value={form.initialNotes}
          onChange={(e) =>
            setForm((f) => ({ ...f, initialNotes: e.target.value }))
          }
          placeholder="Commencing standard night sweep"
          className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:opacity-60"
      >
        {submitting ? "Starting…" : "Start patrol"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}

function CheckpointForm({ patrolId, onLogged }) {
  const [form, setForm] = useState({ name: "", status: "clear", notes: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Checkpoint name is required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/patrols/${patrolId}/checkpoint`, form);
      setForm({ name: "", status: "clear", notes: "" });
      setOpen(false);
      await onLogged();
    } catch (err) {
      setError(err.message || "Couldn't log the checkpoint.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-espresso-200 px-3 py-1.5 text-sm font-medium text-espresso-700 transition hover:bg-cream-100"
      >
        Log checkpoint
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col gap-2 rounded-lg border border-espresso-200 bg-cream-50 p-3"
    >
      <input
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Checkpoint name (e.g. School playground)"
        className="rounded-lg border border-espresso-200 bg-white px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="flex-1 rounded-lg border border-espresso-200 bg-white px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none"
        >
          {CHECKPOINT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-espresso-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-espresso-200 px-3 py-1.5 text-sm text-espresso-700"
        >
          Cancel
        </button>
      </div>
      <input
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        placeholder="Notes (optional)"
        className="rounded-lg border border-espresso-200 bg-white px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

function EndPatrolForm({ patrolId, onEnded }) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post(`/patrols/${patrolId}/end`, { summary: summary.trim() });
      await onEnded();
    } catch (err) {
      setError(err.message || "Couldn't end the patrol.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col gap-2 sm:flex-row"
    >
      <input
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Summary (e.g. 4 checkpoints cleared, no anomalies)"
        className="flex-1 rounded-lg border border-espresso-200 bg-white px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {submitting ? "Ending…" : "End patrol"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default function Patrols() {
  const { user } = useAuth();
  const [patrols, setPatrols] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const canManage = user?.role === "patrol_officer" || user?.role === "admin";

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await api.get("/patrols");
      setPatrols(Array.isArray(data) ? data : (data?.patrols ?? []));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Couldn't load patrols.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-espresso-950">Patrol shifts</h1>
      <p className="mt-1 text-sm text-espresso-600">
        Track active, scheduled, and completed patrol shifts.
      </p>

      {canManage && (
        <div className="mt-6">
          <StartPatrolForm onStarted={load} />
        </div>
      )}

      <div className="mt-6">
        {status === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-espresso-100 bg-white"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={load}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && patrols.length === 0 && (
          <div className="rounded-xl border border-dashed border-espresso-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-espresso-900">
              No patrol shifts yet
            </p>
            <p className="mt-1 text-sm text-espresso-600">
              {canManage
                ? "Start a patrol above to begin tracking a shift."
                : "Check back once a patrol shift is active."}
            </p>
          </div>
        )}

        {status === "success" && patrols.length > 0 && (
          <ul className="flex flex-col gap-4">
            {patrols.map((patrol) => (
              <li
                key={patrol.id}
                className="rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-espresso-950">
                      {patrol.zone}
                    </h3>
                    <p className="text-sm text-espresso-600">
                      Officer: {patrol.officerName}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                      patrolStatusStyle[patrol.status] ||
                      "bg-stone-100 text-stone-700 ring-stone-200"
                    }`}
                  >
                    {patrol.status}
                  </span>
                </div>

                <div className="mt-2 text-xs text-espresso-500">
                  Started {formatDateTime(patrol.startTime)}
                  {patrol.endTime
                    ? ` · Ended ${formatDateTime(patrol.endTime)}`
                    : ""}
                </div>

                {Array.isArray(patrol.checkpoints) &&
                  patrol.checkpoints.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5 border-t border-espresso-100 pt-3 text-sm">
                      {patrol.checkpoints.map((cp, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-center gap-2 text-espresso-700"
                        >
                          <span className="font-medium text-espresso-900">
                            {cp.name}
                          </span>
                          <span className="text-xs capitalize text-espresso-500">
                            {cp.status?.replace("_", " ")}
                          </span>
                          {cp.notes && (
                            <span className="text-xs text-espresso-500">
                              — {cp.notes}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                {patrol.summary && (
                  <p className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-sm text-espresso-700">
                    {patrol.summary}
                  </p>
                )}

                {canManage && patrol.status === "active" && (
                  <div className="mt-4 flex flex-wrap items-start gap-3 border-t border-espresso-100 pt-3">
                    <CheckpointForm patrolId={patrol.id} onLogged={load} />
                    <EndPatrolForm patrolId={patrol.id} onEnded={load} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
