import { useTranslation } from "../i18n/useTranslation";
import { StatCell } from "./StatCell";

type Props = {
  total: number;
  approved: number;
  rejected: number;
  rate: number;
  visibleCount: number;
};

export function StatsStrip({ total, approved, rejected, rate, visibleCount }: Props) {
  const { t, locale } = useTranslation();
  const numberLocale = locale === "es" ? "es-AR" : "en-US";

  return (
    <section className="mt-10 animate-rise-in [animation-delay:80ms]">
      <p className="eyebrow">{t("stats.section")}</p>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule md:grid-cols-4">
        <StatCell
          labelKey="stats.total"
          hintKey="stats.hint.total"
          value={total.toLocaleString(numberLocale)}
        />
        <StatCell
          labelKey="stats.approved"
          hintKey="stats.hint.approved"
          value={approved.toLocaleString(numberLocale)}
          accent="accent"
        />
        <StatCell
          labelKey="stats.rejected"
          hintKey="stats.hint.rejected"
          value={rejected.toLocaleString(numberLocale)}
          accent="alarm"
        />
        <StatCell
          labelKey="stats.rate"
          hintKey="stats.hint.rate"
          hintParams={{ count: visibleCount }}
          value={rate.toLocaleString(numberLocale)}
          suffix="%"
        />
      </div>
    </section>
  );
}
