import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

const initialForm = { name: "", email: "", password: "", zone: "", phone: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8)
      errs.password = "Use at least 8 characters.";
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
      // Normal registration UI always creates a resident account.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "resident",
        ...(form.zone.trim() ? { zone: form.zone.trim() } : {}),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      };
      await register(payload);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        err.message || "Couldn't create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-espresso-950">
        Create your resident account
      </h1>
      <p className="mt-1 text-sm text-espresso-600">
        Join Community Watch to report incidents and stay informed about your
        neighborhood.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-espresso-800"
          >
            Full name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={update("name")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            placeholder="Jordan Lee"
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-espresso-800"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            placeholder="you@example.com"
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-espresso-800"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            placeholder="At least 8 characters"
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
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
              className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
              placeholder="North Maple District"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-espresso-800"
            >
              Phone{" "}
              <span className="font-normal text-espresso-500">(optional)</span>
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
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-200"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-accent-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
