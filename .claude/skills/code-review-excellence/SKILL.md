---
name: code-review-excellence
description: >
  Review riguroso de cambios antes de declarar done. Úsala después de implementar una feature
  no trivial, antes de PR (o entrega del challenge), cuando el usuario dice "revisá", "fijate
  si está bien", "code review", "qué te parece esto". Mira correctness, seguridad, performance,
  tests, naming, y consistencia con el resto del proyecto.
---

# Code Review Excellence — emi-challenge

## Cuándo se activa

- Después de implementar una feature no trivial
- Antes de la entrega del challenge a Emi
- El usuario explícitamente pide review
- Después de `/clean-code` como segunda pasada más rigurosa

## Cuándo NO usarla

- Cambios triviales (typo, rename, una línea)
- Mid-implementation — esperar a tener algo cerrado para revisar
- En código de terceros que no estás modificando

## El frame mental

**No sos el autor.** Leé el código como si lo viera por primera vez un evaluador de Emi. Si algo te confunde, es bug latente o naming malo. Si te obliga a leer dos veces, partir.

## Checklist por pasada (en este orden)

### 1. ¿Funciona? (correctness)

- **¿El AC del task doc se cumple?** Caso por caso, no "en general".
- **Edge cases del enunciado**: candidato sin razones, candidato con varias razones, columnas todas-off, columnas todas-on.
- **Datos reales** (`data/candidates.json`): tildes, comas en razones, `reason` con espacios raros — ¿se renderiza bien?
- **¿Hay tests que cubren la lógica nueva?** Buscar el test que mata el bug, si no existe, agregar antes de declarar done.

### 2. ¿Es seguro?

Para este challenge no hay auth ni PII real, pero igual:

- **Input validation** en endpoints PATCH — rechazar payloads no esperados con 400.
- **No exponer stacktraces** completos en error responses de prod.
- **No log de data sensible** — los emails y documents son fake en este dataset, pero el patrón importa.
- **No SQL/command injection** — no aplica acá (no DB ni shell), mencionarlo en review si aparece.

### 3. ¿Es performante?

- **63 candidatos** = no se necesita virtualización ni paginación. No agregar premature optimization.
- **Re-renders del client**: ¿el toggle de columnas re-renderiza la tabla entera? Probablemente OK con 63 rows, medir antes de optimizar.
- **N+1 patterns** en el server: no aplica (todo in-memory), pero mencionar si se ve en otro contexto.

### 4. ¿Está testeado?

- **Lógica de negocio pura**: tests obligatorios (extracción de razones únicas, derivación de approved/rejected).
- **Componentes con interacción**: test de user event happy path.
- **API endpoints**: supertest test de 200 + 404.
- **Edge cases descubiertos en review**: agregar test que los cubra.

### 5. ¿Es legible?

- Naming claro (ver `/clean-code`).
- Funciones del tamaño correcto.
- Sin comentarios sobrantes (política: cero).
- Sin dead code.
- Sin `any` TypeScript ni `as` sin justificación.

### 6. ¿Es consistente con el resto del proyecto?

- **Style**: misma indentación, mismo orden de imports, misma forma de exportar componentes.
- **Patterns**: si los otros routes usan `asyncHandler`, este también. Si los otros componentes usan named exports, este también.
- **Naming convention**: prefijos `use` en hooks, `handle` en handlers internos, `on` en props.

### 7. ¿Cumple las hard rules?

- **No comments** en código ni tests.
- **No `Co-Authored-By: Claude`** en commits.
- **No commit sin permiso** del usuario.

## Output del review

Estructura recomendada:

```
✅ Correctness — <breve, qué probé>
✅ Tests — <coverage, gaps>
⚠️  Issues found:
  - <archivo:linea> — <qué, severidad>
  - ...
💡 Suggestions (no bloqueantes):
  - ...
🚀 Veredicto: ready / needs work / blocked
```

## Hard rules

- **No aprobar nada que no probaste correr.** "Debería funcionar" no es review.
- **Issues bloqueantes ≠ suggestions.** Marcar claro qué bloquea entrega y qué es nice-to-have.
- **No proponer refactor cosmético cuando hay bugs latentes.** Prioridad: correctness → tests → claridad.
- **Verificar el AC del task doc explícitamente.** Caso por caso.
