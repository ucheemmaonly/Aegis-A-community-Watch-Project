import { PRIORITY_STYLES, PRIORITIES, labelFor } from "../lib/constants.js";

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.low;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.bg} ${style.text} ${style.ring}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {labelFor(PRIORITIES, priority)} priority
    </span>
  );
}
