import { useTranslation } from "../i18n/useTranslation";

type Props = {
  error: Error;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorBanner({ error, onRetry, retryLabel }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-4 border border-alarm/40 bg-alarm/5 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center border border-alarm/50 font-mono text-[11px] text-alarm">
          !
        </span>
        <p className="min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-widest text-alarm">
            {t("error.label")} &middot;
          </span>{" "}
          <span className="truncate text-sm text-ink">{error.message}</span>
        </p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 border border-alarm/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-alarm transition-colors hover:bg-alarm hover:text-canvas focus-ring"
        >
          {retryLabel ?? t("error.retry")}
        </button>
      ) : null}
    </div>
  );
}
