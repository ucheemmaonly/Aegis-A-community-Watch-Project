

export const CATEGORIES = [
  { value: "theft", label: "Theft" },
  { value: "vandalism", label: "Vandalism" },
  { value: "suspicious_activity", label: "Suspicious Activity" },
  { value: "hazard", label: "Hazard" },
  { value: "lost_and_found", label: "Lost & Found" },
  { value: "noise_complaint", label: "Noise Complaint" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const STATUSES = [
  { value: "reported", label: "Reported" },
  { value: "under_review", label: "Under Review" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

export const ALERT_SEVERITIES = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "emergency", label: "Emergency" },
];

export const CHECKPOINT_STATUSES = [
  { value: "clear", label: "Clear" },
  { value: "issue_noted", label: "Issue Noted" },
  { value: "hazard_resolved", label: "Hazard Resolved" },
];

// Priority -> severity color family (consistent everywhere: red/amber/blue/green)
export const PRIORITY_STYLES = {
  low: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  high: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", dot: "bg-orange-500" },
  critical: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-600" },
};

export const STATUS_STYLES = {
  reported: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200", dot: "bg-slate-500" },
  under_review: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  in_progress: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
  resolved: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200", dot: "bg-green-600" },
  dismissed: { bg: "bg-stone-100", text: "text-stone-500", ring: "ring-stone-200", dot: "bg-stone-400" },
};

export const SEVERITY_STYLES = {
  info: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  critical: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-600" },
  emergency: { bg: "bg-red-100", text: "text-red-800", ring: "ring-red-300", dot: "bg-red-700" },
};

export function labelFor(list, value) {
  return list.find((item) => item.value === value)?.label ?? value ?? "—";
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
