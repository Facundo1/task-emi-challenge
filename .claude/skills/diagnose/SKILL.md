---
name: diagnose
description: >
  Loop disciplinado de debugging. Úsala cuando algo no funciona, hay un bug, un test rojo,
  un error inesperado en runtime, o un comportamiento que no podés explicar. Triggers:
  "no funciona", "está roto", "tira error", "bug", "el test pasa pero el código está mal",
  "debug X". Sigue el ciclo: reproducir → minimizar → hipotetizar → fix → test de regresión.
---

# Diagnose — emi-challenge

## Cuándo se activa

- Bug observado en runtime (excepción, output incorrecto, UI rara)
- Test rojo inesperadamente
- Comportamiento que no podés explicar leyendo el código
- "Funciona en mi máquina" syndrome

## Cuándo NO usarla

- Sabés cuál es el bug y cómo fixearlo en 30 segundos → fix directo + test
- El "bug" es feature pedida — usar `/brainstorming`
- Performance issue sin error — profiler primero, no debug

## El loop

### 1. Reproducir
**Si no podés reproducir, no podés fixear.** Crear un caso mínimo, paso a paso, que dispare el bug consistentemente. Anotar pasos, capturar output/error. Si es intermitente: anotar frecuencia (1/10, 9/10) — cambia la estrategia.

### 2. Minimizar
Reducir el caso al mínimo que aún reproduce.
- ¿Reproduce con menos datos? Reducir el JSON a 1 candidato.
- ¿Reproduce sin frontend? Solo curl al backend.
- ¿Reproduce sin tu cambio? Si sí, era pre-existente.
El caso mínimo es tu test de regresión futuro.

### 3. Generar hipótesis
**Listar 2-3 posibles causas.** Para cada una: evidencia a favor, evidencia en contra, experimento que confirma/descarta.

**Anti-pattern:** cambios al azar esperando que algo funcione. Eso ensucia el código y oculta el bug real.

### 4. Probar la más probable
Hacer UN cambio que descarte UNA hipótesis. Correr caso mínimo. Anotar resultado.

### 5. Fix
- Cambio mínimo que arregla el bug.
- **No mezclar refactor o mejoras** en el mismo commit.
- Verificar caso mínimo + casos relacionados.

### 6. Test de regresión
- **Escribir el test que el bug debería haber atrapado.**
- Verificar que falla SIN el fix.
- Verificar que pasa CON el fix.

### 7. Loggear en `AI_USAGE_LOG.md`
Qué bug, cómo se reprodujo, hipótesis descartadas, causa real, qué se aprendió.

## Herramientas comunes

### CodeGraph
- `codegraph_callers "approveCandidate"` — quién llama a la función con bug
- `codegraph_impact "candidatesService"` — qué se rompe si toco esto
- `codegraph_callees` — qué llama X, para tracear

### Browser DevTools (client)
- Network tab: request/response.
- Console: errors, warnings.
- React DevTools: props/state.

### Server logs
- `console.log` temporal durante debug; **borrar antes de commit**.
- Logger middleware si ya existe.

### Tests como debug tool
- `it.only(...)` para correr un solo test.
- `console.log` dentro del test; borrar antes de commit.

## Anti-patterns

- Cambios al azar sin hipótesis.
- Try/catch + swallow para "que no tire error" — es esconder bug, no fixearlo.
- Comentarios `// fix:` con explicación — el código debería ser claro o el test capturar.
- Fix sin test — si no escribiste el test, el bug puede volver.
- Fix + refactor en el mismo commit — imposible bisectar después.

## Hard rules

- **Reproducir antes de fixear.** Si no podés, primero entender por qué.
- **Test de regresión obligatorio** para bugs no triviales.
- **Loggear el debugging journey** en `AI_USAGE_LOG.md`.
- **Borrar console.log temporales** antes de commit.
