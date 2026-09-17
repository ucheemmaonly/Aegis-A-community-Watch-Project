import {
  SEVERITY_STYLES,
  ALERT_SEVERITIES,
  labelFor,
} from "../lib/constants.js";

export default function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${style.bg} ${style.text} ${style.ring}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {labelFor(ALERT_SEVERITIES, severity)}
    </span>
  );
}
