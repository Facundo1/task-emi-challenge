# React Component Patterns — emi-challenge

> Cargado on-demand desde `SKILL.md` cuando la pregunta es sobre patrones concretos de componente o hook.

## Container vs presentacional

```tsx
function CandidatesPage() {
  const { data: candidates, status } = useCandidates();
  const { data: columns } = useColumns();
  const { mutate: approve } = useApproveCandidate();
  if (status === "loading") return <Spinner />;
  if (status === "error") return <ErrorBanner />;
  return <CandidatesTable candidates={candidates} columns={columns} onApprove={approve} />;
}

function CandidatesTable({ candidates, columns, onApprove }: Props) {
  const visibleColumns = useMemo(
    () => Object.entries(columns).filter(([, visible]) => visible).map(([key]) => key as keyof Candidate),
    [columns]
  );
  return (
    <table>
      <thead>
        <tr>{visibleColumns.map((col) => <th key={col}>{col}</th>)}</tr>
      </thead>
      <tbody>
        {candidates.map((c) => (
          <tr key={c.id}>
            {visibleColumns.map((col) => <td key={col}>{String(c[col])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- **Container** hace I/O. **Presentacional** solo renderiza.
- El presentacional se testea con fixtures inline, sin necesidad de mockear fetch.

## Discriminated union para fetch state

```ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

Beneficio: el render hace `if (state.status === "success") use state.data` y TypeScript estrecha el tipo automáticamente. No hay `data?: T` con `if (data)` que confunde.

## Custom hook con FetchState

```ts
function useCandidates() {
  const [state, setState] = useState<FetchState<Candidate[]>>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetch("/api/candidates")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Candidate[]>;
      })
      .then((data) => { if (!cancelled) setState({ status: "success", data }); })
      .catch((error: Error) => { if (!cancelled) setState({ status: "error", error }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}
```

El cleanup `cancelled` previene el set state en componente desmontado (React 18 strict mode lo hace evidente).

## Pasar callbacks estables

Si un componente padre define `onApprove = (id) => ...` inline, cambia cada render → si el child está memoizado, no le sirve la memoization.

Solución:

```tsx
const handleApprove = useCallback((id: string) => {
  approveMutation.mutate(id);
}, [approveMutation]);
```

**Solo usar `useCallback` cuando el callback va a un memo'd child.** Para callbacks que se pasan a elementos DOM (`<button onClick={fn}>`), `useCallback` no aporta.

## Variants con clsx o lookup tables

```tsx
import clsx from "clsx";

<button
  className={clsx(
    "rounded-md px-3 py-1.5 text-sm",
    variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
    variant === "secondary" && "border border-slate-300 hover:bg-slate-50",
    disabled && "opacity-50 cursor-not-allowed"
  )}
  disabled={disabled}
>
```

NO concatenar strings dinámicamente (`"bg-" + color`) — Tailwind purga la clase.
