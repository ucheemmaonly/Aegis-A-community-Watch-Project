import { STATUS_STYLES, STATUSES, labelFor } from "../lib/constants.js";

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.reported;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.bg} ${style.text} ${style.ring}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {labelFor(STATUSES, status)}
    </span>
  );
}
