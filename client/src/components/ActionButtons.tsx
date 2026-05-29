import clsx from "clsx";
import type { Candidate } from "../types/api";
import { isApproved } from "../lib/classifications";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  candidate: Candidate;
  onApprove: () => void;
  onReject: () => void;
  isPending: boolean;
};

export function ActionButtons({ candidate, onApprove, onReject, isPending }: Props) {
  const { t } = useTranslation();
  const approved = isApproved(candidate);

  return (
    <div className="inline-flex items-stretch divide-x divide-rule border border-rule bg-canvas/40">
      <button
        type="button"
        onClick={onApprove}
        disabled={approved || isPending}
        aria-label={t("action.approve.aria", { name: candidate.name })}
        className={clsx(
          "group/btn relative px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors focus-ring",
          "text-accent hover:bg-accent hover:text-canvas",
          "disabled:cursor-not-allowed disabled:text-ink-4 disabled:hover:bg-transparent"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden>+</span>
          {t("action.approve")}
        </span>
      </button>
      <button
        type="button"
        onClick={onReject}
        disabled={isPending}
        aria-label={t("action.reject.aria", { name: candidate.name })}
        className={clsx(
          "group/btn relative px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors focus-ring",
          "text-alarm hover:bg-alarm hover:text-canvas",
          "disabled:cursor-not-allowed disabled:text-ink-4 disabled:hover:bg-transparent"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden>×</span>
          {t("action.reject")}
        </span>
      </button>
    </div>
  );
}
