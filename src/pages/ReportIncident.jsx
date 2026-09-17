import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../lib/api.js";
import { CATEGORIES, PRIORITIES } from "../lib/constants.js";

const initialForm = {
  title: "",
  description: "",
  category: "",
  priority: "medium",
  address: "",
  zone: "",
};

export default function ReportIncident() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Give the incident a short title.";
    else if (form.title.trim().length < 5)
      errs.title = "Title should be at least 5 characters.";
    if (!form.description.trim()) errs.description = "Describe what happened.";
    else if (form.description.trim().length < 10)
      errs.description = "Add a bit more detail (10+ characters).";
    if (!form.category) errs.category = "Select a category.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        ...(form.address.trim() || form.zone.trim()
          ? {
              location: {
                ...(form.address.trim()
                  ? { address: form.address.trim() }
                  : {}),
                ...(form.zone.trim() ? { zone: form.zone.trim() } : {}),
              },
            }
          : {}),
      };
      const created = await api.post("/incidents", payload);
      const incident = created?.incident ?? created;
      setSuccess(true);
      setTimeout(() => {
        if (incident?.id) navigate(`/incidents/${incident.id}`);
        else navigate("/incidents");
      }, 900);
    } catch (err) {
      setError(err.message || "Couldn't submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-espresso-950">
        Report an incident
      </h1>
      <p className="mt-1 text-sm text-espresso-600">
        Provide clear details so neighbors and patrols can understand and
        respond quickly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-5"
        noValidate
      >
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-espresso-800"
          >
            Title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={update("title")}
            placeholder="e.g. Suspicious vehicle near playground"
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            aria-invalid={!!fieldErrors.title}
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-espresso-800"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={update("description")}
            placeholder="What did you observe? Include time, behavior, and any other relevant detail."
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            aria-invalid={!!fieldErrors.description}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={update("category")}
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
              aria-invalid={!!fieldErrors.category}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Priority
            </label>
            <select
              id="priority"
              value={form.priority}
              onChange={update("priority")}
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Address{" "}
              <span className="font-normal text-espresso-500">(optional)</span>
            </label>
            <input
              id="address"
              value={form.address}
              onChange={update("address")}
              placeholder="104 Pine Tree Lane"
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="zone"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Zone{" "}
              <span className="font-normal text-espresso-500">(optional)</span>
            </label>
            <input
              id="zone"
              value={form.zone}
              onChange={update("zone")}
              placeholder="North Maple District"
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-200"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 ring-1 ring-inset ring-green-200"
          >
            Incident reported. Redirecting…
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}
