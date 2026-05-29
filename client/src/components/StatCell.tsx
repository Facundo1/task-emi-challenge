import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/translations";

type Props = {
  labelKey: TranslationKey;
  hintKey: TranslationKey;
  hintParams?: Record<string, string | number>;
  value: string;
  suffix?: string;
  accent?: "accent" | "alarm";
};

export function StatCell({ labelKey, hintKey, hintParams, value, suffix, accent }: Props) {
  const { t } = useTranslation();
  const valueColor =
    accent === "accent"
      ? "text-accent"
      : accent === "alarm"
      ? "text-alarm"
      : "text-ink";

  return (
    <div className="group relative bg-canvas px-5 py-6 transition-colors hover:bg-surface">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{t(labelKey)}</p>
        {accent ? (
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              accent === "accent" ? "bg-accent" : "bg-alarm"
            } animate-pulse-dot`}
          />
        ) : null}
      </div>
      <p
        className={`mt-3 font-display text-5xl font-light tabular-nums leading-none ${valueColor} num`}
      >
        {value}
        {suffix ? <span className="ml-1 text-2xl text-ink-3">{suffix}</span> : null}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ink-3">
        {t(hintKey, hintParams)}
      </p>
    </div>
  );
}
