import clsx from "clsx";
import type { Candidate, CandidateKey } from "../types/api";
import { useTranslation } from "../i18n/useTranslation";
import type { Locale } from "../i18n/translations";
import { MONO_KEYS, YESNO_KEYS } from "../lib/tableConfig";
import { ReasonTags } from "./ReasonTags";

type Props = {
  value: Candidate[keyof Candidate];
  keyName: CandidateKey;
  locale: Locale;
};

export function TableCell({ value, keyName, locale }: Props) {
  const { t } = useTranslation();

  if (value === "" || value === null || value === undefined) {
    return <span className="font-mono text-xs text-ink-4">—</span>;
  }

  if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-ink"
      >
        {t("table.viewCV")}
        <span aria-hidden>↗</span>
      </a>
    );
  }

  if (keyName === "date" && typeof value === "string") {
    return (
      <span className="whitespace-nowrap font-mono text-[11px] tabular-nums text-ink-2">
        {value.trim().slice(0, 10)}
      </span>
    );
  }

  if (keyName === "desired_salary") {
    const numberLocale = locale === "es" ? "es-AR" : "en-US";
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return <span className="font-mono text-xs text-ink-4">—</span>;
    }
    return (
      <span className="font-mono text-[12px] tabular-nums text-ink">
        ${num.toLocaleString(numberLocale)}
      </span>
    );
  }

  if (keyName === "name") {
    return (
      <span className="font-display text-[15px] font-normal leading-tight text-ink">
        {String(value)}
      </span>
    );
  }

  if (keyName === "email") {
    return <span className="font-mono text-[11px] text-ink-2">{String(value)}</span>;
  }

  if (keyName === "reason" && typeof value === "string") {
    return <ReasonTags value={value} locale={locale} />;
  }

  if (YESNO_KEYS.has(keyName) && typeof value === "string") {
    if (value === "Si" || value === "Sí") {
      return (
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          {t("value.yes")}
        </span>
      );
    }
    if (value === "No") {
      return (
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-3">
          {t("value.no")}
        </span>
      );
    }
  }

  const isMono = MONO_KEYS.has(keyName);
  return (
    <span
      className={clsx(
        isMono
          ? "whitespace-nowrap font-mono text-[12px] tabular-nums text-ink"
          : "break-words text-[13px] text-ink-2"
      )}
    >
      {String(value)}
    </span>
  );
}
