import clsx from "clsx";
import { isApproved } from "../lib/classifications";
import type { Candidate } from "../types/api";
import { useTranslation } from "../i18n/useTranslation";

type Props = { candidate: Candidate };

export function StatusBadge({ candidate }: Props) {
  const { t } = useTranslation();
  const approved = isApproved(candidate);
  return (
    <span
      data-status={approved ? "approved" : "rejected"}
      className={clsx(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        approved
          ? "border-accent/40 bg-accent/5 text-accent"
          : "border-alarm/40 bg-alarm/5 text-alarm"
      )}
    >
      <span
        className={clsx(
          "inline-block h-1 w-1 rounded-full",
          approved ? "bg-accent" : "bg-alarm"
        )}
      />
      {approved ? t("status.approved") : t("status.rejected")}
    </span>
  );
}
