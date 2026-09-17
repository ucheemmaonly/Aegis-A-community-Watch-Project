import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";
import CommentList from "../components/CommentList.jsx";
import { CATEGORIES, STATUSES, labelFor, formatDateTime } from "../lib/constants.js";

export default function IncidentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error | notfound
  const [error, setError] = useState(null);

  const [upvoting, setUpvoting] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [statusForm, setStatusForm] = useState({ status: "", notes: "" });
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await api.get(`/incidents/${id}`);
      const inc = data?.incident ?? data;
      setIncident(inc);
      setStatusForm({ status: inc?.status || "", notes: "" });
      setStatus("success");
    } catch (err) {
      if (err.status === 404) {
        setStatus("notfound");
      } else {
        setError(err.message || "Couldn't load this incident.");
        setStatus("error");
      }
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner =
    user && incident && (incident.reportedBy?.userId === user.id || incident.reportedBy?.id === user.id);
  const canManageStatus = user && (user.role === "patrol_officer" || user.role === "admin");

  async function handleUpvote() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/incidents/${id}` } } });
      return;
    }
    if (upvoting) return;
    setUpvoting(true);
    try {
      await api.post(`/incidents/${id}/upvote`);
      await load();
    } catch (err) {
      setError(err.message || "Couldn't register your upvote.");
    } finally {
      setUpvoting(false);
    }
  }

  async function handleAddComment(message) {
    setCommentSubmitting(true);
    try {
      await api.post(`/incidents/${id}/comments`, { message });
      await load();
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/incidents/${id}`);
      navigate("/incidents", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Couldn't delete this incident.");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusUpdate(e) {
    e.preventDefault();
    setStatusError(null);
    setStatusSaving(true);
    try {
      await api.patch(`/incidents/${id}/status`, {
        status: statusForm.status,
        notes: statusForm.notes || undefined,
      });
      setStatusForm((f) => ({ ...f, notes: "" }));
      await load();
    } catch (err) {
      setStatusError(err.message || "Couldn't update the status.");
    } finally {
      setStatusSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-8 w-2/3 animate-pulse rounded bg-espresso-100" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-espresso-100" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-espresso-950">Incident not found</h1>
        <p className="mt-2 text-espresso-600">This report may have been removed, or the link is incorrect.</p>
        <Link to="/incidents" className="mt-6 inline-block font-medium text-accent-600 hover:underline">
          ← Back to incidents
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={load}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const upvoteCount = Array.isArray(incident.upvotes) ? incident.upvotes.length : incident.upvotes ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/incidents" className="text-sm font-medium text-accent-600 hover:underline">
        ← Back to incidents
      </Link>

      <div className="mt-4 rounded-xl border border-espresso-200/60 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={incident.status} />
          <PriorityBadge priority={incident.priority} />
          <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs font-medium text-espresso-700">
            {labelFor(CATEGORIES, incident.category)}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-espresso-950">{incident.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-espresso-800">{incident.description}</p>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-espresso-100 pt-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-espresso-500">Location</dt>
            <dd className="font-medium text-espresso-900">
              {incident.location?.address || "—"}
              {incident.location?.zone ? ` · ${incident.location.zone}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-espresso-500">Reported by</dt>
            <dd className="font-medium text-espresso-900">{incident.reportedBy?.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-espresso-500">Assigned officer</dt>
            <dd className="font-medium text-espresso-900">{incident.assignedTo?.name || "Not yet assigned"}</dd>
          </div>
          <div>
            <dt className="text-espresso-500">Confirmations</dt>
            <dd className="font-medium text-espresso-900">{incident.confirmationsCount ?? 0}</dd>
          </div>
          <div>
            <dt className="text-espresso-500">Reported</dt>
            <dd className="font-medium text-espresso-900">{formatDateTime(incident.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-espresso-500">Last updated</dt>
            <dd className="font-medium text-espresso-900">{formatDateTime(incident.updatedAt)}</dd>
          </div>
        </dl>

        {Array.isArray(incident.images) && incident.images.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {incident.images.map((src, i) => (
              <img key={i} src={src} alt={`Incident evidence ${i + 1}`} className="h-28 w-full rounded-lg object-cover" />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-espresso-100 pt-5">
          <button
            onClick={handleUpvote}
            disabled={upvoting}
            className="inline-flex items-center gap-2 rounded-lg border border-espresso-200 px-4 py-2 text-sm font-semibold text-espresso-800 transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {upvoting ? "Updating…" : `Upvote (${upvoteCount})`}
          </button>

          {isOwner && (
            <div className="ml-auto">
              {!confirmingDelete ? (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete incident
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-espresso-700">Delete this report?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg border border-espresso-200 px-3 py-1.5 text-sm font-medium text-espresso-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {deleteError && <p className="mt-2 text-sm text-red-600">{deleteError}</p>}
      </div>

      
      {canManageStatus && (
        <div className="mt-6 rounded-xl border border-espresso-200/60 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-espresso-950">Update status</h2>
          <form onSubmit={handleStatusUpdate} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="status-select" className="mb-1 block text-xs font-medium text-espresso-700">
                Status
              </label>
              <select
                id="status-select"
                value={statusForm.status}
                onChange={(e) => setStatusForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-[2]">
              <label htmlFor="status-notes" className="mb-1 block text-xs font-medium text-espresso-700">
                Notes (optional)
              </label>
              <input
                id="status-notes"
                value={statusForm.notes}
                onChange={(e) => setStatusForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                placeholder="e.g. Patrol dispatched to verify"
              />
            </div>
            <button
              type="submit"
              disabled={statusSaving}
              className="rounded-lg bg-espresso-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-espresso-800 disabled:opacity-60"
            >
              {statusSaving ? "Saving…" : "Update"}
            </button>
          </form>
          {statusError && <p className="mt-2 text-sm text-red-600">{statusError}</p>}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-espresso-200/60 bg-white p-6 shadow-sm">
        <CommentList
          comments={incident.comments || []}
          onSubmit={handleAddComment}
          submitting={commentSubmitting}
          currentUser={user}
        />
      </div>
    </div>
  );
}
