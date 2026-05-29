---
name: brainstorming
description: >
  Exploración de diseño antes de codear. Úsala cuando hay ambigüedad genuina en el approach,
  varias alternativas razonables, o el costo de elegir mal es alto. Triggers naturales:
  "diseñemos X", "qué approach te parece", "vamos a pensar Y", "tradeoffs", "pros y contras",
  "explorá alternativas para Z". También al arrancar features con scope no claro.
---

# Brainstorming — emi-challenge

## Cuándo se activa

- Hay más de un approach razonable y no es obvio cuál
- El costo de elegir mal es alto (refactor futuro grande, rompe contratos, etc.)
- El usuario explícitamente pide explorar opciones
- Pre-implementación de una feature con scope ambiguo

## Cuándo NO usarla

- Tarea con approach único obvio (typo fix, one-liner)
- Ya hay un plan acordado — entonces ejecutar, no re-explorar
- La decisión es trivialmente reversible (renombrar una variable, ajustar un margin)

## Cómo correr una sesión

### Paso 1 — Encuadrar el problema

Una sola frase: *"Necesitamos X porque Y. Las restricciones son Z."*

Si no podés escribir esta frase, todavía no entendiste el problema. Volver a preguntar al usuario.

### Paso 2 — Listar alternativas reales (2-4)

Para cada una:

- **Nombre corto** (1-3 palabras)
- **Cómo se vería** (2-3 oraciones)
- **Pros concretos** (no genéricos como "es más limpio")
- **Cons concretos** (qué cuesta, qué rompe, qué deuda introduce)

Reglas:

- Mínimo 2, máximo 4. Más de 4 es ruido.
- Incluir "no hacer nada" si es relevante.
- Incluir una opción "lo simple/feo que funciona" — ancla la conversación.

### Paso 3 — Aplicar criterios

Criterios típicos en este challenge:
- **Demostrar rigor profesional** (es una entrevista)
- **Tiempo de implementación** (challenge tiene scope acotado)
- **Claridad para el evaluador** (código y arquitectura legibles)
- **Reversibilidad** (¿esta decisión nos pinta a una esquina?)

No todos los criterios pesan igual. Marcar el que más pesa para este caso.

### Paso 4 — Recomendar y pedir confirmación

Estructura:

```
Recomendación: <opción N>
Razón principal: <criterio que más pesa>
Trade-off aceptado: <qué resignamos>

¿Vamos con esto o querés explorar otro ángulo?
```

**No empezar a codear hasta confirmación explícita del usuario.**

## Ejemplos típicos en este challenge

### Cómo modelar el estado de aprobación

- A) Campo `status` ("approved" | "rejected") + `reasons[]` separado → más explícito, redundante con `reason`
- B) Derivar de `reason === ""` → fuente única, respeta el enunciado
- C) Backend retorna `{ ...candidate, isApproved: bool }` → DTO enriquecido

Recomendación: B. Razón: el enunciado define la regla, agregar un campo redundante es over-engineering.

### Cómo manejar columnas dinámicas en la tabla

- A) Render condicional inline `{columns.name && <td>...</td>}` → simple, repetitivo
- B) Array de column definitions con `{ key, label, render }` → declarativo, extensible
- C) Librería de tabla (TanStack Table) → potente, overhead

Recomendación: B para un challenge. Razón: declarativo se ve profesional, sin la curva de C, sin la repetición de A.

## Hard rules

- Nunca dar una "lista de pros y contras" sin recomendación final — el usuario te necesita decidir, no enumerar.
- Nunca recomendar la opción más compleja por defecto. Sesgo a lo simple.
- Si todas las opciones tienen el mismo trade-off importante, decirlo primero.
- Si descubrís que el problema está mal planteado, parar y replantear — no brainstorming sobre la pregunta equivocada.
