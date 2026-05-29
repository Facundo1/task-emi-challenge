---
name: clean-code
description: >
  Pasada de limpieza, dead code removal, simplificación. Úsala después de implementar una
  feature funcional, cuando el código quedó "funciona pero feo". Triggers: "limpiá X",
  "refactor Y", "simplificá esto", "dead code", "ordená", "está repetido". También antes
  de declarar done para una pasada final.
---

# Clean Code — emi-challenge

## Cuándo se activa

- Después de implementar una feature: el código funciona pero quedó rough
- El usuario lo pide explícitamente
- Antes de `/code-review-excellence` como pasada preliminar
- Detectaste duplicación, comentarios sobrantes, dead code

## Cuándo NO usarla

- Antes de que la feature funcione (primero hacer que funcione, después limpiar)
- En código que no es tuyo / que no entendés bien
- Como excusa para refactor masivo sin razón concreta

## Checklist por pasada

### 1. Naming

- **Identificadores que se leen como prosa.** `getApprovedCandidates()` > `getCands(filter=true)`.
- **Sin abreviaciones** salvo las universales (`id`, `url`, `db`). `req`/`res` están OK por convención Express.
- **Booleanos con prefijo** (`isLoading`, `hasError`, `shouldRender`).
- **Una variable, un significado.** No reusar `data` para tres cosas distintas en la misma función.

### 2. Comentarios

- **Borrarlos casi todos.** Política del proyecto: cero comments. Los nombres son la documentación.
- **Excepción única**: una restricción no obvia que un lector no podría deducir (ej: workaround de bug específico con link al issue). Y aun así, ver si se puede expresar en el código.
- **Borrar comments `TODO` sin owner ni fecha** — ruido sin valor.

### 3. Duplicación

- **Tres iteraciones de lo mismo** → considerar extraer función. Pero solo si la abstracción aclara, no si oculta.
- **Dos iteraciones** = todavía no es duplicación, dejar.
- **Datos repetidos** (strings, números mágicos) → constante con nombre.

### 4. Dead code

- Funciones nunca llamadas → borrar (usar `codegraph_callers` para confirmar).
- Imports no usados → borrar (eslint los marca).
- Branches inalcanzables → borrar.
- Console.logs de debugging → borrar.
- Código comentado → borrar siempre. Git tiene el history.

### 5. Tamaño y forma

- **Funciones >40 líneas** → smell. Buscar la unidad lógica que se puede extraer.
- **Componentes >150 líneas** → smell. Partir.
- **Archivos >300 líneas** → smell. Considerar split por módulo.
- **Listas de params >4** → smell. Pasar un objeto.

### 6. Estructura

- **Early returns** > nesting profundo.
- **Guards al principio** de la función (validaciones, edge cases).
- **Una función, una cosa.** Si describís la función con "y" / "y también", está haciendo demasiado.
- **Side effects explícitos** — separar puro de impuro.

## Qué NO refactorear

- Código que funciona y no vas a tocar pronto. "If it ain't broke..."
- Por gusto estético sin razón concreta (premature abstraction).
- Tests que pasan — re-escribir tests "más lindos" rompe la red de seguridad.

## Flow recomendado

1. Identificar UNA cosa concreta a limpiar (no "limpiar todo").
2. Verificar que los tests pasan ANTES del cambio.
3. Hacer el cambio.
4. Verificar que los tests pasan DESPUÉS.
5. Commit pequeño con `refactor: <qué>`.

## Hard rules

- **Tests siempre verdes antes y después** del refactor. Mismo comportamiento observable.
- **No mezclar refactor con feature o fix** en el mismo commit.
- **No introducir comentarios** durante la limpieza. Política del proyecto.
- **No refactorear sin razón concreta**. Cada cambio debe justificarse en una frase.
