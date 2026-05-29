import { useEffect, useMemo, useRef, useState } from "react";
import { useReasons } from "../hooks/useReasons";
import { Spinner } from "./Spinner";
import { ErrorBanner } from "./ErrorBanner";
import { parseReasons } from "../lib/classifications";
import { useTranslation } from "../i18n/useTranslation";
import { translateReason } from "../i18n/translations";

type Props = {
  candidateName: string;
  initialReason: string;
  onCancel: () => void;
  onConfirm: (reasons: string[]) => void;
};

export function RejectModal({ candidateName, initialReason, onCancel, onConfirm }: Props) {
  const { t, locale } = useTranslation();
  const { state, load } = useReasons();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(parseReasons(initialReason))
  );
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();
    return () => {
      previouslyFocusedElement.current?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const signedAt = useMemo(
    () =>
      new Date().toLocaleTimeString(locale === "es" ? "es-AR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale]
  );

  function toggle(reason: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  }

  function handleConfirm() {
    onConfirm(Array.from(selected));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/85 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg border border-rule-strong bg-surface shadow-[0_40px_120px_-30px_rgba(255,100,82,0.25)] animate-rise-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-title"
      >
        <div className="absolute -left-px top-0 h-full w-px bg-alarm/70" aria-hidden />

        <header className="flex items-start justify-between border-b border-rule px-6 py-5">
          <div>
            <p className="font-mono text-eyebrow uppercase tracking-widest text-alarm">
              {t("modal.reject.eyebrow")}
            </p>
            <h2
              id="reject-title"
              className="mt-2 font-display text-3xl font-light leading-tight text-ink"
            >
              {t("modal.reject.title.prefix")}{" "}
              <span className="italic text-alarm">{candidateName}</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-ink-2">
              {t("modal.reject.body")}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={t("modal.reject.close.aria")}
            className="border border-rule px-2 py-1 font-mono text-[11px] text-ink-3 transition-colors hover:border-ink hover:text-ink focus-ring"
          >
            {t("modal.reject.close")}
          </button>
        </header>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between pb-3">
            <p className="eyebrow">{t("modal.reject.reasons")}</p>
            <span className="font-mono text-[10px] text-ink-3 tabular-nums">
              {t("modal.reject.selected", { count: selected.size.toString().padStart(2, "0") })}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto border border-rule bg-canvas/40">
            {state.status === "loading" || state.status === "idle" ? (
              <Spinner />
            ) : state.status === "error" ? (
              <div className="p-3">
                <ErrorBanner error={state.error} onRetry={() => void load()} />
              </div>
            ) : state.reasons.length === 0 ? (
              <p className="p-6 text-center font-mono text-[11px] uppercase tracking-widest text-ink-3">
                {t("modal.reject.noReasons")}
              </p>
            ) : (
              <ul className="divide-y divide-rule/60">
                {state.reasons.map((r) => {
                  const checked = selected.has(r);
                  return (
                    <li key={r}>
                      <label className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(r)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={
                            checked
                              ? "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-alarm bg-alarm/30 text-alarm"
                              : "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-rule"
                          }
                        >
                          {checked ? (
                            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                              <path
                                d="M2 5l2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="square"
                              />
                            </svg>
                          ) : null}
                        </span>
                        <span className="text-sm text-ink">{translateReason(r, locale)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-rule px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
            {t("modal.reject.signed", { time: signedAt })}
          </p>
          <div className="flex gap-2">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onCancel}
              className="border border-rule px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 transition-colors hover:border-ink hover:text-ink focus-ring"
            >
              {t("modal.reject.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="border border-alarm bg-alarm px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-canvas transition-colors hover:bg-alarm-dim disabled:cursor-not-allowed disabled:border-rule disabled:bg-transparent disabled:text-ink-4 focus-ring"
            >
              {t("modal.reject.confirm", { count: selected.size })}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
