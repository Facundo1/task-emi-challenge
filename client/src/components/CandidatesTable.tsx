import { useMemo } from "react";
import clsx from "clsx";
import type { Candidate, CandidateKey, ColumnsConfig } from "../types/api";
import { ActionButtons } from "./ActionButtons";
import { StatusCell } from "./StatusCell";
import { TableCell } from "./TableCell";
import { isApproved } from "../lib/classifications";
import { useTranslation } from "../i18n/useTranslation";
import { COLUMN_WIDTH } from "../lib/tableConfig";
import { COLUMN_LABEL } from "../i18n/columnLabels";

type Props = {
  candidates: Candidate[];
  columns: ColumnsConfig;
  pendingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function CandidatesTable({
  candidates,
  columns,
  pendingId,
  onApprove,
  onReject,
}: Props) {
  const { t, locale } = useTranslation();

  const visibleColumns = useMemo<CandidateKey[]>(
    () =>
      (Object.entries(columns) as Array<[CandidateKey, boolean | undefined]>)
        .filter(([, visible]) => visible === true)
        .map(([key]) => key),
    [columns]
  );

  if (candidates.length === 0) {
    return (
      <div className="border border-dashed border-rule-strong bg-surface/40 px-8 py-16 text-center">
        <p className="font-display text-2xl italic text-ink-2">
          {t("table.empty.title")}
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink-3">
          {t("table.empty.hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-rule bg-surface/60">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rule">
            <th
              scope="col"
              data-column="status"
              className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-3"
            >
              {t("table.column.status")}
            </th>
            {visibleColumns.map((col) => (
              <th
                key={col}
                scope="col"
                data-column={col}
                className={clsx(
                  "whitespace-nowrap px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-3",
                  COLUMN_WIDTH[col]
                )}
              >
                {t(COLUMN_LABEL[col])}
              </th>
            ))}
            <th
              scope="col"
              data-column="actions"
              className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-ink-3"
            >
              {t("table.column.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => {
            const approved = isApproved(candidate);
            const isPending = pendingId === candidate.id;
            return (
              <tr
                key={candidate.id}
                className={clsx(
                  "group border-b border-rule/60 transition-colors last:border-0",
                  "hover:bg-surface-2",
                  isPending && "opacity-60"
                )}
              >
                <td className="relative px-4 py-4 align-top">
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute left-0 top-0 h-full w-[3px]",
                      approved ? "bg-accent" : "bg-alarm"
                    )}
                  />
                  <StatusCell approved={approved} />
                </td>
                {visibleColumns.map((col) => (
                  <td key={col} className={clsx("px-4 py-4 align-top", COLUMN_WIDTH[col])}>
                    <TableCell
                      value={candidate[col]}
                      keyName={col}
                      locale={locale}
                    />
                  </td>
                ))}
                <td className="px-4 py-4 text-right align-top">
                  <ActionButtons
                    candidate={candidate}
                    onApprove={() => onApprove(candidate.id)}
                    onReject={() => onReject(candidate.id)}
                    isPending={isPending}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
