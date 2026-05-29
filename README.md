# Emi React Challenge

Recruiter dashboard that displays screened candidates with configurable columns and allows manual approval / rejection. Built for the Emi React Challenge.

## Stack

- **Frontend:** React 18 · Vite · TypeScript (strict) · Tailwind CSS
- **Backend:** Node 20 · Express · TypeScript (strict)
- **Tests:** Vitest · React Testing Library · supertest
- **Lint / typecheck:** ESLint · `tsc --noEmit`

## Quick start

```bash
npm install                       # root (concurrently)
npm install --prefix server       # server deps
npm install --prefix client       # client deps

npm run dev                       # boots server (:3001) + client (:5173) in parallel
```

Open <http://localhost:5173> in a browser.

> The client uses Vite's proxy to forward `/api/*` to the server — no CORS configuration needed in development.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Runs server + client concurrently with hot reload |
| `npm run lint` | ESLint on both client and server |
| `npm run typecheck` | `tsc --noEmit` on both |
| `npm test` | Runs Vitest suites for both |
| `npm run build` | Builds server (`tsc`) and client (`vite build`) |
| `npm run validate` | `lint` + `typecheck` + `test` — the pre-delivery gate |

## API

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/candidates` | `Candidate[]` |
| `GET` | `/api/candidates/:id` | `Candidate` or 404 |
| `PATCH` | `/api/candidates/:id` | Updated `Candidate`. Body: `{ "reason": "<comma-separated reasons or empty string>" }` |
| `GET` | `/api/columns` | `Record<keyof Candidate, boolean>` (column visibility config) |
| `GET` | `/api/reasons` | `string[]` (unique rejection reasons, derived from candidates) |

### Approval semantics

A candidate is **approved** when `reason === ""`. Otherwise the candidate is **rejected**; the `reason` field may contain multiple comma-separated reasons. This rule is enforced by the data source — no separate `status` field is stored.

To **approve** manually: `PATCH /api/candidates/:id` with `{ "reason": "" }`.
To **reject** manually: `PATCH /api/candidates/:id` with `{ "reason": "Reason A, Reason B" }`.

## Project layout

```
coding-cha/
├── data/                       candidates.json + columns.json (input)
├── server/
│   └── src/
│       ├── types/              shared DTOs (Candidate, ColumnsConfig)
│       ├── errors.ts           HttpError / NotFoundError / ValidationError
│       ├── middleware/         asyncHandler, errorHandler, requestLogger
│       ├── services/           candidatesService, columnsService, reasonsService, dataLoader
│       ├── routes/             candidates, columns, reasons
│       ├── app.ts              createApp() for tests
│       └── index.ts            bootstrap (loads data → starts listening)
└── client/
    └── src/
        ├── types/              same DTOs as server (copied; not a monorepo)
        ├── lib/                pure helpers (isApproved, parseReasons, formatReasons)
        ├── api/                fetch wrappers
        ├── hooks/              useCandidates, useColumns, useReasons
        ├── components/         CandidatesTable, RejectModal, ActionButtons, etc.
        ├── App.tsx             orchestrator: filters, search, column toggle, modal
        └── main.tsx            React root
```

## Implemented features

### Part 1 — Display candidates

- Backend serves candidates and columns from JSON files.
- Frontend fetches both and renders a table that respects the columns config (in declaration order).
- Status badge derived from `reason`: green "Approved" when empty, red "Rejected" otherwise.
- Loading and error states with retry.

### Part 2 — Reclassify candidates

- **Approve** button on each row: optimistic `PATCH` with `reason: ""`, rollback on failure.
- **Reject** flow: opens a modal that loads `/api/reasons` and lets the recruiter select one or more reasons via checkboxes. Confirming sends `PATCH` with the joined reasons.
- Reasons are extracted dynamically from the current candidates store — supports the "AI feedback loop" intent: new reasons added by recruiters automatically appear in the reasons list.

### Bonus features (beyond the spec)

- **Search** by name, email, or document number.
- **Status filter** (All / Approved / Rejected).
- **Column toggle in runtime** — recruiter can override the JSON-defined visibility from the UI (per-session, not persisted).
- **Live count** of filtered vs. total candidates.
- **External CV links** are rendered as actual `<a>` tags opening in a new tab.
- **Accessibility:** `role="dialog"` + `aria-modal` on the reject modal, ARIA labels on action buttons, `role="tab"` on status filter, semantic `<table>`.

## Architectural decisions

- **Approval state derived, not stored.** `isApproved(candidate)` is a function of `candidate.reason === ""`. This respects the spec's source-of-truth and avoids redundant state.
- **In-memory store on the server.** Mutations are not persisted — restarting the server reverts to the original JSON. This is allowed by the spec ("dummy endpoints are fine") and keeps the setup zero-dependency.
- **Optimistic UI updates.** Approve and reject mutate the local store first, then confirm with the server. If the request fails, the previous state is restored and an error banner is shown.
- **Reasons derived dynamically.** `GET /api/reasons` extracts unique reasons from candidates rather than returning a hardcoded list. This means recruiter-added reasons become available immediately.
- **Routes thin, services thick.** Route handlers validate input and delegate to services. Services hold the data and business logic. Central error middleware maps typed errors to status codes.
- **No comments in code or tests.** Identifier names and test names are the documentation. The single exception in the project is `index.html`'s `<!doctype html>` declaration, which is required by HTML.

## Tests

Run with `npm test` from the root.

**Server (4 files, ~30 tests):**
- `candidates.test.ts` — GET list, GET by id, PATCH approve/reject, 400/404 paths, persistence across requests.
- `columns.test.ts` — GET returns config exactly as loaded.
- `reasons.test.ts` — `extractUniqueReasons` (split, trim, dedupe, sort, empty cases) + GET integration.
- `candidatesService.test.ts` — load, find, update, isolation between loads.

**Client (5 files, ~25 tests):**
- `classifications.test.ts` — `isApproved` / `parseReasons` / `formatReasons` edge cases.
- `CandidatesTable.test.tsx` — column visibility, empty state, badge derivation, column order preservation.
- `ActionButtons.test.tsx` — click handlers, disabled states, pending state.
- `StatusBadge.test.tsx` — text and color variants.
- `RejectModal.test.tsx` — reasons loading, pre-selection from `initialReason`, multi-select, confirm/cancel.

## AI Usage

This project was built with significant AI assistance. A detailed log of prompts, tools, configurations, decisions, alternatives considered, and what was deliberately NOT delegated is provided in `AI_USAGE_LOG.md` (entregable separado).

## License

Private — built for the Emi React Challenge interview process.
