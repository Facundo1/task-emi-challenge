import clsx from "clsx";
import { useTranslation } from "../i18n/useTranslation";
import { LOCALES } from "../i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("language.switch")}
      className="inline-flex items-stretch divide-x divide-rule border border-rule bg-canvas/60"
    >
      {LOCALES.map((opt) => {
        const active = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLocale(opt.code)}
            aria-pressed={active}
            aria-label={opt.label}
            className={clsx(
              "px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors focus-ring",
              active
                ? "bg-accent text-canvas"
                : "text-ink-3 hover:bg-surface-2 hover:text-ink"
            )}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
}
