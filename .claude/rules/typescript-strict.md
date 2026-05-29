---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Strict — emi-challenge

Auto-cargada al editar cualquier archivo TypeScript.

## La regla no negociable

`tsconfig.json` corre con `"strict": true`. No `any`, no `as` salvo en boundary explícito documentado.

## Por qué

En un challenge de evaluación, el código limpio en TS muestra rigor profesional. `any` y casts ocultos son señales rojas para un evaluador. El esfuerzo de tipar bien paga doble: mejor DX durante el dev y mejor presentación.

## Qué hacer

- **Tipos explícitos en signatures públicas** (exports, props de componentes, return de funciones de service).
- **Inferencia OK para variables locales** — no sobre-anotar lo que TS deduce solo.
- **Unions en vez de enums** salvo que el enum aporte algo concreto. `type Status = "approved" | "rejected"` > `enum Status { ... }`.
- **`readonly` en arrays/objects que no se mutan** — comunica intent.
- **Discriminated unions** para estados con shape distinto:
  ```ts
  type FetchState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };
  ```
- **`unknown` en boundaries de parsing** (JSON externo, fetch response), validar después con un type guard o zod.
- **Generics cuando hay paramétricidad real** — no forzar generics decorativos.

## Qué NO hacer

- `any` — si lo necesitás, primero probá `unknown` + type guard. Si no hay opción, comentá la razón al lado.
- `as Foo` casts sin validación — los casts mienten al compilador.
- `// @ts-ignore` / `// @ts-expect-error` salvo con motivo + link a issue / razón concreta.
- Tipar objetos con `{}` (significa "anything non-null") — usá `Record<string, unknown>` o un type específico.
- Sobre-tipar variables locales que TS infiere bien.
- Hacer types/interfaces que se usan una sola vez en el mismo archivo — inline el tipo, salvo que aporte legibilidad.

## Cross-checking

```bash
npm run typecheck         # tsc --noEmit
npx tsc --noEmit --pretty
```

Antes de declarar done: typecheck debe pasar sin warnings. Errores ≠ warnings — los `warning` de eslint sobre TS también cuentan.
