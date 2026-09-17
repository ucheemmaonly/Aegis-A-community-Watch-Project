import { Link } from "react-router";
import StatusBadge from "./StatusBadge.jsx";
import PriorityBadge from "./PriorityBadge.jsx";
import { labelFor, CATEGORIES, formatDate } from "../lib/constants.js";

export default function IncidentCard({ incident }) {
  const upvoteCount = Array.isArray(incident.upvotes)
    ? incident.upvotes.length
    : (incident.upvotes ?? 0);
  const commentCount = Array.isArray(incident.comments)
    ? incident.comments.length
    : (incident.comments ?? 0);

  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-espresso-200/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={incident.status} />
        <PriorityBadge priority={incident.priority} />
      </div>

      <h3 className="text-lg font-semibold text-espresso-950 group-hover:text-accent-600">
        {incident.title}
      </h3>

      {incident.description && (
        <p className="line-clamp-2 text-sm text-espresso-700">
          {incident.description}
        </p>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-espresso-600">
        <span className="inline-flex items-center gap-1">
          <span className="font-medium text-espresso-800">
            {labelFor(CATEGORIES, incident.category)}
          </span>
        </span>
        {incident.location?.address && (
          <span className="inline-flex items-center gap-1">
            📍 {incident.location.address}
          </span>
        )}
        {incident.location?.zone && (
          <span className="inline-flex items-center gap-1">
            Zone: {incident.location.zone}
          </span>
        )}
        <span>{formatDate(incident.createdAt)}</span>
      </div>

      <div className="mt-2 flex items-center gap-4 border-t border-espresso-100 pt-3 text-sm text-espresso-700">
        <span className="inline-flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M12 19V5M5 12l7-7 7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {upvoteCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {commentCount}
        </span>
        {incident.reportedBy?.name && (
          <span className="ml-auto text-espresso-500">
            Reported by {incident.reportedBy.name}
          </span>
        )}
      </div>
    </Link>
  );
}
