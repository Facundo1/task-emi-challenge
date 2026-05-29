import { useTranslation } from "../i18n/useTranslation";
import { buildPageItems } from "../lib/pagination";
import { PageButton } from "./PageButton";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, totalItems, perPage, onPageChange }: Props) {
  const { t, locale } = useTranslation();
  const numberLocale = locale === "es" ? "es-AR" : "en-US";

  if (totalItems === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  const items = buildPageItems(page, totalPages);

  return (
    <nav
      className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4"
      aria-label="Pagination"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink-3 tabular-nums">
        {t("pagination.showing", {
          from: from.toLocaleString(numberLocale),
          to: to.toLocaleString(numberLocale),
          total: totalItems.toLocaleString(numberLocale),
        })}
      </p>

      <div className="flex items-stretch divide-x divide-rule border border-rule bg-canvas/60">
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          ariaLabel={t("pagination.previous.aria")}
        >
          <span aria-hidden className="mr-1">‹</span>
          {t("pagination.previous")}
        </PageButton>

        {items.map((item, idx) =>
          item === "…" ? (
            <span
              key={`gap-${idx}`}
              className="flex w-9 items-center justify-center font-mono text-[11px] text-ink-3"
              aria-hidden
            >
              …
            </span>
          ) : (
            <PageButton
              key={item}
              active={item === page}
              onClick={() => onPageChange(item)}
              ariaLabel={t("pagination.page.aria", { page: item })}
              ariaCurrent={item === page ? "page" : undefined}
            >
              <span className="tabular-nums">
                {item.toString().padStart(2, "0")}
              </span>
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          ariaLabel={t("pagination.next.aria")}
        >
          {t("pagination.next")}
          <span aria-hidden className="ml-1">›</span>
        </PageButton>
      </div>
    </nav>
  );
}
