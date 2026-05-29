import clsx from "clsx";
import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/translations";

export type StatusFilterValue = "all" | "approved" | "rejected";

type Props = {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
};

const OPTIONS: ReadonlyArray<{
  value: StatusFilterValue;
  labelKey: TranslationKey;
  symbol: string;
}> = [
  { value: "all", labelKey: "filter.all", symbol: "◆" },
  { value: "approved", labelKey: "filter.approved", symbol: "+" },
  { value: "rejected", labelKey: "filter.rejected", symbol: "×" },
];

export function StatusFilter({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="inline-flex items-stretch divide-x divide-rule border border-rule bg-canvas/60"
      role="group"
      aria-label={t("filter.aria")}
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors focus-ring",
              active
                ? "bg-ink text-canvas"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            )}
          >
            <span aria-hidden className={active ? "text-canvas" : "text-ink-3"}>
              {opt.symbol}
            </span>
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
