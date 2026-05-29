import { useMemo } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MarqueeRow } from "./MarqueeRow";

type Props = {
  totalCount: number;
};

export function Masthead({ totalCount }: Props) {
  const { locale, t } = useTranslation();

  const issueDate = useMemo(
    () =>
      new Date().toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    [locale]
  );

  return (
    <header className="relative border-b border-rule-strong">
      <div className="mx-auto max-w-[1320px] px-6 pt-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-3 font-mono text-eyebrow uppercase text-ink-3">
            <span className="inline-block h-2 w-2 rotate-45 bg-accent" />
            <span>{t("masthead.issue")}</span>
            <span className="h-3 w-px bg-rule-strong" />
            <span>{issueDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <nav
              className="hidden items-center gap-6 font-mono text-eyebrow uppercase text-ink-3 md:flex"
              aria-label="Primary"
            >
              <a href="#" className="transition-colors hover:text-ink">{t("nav.desk")}</a>
              <a href="#" className="transition-colors hover:text-ink">{t("nav.pipeline")}</a>
              <a href="#" className="transition-colors hover:text-ink">{t("nav.insights")}</a>
              <a href="#" className="transition-colors hover:text-ink">{t("nav.settings")}</a>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="grid grid-cols-12 items-end gap-6 pb-8 pt-2">
          <div className="col-span-12 lg:col-span-9">
            <h1 className="font-display text-display-1 font-light text-ink">
              {t("masthead.title.prefix")}{" "}
              <span
                className="italic font-normal text-accent"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {t("masthead.title.accent")}
              </span>
              {t("masthead.title.suffix") ? <> {t("masthead.title.suffix")}</> : null}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">
              {t("masthead.tagline")}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <div className="border-l border-rule-strong pl-6">
              <p className="eyebrow">{t("masthead.inQueue")}</p>
              <p className="mt-2 font-display text-5xl font-light text-ink num">
                {totalCount.toLocaleString(locale === "es" ? "es-AR" : "en-US").padStart(3, "0")}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-3">
                {t("masthead.inQueueHint")}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-rule">
          <div className="flex min-w-max will-change-transform py-2 font-mono text-[11px] uppercase tracking-widest text-ink-3 animate-marquee">
            <MarqueeRow />
            <MarqueeRow aria-hidden />
            <MarqueeRow aria-hidden />
            <MarqueeRow aria-hidden />
          </div>
        </div>
      </div>
    </header>
  );
}
