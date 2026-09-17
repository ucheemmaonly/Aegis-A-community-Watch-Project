import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-espresso-950">
        Page not found
      </h1>
      <p className="mt-2 text-espresso-600">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
      >
        Back to home
      </Link>
    </div>
  );
}
