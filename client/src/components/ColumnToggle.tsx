import type { CandidateKey, ColumnsConfig } from "../types/api";
import { useTranslation } from "../i18n/useTranslation";
import { COLUMN_LABEL } from "../i18n/columnLabels";

type Props = {
  baseColumns: ColumnsConfig;
  visible: ColumnsConfig;
  onToggle: (key: CandidateKey) => void;
};

export function ColumnToggle({ baseColumns, visible, onToggle }: Props) {
  const { t } = useTranslation();
  const allKeys = Object.keys(baseColumns) as CandidateKey[];
  const visibleCount = allKeys.filter((k) => visible[k] === true).length;

  return (
    <details className="group relative">
      <summary className="inline-flex cursor-pointer select-none list-none items-center gap-2 border border-rule bg-canvas/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink group-open:border-accent group-open:text-accent">
        <span>{t("columns.label")}</span>
        <span className="tabular-nums text-ink-3 group-open:text-accent">
          {visibleCount.toString().padStart(2, "0")} / {allKeys.length.toString().padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className="text-ink-3 group-open:rotate-180 group-open:text-accent transition-transform"
        >
          ▾
        </span>
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-72 border border-rule bg-surface shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] animate-rise-in">
        <div className="flex items-center justify-between border-b border-rule px-3 py-2">
          <p className="eyebrow">{t("columns.heading")}</p>
          <span className="font-mono text-[10px] text-ink-3">
            {t("columns.totalHint", { count: allKeys.length })}
          </span>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {allKeys.map((key) => {
            const checked = visible[key] === true;
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 transition-colors hover:bg-surface-2">
                  <span className="text-[12px] text-ink-2">
                    {t(COLUMN_LABEL[key])}
                  </span>
                  <span
                    aria-hidden
                    className={
                      checked
                        ? "inline-flex h-4 w-7 items-center justify-end border border-accent bg-accent/20 px-0.5"
                        : "inline-flex h-4 w-7 items-center justify-start border border-rule px-0.5"
                    }
                  >
                    <span
                      className={
                        checked
                          ? "inline-block h-2.5 w-2.5 bg-accent"
                          : "inline-block h-2.5 w-2.5 bg-ink-4"
                      }
                    />
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(key)}
                    className="sr-only"
                  />
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
