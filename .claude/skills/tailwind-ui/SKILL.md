---
name: tailwind-ui
description: >
  Patrones Tailwind para el client: composición de utilities, theming, responsive, dark mode,
  componentes reusables. Úsala cuando trabajás en estilos UI, cuando hay que decidir entre
  inline utilities y abstracción con clsx, o cuando se mete responsive/dark mode. Triggers:
  "estilos", "tailwind", "responsive", "dark mode", "theming", "diseño visual".
---

# Tailwind UI — emi-challenge

## Cuándo se activa

- Trabajás en estilos del client
- Decidiendo cómo componer utilities (inline vs abstracción)
- Agregando responsive o dark mode
- Diseñando un componente visual reusable

## Stack visual

Tailwind v3 + PostCSS. Utilities-first; sin Tailwind UI ni librerías premade. Sin CSS custom salvo casos puntuales documentados.

## Decision tree

| Si la pregunta es sobre... | Cargar... |
|---|---|
| Patrones concretos de componentes (tabla, badge, modal, botón) | [references/component-styles.md](references/component-styles.md) |

## Filosofía

**Utilities-first, con pragmatismo.** Inline classes para todo, EXCEPTO cuando una combinación se repite ≥3 veces — ahí extraer a **componente React** (`<Button variant="primary" />`), **no** a CSS class.

## Cuándo extraer

- **≥3 usos en archivos distintos** → componente React.
- **Variants relacionadas** (Button primary/secondary/ghost) → considerar `cva` (class-variance-authority) si crece.

## Cuándo NO extraer

- 1-2 usos → mantener inline.
- "Para que se vea más limpio" sin razón concreta → no.

## Composición con clsx

```tsx
import clsx from "clsx";

<div className={clsx(
  "rounded-md px-3 py-1.5 text-sm",
  isPrimary && "bg-blue-600 text-white hover:bg-blue-700",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

Preferir `clsx` a string concat para clases condicionales.

## Anti-patterns (críticos)

### NO concatenar clases dinámicamente

```tsx
// MAL — Tailwind purga la clase, no la detecta
className={"bg-" + color + "-500"}

// BIEN — lookup table con clases completas literales
const COLORS = {
  red: "bg-red-500 text-white",
  green: "bg-green-500 text-white",
  blue: "bg-blue-500 text-white",
} as const;
className={COLORS[color]}
```

Tailwind escanea archivos en build-time y solo conserva clases que aparecen como literales. Strings construidos dinámicamente son invisibles para el purger → la clase no existe en el CSS final.

### Otros anti-patterns

- `@apply` en CSS files para evitar inline utilities (defeats Tailwind's purpose).
- Custom CSS para algo que Tailwind ya da.
- Mezclar inline styles (`style={{ color: "red" }}`) con Tailwind sin razón.
- Extraer abstracciones prematuras (1-2 usos).

## Responsive

Tailwind mobile-first. Prefijos: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+).

```tsx
<table className="text-xs sm:text-sm md:text-base">
```

Para el challenge, una vista desktop razonable alcanza. Si hay tiempo, responsive `md:` para tablet+.

## Dark mode

Config `darkMode: "class"` en `tailwind.config.js`. Toggle agrega/quita `dark` al `<html>`. Estilos con `dark:` prefix:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

Para este challenge, dark mode es **nice-to-have, no blocker**.

## Cross-checking

- Verificar visualmente en `npm run dev`.
- Probar zoom 100% y 150% (accessibility).
- Resize a tablet/mobile si se implementó responsive.
- Verificar contraste para badges de approved/rejected (WCAG AA).

## Hard rules

- Tailwind utilities first; extraer solo cuando se repite ≥3 veces.
- No string concat para clases dinámicas — lookup table.
- No `@apply` salvo casos puntuales documentados.
- Verificar visual antes de declarar done.
