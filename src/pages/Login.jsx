import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Couldn't sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-espresso-950">Welcome back</h1>
      <p className="mt-1 text-sm text-espresso-600">
        Sign in to report and track neighborhood incidents.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
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
          />
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
            autoComplete="current-password"
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-accent-500 focus:outline-none"
            placeholder="••••••••"
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-600">
        New to Community Watch?{" "}
        <Link
          to="/register"
          className="font-medium text-accent-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
