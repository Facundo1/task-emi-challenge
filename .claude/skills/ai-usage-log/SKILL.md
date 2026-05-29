---
name: ai-usage-log
description: >
  Mantiene `AI_USAGE_LOG.md` actualizado durante el challenge. Es el entregable explícito de
  Emi — calidad y honestidad del log se evalúan. Úsala después de toda interacción
  significativa: prompt nuevo, decisión técnica, archivo creado/modificado, alternativa
  descartada, bug debuggeado. Triggers: "actualizá el log", "loggear", "entregable AI",
  fin de sesión, después de cualquier decisión no trivial.
argument-hint: '<entrada a appendear, o "consolidate" para generar el log final>'
---

# AI Usage Log — emi-challenge

## Por qué existe esta skill

El enunciado de Emi dice textualmente:

> *"You are expected and encouraged to use AI tools throughout this challenge. However, you must deliver a detailed log of everything you used (prompts, tools, rules, configurations, etc.). The quality and honesty of this log is part of the evaluation."*

Esta skill cumple ese requisito sin tener que reconstruir el log post-hoc.

## Cuándo se activa

**Append (cada interacción significativa):**
- Prompt nuevo que cambia dirección o pide algo concreto
- Decisión técnica (alternativa elegida + descartadas)
- Archivo creado o modificado significativamente
- Bug debuggeado (con hipótesis descartadas)
- Skill o doc cargada y usada
- Configuración de Claude Code modificada (settings, MCP)
- Descubrimiento no obvio

**Consolidate (fin de sesión / pre-entrega):**
- Repasar entries, agregar resumen ejecutivo, completar appendices, limpiar redundancia

## Decision tree

| Si la pregunta es sobre... | Cargar... |
|---|---|
| Template inicial del archivo, formato exacto de cada appendix | [references/template.md](references/template.md) |

## Formato de una entry

```
### Entry <N> — <YYYY-MM-DD HH:MM> — <título corto>

**Trigger:** <qué disparó la interacción>
**Prompt / Request:** > <copy o resumen fiel>
**AI action:** <qué hizo Claude — archivos, skill, comandos>
**Alternatives considered:** <opciones descartadas + razón>
**Decision:** <opción elegida + razón principal>
**Outcome:** <funcionó / parcial / no funcionó>
**Honesty note:** <si aplica — algo que no salió como esperabas>
```

## Reglas de calidad

- **Honestidad sobre vanidad.** Si Claude se equivocó, loggearlo. Si tu prompt estaba mal redactado, loggearlo.
- **Concreto > genérico.** No "implementé la tabla con AI". Sí "Le pedí a Claude que generara `CandidatesTable` siguiendo `/react-patterns`. Primera versión tenía `any`, le pedí strict types, segunda OK."
- **Alternativas descartadas son tan importantes como las elegidas.** Demuestran rigor de juicio.
- **Loggear configuraciones**, no solo prompts. La infra de Claude Code (skills, rules, MCPs) cuenta como "tools, rules, configurations" del enunciado.

## Reglas de cantidad

- **Una entry por interacción significativa.** Si 3 prompts ajustan la misma cosa, **una entry** que captura las 3 iteraciones.
- **No loggear cada tool call individual.** Loggear la decisión/output, no el plumbing.
- **No inflar.** Si una entry no aporta info a un evaluador honesto, fuera.

## Appendices del log

Mantener al consolidar:

- **A** — Claude Code configuration files (paths reales del repo)
- **B** — Skills available + cuándo se usaron
- **C** — MCP servers usados (codegraph, etc.)
- **D** — Skills usage count
- **E** — Prompts that didn't work / I had to correct (honesty section)
- **F** — What I did NOT delegate to AI (decisiones manuales)
- **G** — Token / cost transparency (opcional)
- **H** — Meta: por qué el log está estructurado así

## Anti-patterns

- Reconstruir el log al final — recordás mal, omitís, sonás genérico.
- Inflar con detalles irrelevantes — un evaluador detecta el padding.
- Esconder lo que no funcionó — la honestidad es parte de la evaluación explícita.
- Solo loggear éxitos — los callbacks que tuviste que corregir son evidencia de tu juicio.
- Logger que no se mantiene durante la sesión — al final, reconstruir es costoso y peor.

## Hard rules

- **Append en vivo**, no al final.
- **Honestidad sobre cosmética.** Pregunta: ¿esto refleja fielmente cómo trabajé?
- **Una sola fuente de verdad** — `AI_USAGE_LOG.md`. No múltiples archivos.
- **Blindado en `.git/info/exclude`** durante el desarrollo. Mover a tracked o entregar como artefacto separado al final, según pida Emi.
- **No bullshit.** Si una entry suena genérica, re-escribir con detalle concreto o borrarla.
