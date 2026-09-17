import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Profile() {
  const { user, refreshUser, updateProfile } = useAuth();
  const [status, setStatus] = useState(user ? "success" : "loading");
  const [form, setForm] = useState({ name: "", zone: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setStatus("loading");
        try {
          await refreshUser();
          if (!cancelled) setStatus("success");
        } catch {
          if (!cancelled) setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        zone: user.zone || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setSuccess(false);
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name.trim()) {
      setError("Name can't be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        zone: form.zone.trim(),
        phone: form.phone.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="h-6 w-40 animate-pulse rounded bg-espresso-100" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-espresso-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-espresso-700">
          We couldn't load your profile. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-espresso-950">Your profile</h1>
      <p className="mt-1 text-sm text-espresso-600">
        Keep your contact details current so patrols and neighbors can reach
        you.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm">
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-espresso-500">Email</dt>
              <dd className="font-medium text-espresso-950">{user.email}</dd>
            </div>
            <div>
              <dt className="text-espresso-500">Role</dt>
              <dd className="font-medium capitalize text-espresso-950">
                {user.role?.replace("_", " ")}
              </dd>
            </div>
            {user.role !== "resident" && user.badgeNumber && (
              <div>
                <dt className="text-espresso-500">Badge number</dt>
                <dd className="font-medium text-espresso-950">
                  {user.badgeNumber}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-espresso-500">Member since</dt>
              <dd className="font-medium text-espresso-950">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={update("name")}
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="zone"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Zone
            </label>
            <input
              id="zone"
              value={form.zone}
              onChange={update("zone")}
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
              placeholder="North Maple District"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
              placeholder="+1-555-0100"
            />
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
              Profile updated.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
