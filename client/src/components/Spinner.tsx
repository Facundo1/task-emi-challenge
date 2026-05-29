import { useTranslation } from "../i18n/useTranslation";

export function Spinner() {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-24"
      role="status"
      aria-label={t("spinner.loading")}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 border border-rule" />
        <div className="absolute inset-0 border-t border-accent animate-spin" />
        <div className="absolute inset-1 border border-rule" />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-3 animate-pulse-dot">
        {t("spinner.loading")}
      </p>
    </div>
  );
}
