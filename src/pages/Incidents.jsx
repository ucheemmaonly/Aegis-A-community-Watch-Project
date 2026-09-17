import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../lib/api.js";
import IncidentCard from "../components/IncidentCard.jsx";
import { CATEGORIES, PRIORITIES, STATUSES } from "../lib/constants.js";

const initialFilters = { search: "", status: "", category: "", priority: "", zone: "" };

export default function Incidents() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [incidents, setIncidents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  const load = useCallback(async (f) => {
    setStatus("loading");
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.status) params.set("status", f.status);
      if (f.category) params.set("category", f.category);
      if (f.priority) params.set("priority", f.priority);
      if (f.zone) params.set("zone", f.zone);
      const qs = params.toString();
      const data = await api.get(`/incidents${qs ? `?${qs}` : ""}`);
      const list = Array.isArray(data) ? data : data?.incidents ?? [];
      setIncidents(list);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Couldn't load incidents.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(appliedFilters);
  }, [appliedFilters, load]);

  function handleFilterChange(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleApply(e) {
    e.preventDefault();
    setAppliedFilters(filters);
  }

  function handleClear() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-espresso-950">Neighborhood incidents</h1>
          <p className="mt-1 text-sm text-espresso-600">Browse, search, and filter reports from your community.</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700"
        >
          Report an incident
        </Link>
      </div>

      {/* Filters -- stack on mobile, row on larger screens */}
      <form
        onSubmit={handleApply}
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-espresso-200/60 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6"
      >
        <div className="lg:col-span-2">
          <label htmlFor="search" className="mb-1 block text-xs font-medium text-espresso-700">
            Search
          </label>
          <input
            id="search"
            value={filters.search}
            onChange={handleFilterChange("search")}
            placeholder="Search title or description…"
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-xs font-medium text-espresso-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={handleFilterChange("status")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-medium text-espresso-700">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleFilterChange("category")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block text-xs font-medium text-espresso-700">
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={handleFilterChange("priority")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="zone" className="mb-1 block text-xs font-medium text-espresso-700">
            Zone
          </label>
          <input
            id="zone"
            value={filters.zone}
            onChange={handleFilterChange("zone")}
            placeholder="e.g. Oak Ridge"
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div className="flex items-end gap-2 lg:col-span-6">
          <button
            type="submit"
            className="rounded-lg bg-espresso-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-espresso-800"
          >
            Apply filters
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-espresso-200 px-4 py-2 text-sm font-medium text-espresso-700 transition hover:bg-cream-100"
            >
              Clear all
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      <div className="mt-6">
        {status === "loading" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl border border-espresso-100 bg-white" />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => load(appliedFilters)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && incidents.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-espresso-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-espresso-900">No incidents match these filters</p>
            <p className="max-w-sm text-sm text-espresso-600">
              Try clearing a filter or broadening your search to see more reports.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="mt-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {status === "success" && incidents.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
