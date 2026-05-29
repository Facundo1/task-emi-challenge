---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
---

# Test Conventions — emi-challenge

Auto-cargada al editar archivos de test.

## Reglas no negociables

1. **Vitest + Testing Library** para el client. **Vitest** puro para el server.
2. **AAA pattern**: Arrange / Act / Assert. Cada test sigue ese flow.
3. **El nombre del test es la documentación** — debe leerse como una frase que describe el comportamiento.
4. **No comentarios en tests.** Nunca. El test es la documentación.

## Naming

```ts
describe("CandidatesTable", () => {
  it("renders only visible columns according to columns config", () => { ... });
  it("shows approved badge when reason is empty", () => { ... });
  it("calls onReject with selected reasons when reject is confirmed", () => { ... });
});
```

- `describe` agrupa por unidad (componente, función, módulo).
- `it("<should> ...")` describe comportamiento observable.
- Evitar tests que dicen "should work" — describir QUÉ comportamiento.

## Qué testear (priority order)

1. **Lógica de negocio pura** (services, helpers, derivations).
2. **Boundary entre módulos** (API contract entre client y server, parsing de JSON).
3. **Comportamiento observable de componentes** (usuario clickea X → ve Y).
4. **Edge cases** que descubriste durante el dev.

## Qué NO testear

- Implementación interna (state interno de un hook, props privadas).
- Que los componentes "renderizan sin crashear" — eso no es un test, es un smoke.
- Mocks de toda la stack — si todo está mockeado, no estás testeando nada.
- Snapshots gigantes — generan ruido, nadie los revisa.

## Patrones (client)

### Componente con eventos

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("calls onApprove with candidate id when approve button is clicked", async () => {
  const user = userEvent.setup();
  const onApprove = vi.fn();
  render(<CandidateRow candidate={mockCandidate} onApprove={onApprove} />);
  await user.click(screen.getByRole("button", { name: /approve/i }));
  expect(onApprove).toHaveBeenCalledWith(mockCandidate.id);
});
```

### Hook con fetch

```ts
import { renderHook, waitFor } from "@testing-library/react";

it("loads candidates from the api", async () => {
  const { result } = renderHook(() => useCandidates());
  await waitFor(() => expect(result.current.status).toBe("success"));
  expect(result.current.data).toHaveLength(63);
});
```

Mocks de fetch: preferir `msw` (Mock Service Worker) sobre `vi.spyOn(global, "fetch")`.

## Patrones (server)

```ts
import request from "supertest";
import { app } from "./app";

describe("GET /api/candidates", () => {
  it("returns all candidates from the data file", async () => {
    const res = await request(app).get("/api/candidates");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(63);
  });
});

describe("PATCH /api/candidates/:id", () => {
  it("returns 404 when candidate id does not exist", async () => {
    const res = await request(app).patch("/api/candidates/nonexistent").send({ reason: "" });
    expect(res.status).toBe(404);
  });
});
```

## Qué NO hacer en tests

- **Comentarios.** Cero. El nombre del test es el comment.
- **Hardcodear datos del JSON real** — usar fixtures pequeños (3-5 candidatos) inline.
- **Tests que dependen de orden** — cada test debe poder correr aislado.
- **`expect(true).toBe(true)`** o assertions vacías.
- **Timeouts arbitrarios** (`setTimeout(..., 5000)`) — usar `waitFor` / `findBy*` queries.

## Coverage

- **No perseguir 100%** — apuntar a cubrir lógica de negocio + edge cases descubiertos.
- **Coverage > 70% es buena señal**, no obligatoria.
- **Si una línea no se puede testear razonablemente**, anotar por qué en el dev log (no en el código).

## Cross-checking

```bash
npm test                              # corre todos los tests
cd client && npx vitest run           # solo client, una vez
cd server && npx vitest run           # solo server, una vez
npx vitest run --coverage             # con coverage report
```
