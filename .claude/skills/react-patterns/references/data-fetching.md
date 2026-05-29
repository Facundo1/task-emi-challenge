# React Data Fetching — emi-challenge

> Cargado on-demand desde `SKILL.md` cuando la pregunta es sobre fetch hooks, optimistic updates, error handling en el client.

## Hook simple con FetchState

Ver [component-patterns.md](component-patterns.md#custom-hook-con-fetchstate).

## Mutation con optimistic update + rollback

```ts
function useApproveCandidate(refresh: () => void) {
  const [isPending, setPending] = useState(false);

  async function approve(candidate: Candidate, setOptimistic: (c: Candidate) => void) {
    const original = candidate;
    setPending(true);
    setOptimistic({ ...candidate, reason: "" });
    try {
      const r = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "" }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const updated = (await r.json()) as Candidate;
      setOptimistic(updated);
    } catch (error) {
      setOptimistic(original);
      throw error;
    } finally {
      setPending(false);
    }
  }

  return { approve, isPending };
}
```

UI snappy: el badge cambia inmediatamente. Rollback automático si la API falla.

## Tres patrones para integrar mutations con lista

**A) Lift state to parent.** El padre tiene el array de candidatos en su estado y le pasa setters al hijo. Más simple para este scope.

**B) Hook con estado interno.** El hook `useCandidates` retorna `{ data, mutate }`. La fila llama `mutate(id, patch)`.

**C) Cache layer (TanStack Query).** Overkill para este challenge.

**Elección:** A o B. Para 63 candidates ambos son equivalentes. B es más reusable.

## Error handling en el client

- Errores de red: capturar en el hook, exponer como `status: "error"`.
- Errores de mutación: rollback del optimistic update + toast.
- Errores de validación del server (400): el cuerpo de la response trae el motivo, mostrarlo.

```ts
async function patchCandidate(id: string, patch: Partial<Candidate>) {
  const r = await fetch(`/api/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${r.status}`);
  }
  return (await r.json()) as Candidate;
}
```

## Tests con msw

Mock Service Worker es preferible a `vi.spyOn(global, "fetch")`:

```ts
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("/api/candidates", () => HttpResponse.json(mockCandidates)),
  http.patch("/api/candidates/:id", async ({ request, params }) => {
    const body = await request.json() as { reason: string };
    return HttpResponse.json({ id: params.id, ...body });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Más realista (intercepta a nivel de red), reusable entre tests, fácil overridear handler por test.

## Anti-patterns

- Fetch dentro de un loop o condicional.
- `useEffect` sin cleanup en hooks de fetch.
- Mutación sin rollback.
- Estado optimista que no refleja la response real del server.
- Llamar `fetch` directo en componentes (mover a un hook o función `api/`).
