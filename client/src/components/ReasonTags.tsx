import { useState } from "react";
import { parseReasons } from "../lib/classifications";
import { translateReason, type Locale } from "../i18n/translations";

const MAX_VISIBLE_REASONS = 2;

type Props = { value: string; locale: Locale };

export function ReasonTags({ value, locale }: Props) {
  const [expanded, setExpanded] = useState(false);
  const reasons = parseReasons(value);

  if (reasons.length === 0) {
    return <span className="font-mono text-xs text-ink-4">—</span>;
  }

  const overflow = reasons.length - MAX_VISIBLE_REASONS;
  const visible = expanded ? reasons : reasons.slice(0, MAX_VISIBLE_REASONS);

  return (
    <div className="flex flex-col items-start gap-1">
      {visible.map((reason) => (
        <span
          key={reason}
          className="border border-alarm/30 bg-alarm/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-alarm/80"
        >
          {translateReason(reason, locale)}
        </span>
      ))}
      {!expanded && overflow > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="border border-alarm/30 bg-alarm/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-alarm/70 transition-colors hover:border-alarm/60 hover:bg-alarm/10 hover:text-alarm"
        >
          +{overflow}
        </button>
      )}
      {expanded && reasons.length > MAX_VISIBLE_REASONS && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="border border-rule bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-3 transition-colors hover:border-ink-3 hover:text-ink-2"
        >
          ↑
        </button>
      )}
    </div>
  );
}
