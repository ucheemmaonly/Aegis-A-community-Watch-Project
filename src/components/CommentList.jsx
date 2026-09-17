import { useState } from "react";
import { formatDateTime } from "../lib/constants.js";

export default function CommentList({
  comments = [],
  onSubmit,
  submitting,
  currentUser,
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Write a comment before submitting.");
      return;
    }
    try {
      await onSubmit(trimmed);
      setMessage("");
    } catch (err) {
      setError(err.message || "Couldn't post your comment. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-espresso-950">
        Comments{" "}
        {comments.length > 0 && (
          <span className="text-espresso-500">({comments.length})</span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-espresso-200 bg-cream-100/60 px-4 py-6 text-center text-sm text-espresso-600">
          No comments yet. Be the first to share an update.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-espresso-100 bg-white p-4 text-sm shadow-sm"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-espresso-900">
                  {comment.userName || "Resident"}
                </span>
                {comment.userRole && (
                  <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[11px] font-medium capitalize text-espresso-700">
                    {comment.userRole.replace("_", " ")}
                  </span>
                )}
                <span className="text-xs text-espresso-500">
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-espresso-800">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}

      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-espresso-800"
          >
            Add a comment
          </label>
          <textarea
            id="comment"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share an update or additional detail…"
            className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm text-espresso-950 shadow-sm focus:border-accent-500 focus:outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-espresso-600">
          <a
            href="/login"
            className="font-medium text-accent-600 hover:underline"
          >
            Sign in
          </a>{" "}
          to add a comment.
        </p>
      )}
    </div>
  );
}
