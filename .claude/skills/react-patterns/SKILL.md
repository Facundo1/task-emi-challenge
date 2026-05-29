---
name: react-patterns
description: >
  Patrones React para el client del challenge: composición de componentes, hooks, manejo de
  estado, performance, data fetching. Úsala cuando trabajás en client/, cuando hay que
  decidir cómo organizar UI, dónde poner estado, o cómo evitar re-renders. Triggers:
  edits en client/**, "componente", "hook", "estado", "re-render", "fetch en el client".
---

# React Patterns — emi-challenge

## Cuándo se activa

- Trabajás dentro de `client/`
- Decidiendo dónde poner estado (componente local, lift up, context, custom hook)
- Diseñando una API de componente (props, callbacks)
- Optimizando re-renders o data fetching

## Stack

React 18 + TypeScript + Vite + Tailwind + Vitest. Fetch nativo (sin Axios).

## Decision tree

| Si la pregunta es sobre... | Cargar... |
|---|---|
| Patrones de componente / hook con código de ejemplo | [references/component-patterns.md](references/component-patterns.md) |
| Custom hooks de data fetching (FetchState, optimistic updates) | [references/data-fetching.md](references/data-fetching.md) |

## Composición — principios

- **Container vs presentacional.** Container hace fetch + maneja loading/error + pasa data/callbacks. Presentacional solo renderiza. El presentacional es trivialmente testeable y reusable.
- **Cuándo partir:** componente >100 líneas, sección reusable, sección con estado independiente, sección con nombre claro.
- **No partir por partir.** Pedazos de 5 líneas con nombres raros son peores que un componente coherente de 80 líneas.

## Estado — decision tree

1. ¿Solo lo usa **un** componente? → `useState` local.
2. ¿Padre + hijo? → lift al padre, pasar por props.
3. ¿Componentes lejanos (≥3 niveles)? → Context o custom hook con estado externo.
4. ¿Estado del server (data fetcheada)? → custom hook (`useCandidates`).

Para este challenge, custom hooks alcanzan. Sin Redux, sin TanStack Query.

## Hooks — reglas

- **Top-level only** (no condicionales ni loops).
- **Prefijo `use`** obligatorio.
- **Una responsabilidad por hook.**
- Si devuelve >4 cosas, considerar partir.

| Necesidad | Hook |
|---|---|
| Estado simple | `useState` |
| Transiciones complejas | `useReducer` |
| Side effect | `useEffect` |
| Valor derivado caro | `useMemo` (medir primero) |
| Callback estable | `useCallback` (solo si va a memo'd child) |
| Compartido a profundidad | Context + hook |

## Performance

- **No optimizar antes de medir.** Profiler primero, después `memo` / `useMemo` si hace falta.
- **Keys estables** en listas (`candidate.id`, nunca el index).
- **No definir componentes adentro de componentes** — se re-crean cada render.

## Anti-patterns

- `forwardRef` sin necesidad real.
- Props drilling >3 niveles.
- `useEffect` para derivar estado (usar `useMemo` o derivar en render).
- Mutar state directamente.
- `useEffect` sin array de deps (salvo intencional).
- Side effects en render.
- Lógica de negocio en componentes (extraer a hooks o funciones puras).

## Naming

- Componentes: `PascalCase` (`CandidatesTable`).
- Hooks: `use` + `camelCase` (`useCandidates`).
- Props types: `<ComponentName>Props`.
- Handlers: `handle<Event>` interno, `on<Event>` prop.
- Booleans: prefijo `is`, `has`, `should`.

## Hard rules

- Function components only.
- Hooks en top-level, prefijo `use`.
- Keys estables en listas.
- No comments (política del proyecto).
- TypeScript strict, sin `any` en signatures públicas.
