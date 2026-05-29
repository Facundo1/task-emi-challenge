---
paths:
  - "client/**/*.tsx"
  - "client/**/*.ts"
---

# React Conventions — emi-challenge

Auto-cargada al editar archivos del client.

## Reglas no negociables

1. **Function components only.** Nada de class components.
2. **Hooks rules sagradas** — los hooks van en el top-level, no condicionales ni loops.
3. **Una responsabilidad por componente** — si un componente hace fetch + render + estado complejo, partirlo.

## Patrones a seguir

### Estructura de componente

```tsx
type CandidatesTableProps = {
  candidates: Candidate[];
  columns: ColumnsConfig;
  onApprove: (id: string) => void;
  onReject: (id: string, reasons: string[]) => void;
};

export function CandidatesTable({ candidates, columns, onApprove, onReject }: CandidatesTableProps) {
  const visibleColumns = useMemo(
    () => Object.entries(columns).filter(([, visible]) => visible).map(([key]) => key as keyof Candidate),
    [columns]
  );
  return (
    <table>
      {/* ... */}
    </table>
  );
}
```

### Estado y hooks

- **`useState`** para estado local simple.
- **`useReducer`** cuando hay >2 piezas de estado relacionadas o transiciones complejas.
- **Custom hooks** (`useCandidates`, `useColumns`) para encapsular fetch + estado. Naming: empieza con `use`.
- **`useMemo` / `useCallback`** solo cuando hay re-render measurable. No premature optimization.
- **`useEffect` para side effects only** — no para derivar estado (usar `useMemo` o derivar en render).

### Performance

- **No optimizar antes de medir.** React DevTools profiler primero, después `memo` / `useMemo` si hace falta.
- **Keys estables** en listas — usar `candidate.id`, nunca el índice del array salvo que el orden sea inmutable.
- **No definir componentes adentro de otros componentes** — se re-crean cada render.

### Data fetching

- Custom hook por recurso (`useCandidates`, `useColumns`, `useReasons`).
- Manejar 4 estados: `idle | loading | success | error` (discriminated union).
- Optimistic updates para mutaciones (approve/reject) — UI snappy, rollback en error.

## Qué NO hacer

- **Class components.** Solo function components.
- **`forwardRef` sin necesidad real** — solo cuando expones un ref a un parent que lo necesita.
- **Props drilling profundo** (>3 niveles) — considerá Context o lift state. No agregar context para todo.
- **Renderizar dentro de loops sin keys** — React warning + bugs sutiles.
- **`useEffect` sin array de deps** salvo intencional (raro).
- **Mutar state directamente** (`state.foo = bar` o `arr.push(x)`) — siempre nuevos objetos/arrays.
- **Lógica de negocio en componentes** — extraer a hooks o funciones puras testables.

## Naming

- Componentes: `PascalCase` (`CandidatesTable`, `RejectModal`).
- Hooks: `camelCase` con prefijo `use` (`useCandidates`).
- Props types: `<ComponentName>Props` (`CandidatesTableProps`).
- Event handlers: `handle<Event>` interno, `on<Event>` prop (`handleApprove` interno, `onApprove` prop).
- Booleanas: prefijo `is`, `has`, `should` (`isLoading`, `hasError`, `shouldRender`).

## Cross-checking

```bash
cd client && npm run lint
cd client && npm run typecheck
cd client && npx vitest run
```

Si tocaste UI: correr `npm run dev` y verificar visualmente la golden path + 1 edge case.
