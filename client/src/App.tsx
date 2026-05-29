import { useEffect, useMemo, useState } from "react";
import { useCandidates } from "./hooks/useCandidates";
import { useColumns } from "./hooks/useColumns";
import { CandidatesTable } from "./components/CandidatesTable";
import { Spinner } from "./components/Spinner";
import { ErrorBanner } from "./components/ErrorBanner";
import { RejectModal } from "./components/RejectModal";
import { SearchBar } from "./components/SearchBar";
import { StatusFilter, type StatusFilterValue } from "./components/StatusFilter";
import { ColumnToggle } from "./components/ColumnToggle";
import { Masthead } from "./components/Masthead";
import { StatsStrip } from "./components/StatsStrip";
import { Pagination } from "./components/Pagination";
import { isApproved, formatReasons } from "./lib/classifications";
import { useTranslation } from "./i18n/useTranslation";
import type { Candidate, CandidateKey, ColumnsConfig } from "./types/api";

const PER_PAGE = 10;

export function App() {
  const { t } = useTranslation();
  const candidatesQuery = useCandidates();
  const columnsQuery = useColumns();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<Error | null>(null);
  const [columnOverride, setColumnOverride] = useState<ColumnsConfig | null>(null);
  const [page, setPage] = useState(1);

  const candidates: Candidate[] | null =
    candidatesQuery.state.status === "success" ? candidatesQuery.state.candidates : null;
  const baseColumns: ColumnsConfig =
    columnsQuery.state.status === "success" ? columnsQuery.state.columns : {};
  const effectiveColumns = columnOverride ?? baseColumns;

  const stats = useMemo(() => {
    if (!candidates) return { total: 0, approved: 0, rejected: 0, rate: 0 };
    const total = candidates.length;
    const approved = candidates.filter(isApproved).length;
    const rejected = total - approved;
    const rate = total === 0 ? 0 : Math.round((approved / total) * 100);
    return { total, approved, rejected, rate };
  }, [candidates]);

  const filtered = useMemo<Candidate[]>(() => {
    if (!candidates) return [];
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (statusFilter === "approved" && !isApproved(c)) return false;
      if (statusFilter === "rejected" && isApproved(c)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(c.document).includes(q)
      );
    });
  }, [candidates, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [filtered, currentPage]
  );

  async function handleApprove(id: string) {
    setPendingId(id);
    setActionError(null);
    try {
      await candidatesQuery.updateCandidate(id, { reason: "" });
    } catch (error) {
      setActionError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setPendingId(null);
    }
  }

  async function handleRejectConfirm(reasons: string[]) {
    if (!rejectingId) return;
    const targetId = rejectingId;
    setRejectingId(null);
    setPendingId(targetId);
    setActionError(null);
    try {
      await candidatesQuery.updateCandidate(targetId, { reason: formatReasons(reasons) });
    } catch (error) {
      setActionError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setPendingId(null);
    }
  }

  function handleToggleColumn(key: CandidateKey) {
    setColumnOverride((prev) => {
      const base = prev ?? baseColumns;
      return { ...base, [key]: !base[key] };
    });
  }

  const rejectingCandidate =
    rejectingId && candidates ? candidates.find((c) => c.id === rejectingId) ?? null : null;

  const isLoading =
    candidatesQuery.state.status === "loading" || columnsQuery.state.status === "loading";

  return (
    <div className="relative min-h-screen text-ink">
      <div className="relative z-10">
        <Masthead totalCount={stats.total} />

        <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-8 lg:px-10">
          {actionError ? (
            <div className="mb-6 animate-fade-in">
              <ErrorBanner
                error={actionError}
                onRetry={() => setActionError(null)}
                retryLabel={t("error.dismiss")}
              />
            </div>
          ) : null}

          {isLoading ? (
            <Spinner />
          ) : candidatesQuery.state.status === "error" ? (
            <ErrorBanner error={candidatesQuery.state.error} onRetry={candidatesQuery.reload} />
          ) : columnsQuery.state.status === "error" ? (
            <ErrorBanner error={columnsQuery.state.error} onRetry={columnsQuery.reload} />
          ) : (
            <>
              <StatsStrip
                total={stats.total}
                approved={stats.approved}
                rejected={stats.rejected}
                rate={stats.rate}
                visibleCount={filtered.length}
              />

              <div className="mt-12 animate-rise-in [animation-delay:160ms]">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-rule pb-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow">{t("roster.section")}</span>
                    <span className="h-3 w-px bg-rule-strong" />
                    <span className="font-mono text-xs text-ink-3 tabular-nums">
                      {filtered.length.toString().padStart(3, "0")} / {stats.total.toString().padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={setSearch} />
                    <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                    <ColumnToggle
                      baseColumns={baseColumns}
                      visible={effectiveColumns}
                      onToggle={handleToggleColumn}
                    />
                  </div>
                </div>

                <div className="mt-5 animate-rise-in [animation-delay:240ms]">
                  <CandidatesTable
                    candidates={paginated}
                    columns={effectiveColumns}
                    pendingId={pendingId}
                    onApprove={(id) => void handleApprove(id)}
                    onReject={(id) => setRejectingId(id)}
                  />
                </div>

                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  perPage={PER_PAGE}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </main>

        <footer className="mx-auto max-w-[1320px] border-t border-rule px-6 py-5 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-3">
            <div className="flex items-center gap-2 font-mono uppercase tracking-widest">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span>{t("footer.status")}</span>
            </div>
            <div className="font-mono uppercase tracking-widest">{t("footer.copy")}</div>
          </div>
        </footer>
      </div>

      {rejectingCandidate ? (
        <RejectModal
          candidateName={rejectingCandidate.name}
          initialReason={rejectingCandidate.reason}
          onCancel={() => setRejectingId(null)}
          onConfirm={(reasons) => void handleRejectConfirm(reasons)}
        />
      ) : null}
    </div>
  );
}
