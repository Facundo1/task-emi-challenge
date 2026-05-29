# Retrieval Rules

> Cuándo cargar contexto. Default: **menos**. Source of truth: este archivo.

## Orden de carga

1. **CLAUDE.md** — autocargado por sesión. Solo router.
2. **INDEX.md** — leer una vez si el request necesita routing.
3. **Una** de: `docs/<file>.md` O `skills/<name>/SKILL.md`. Match request → trigger column del INDEX.md.
4. **References** solo cuando el decision tree del SKILL.md explícitamente delega. Cap: 2 por turno.
5. **Source code** (`Read`/`Grep`/`codegraph_*`) cuando la respuesta vive en el código, no en docs.

## Cuándo leer cada surface

### `.claude/docs/architecture.md`
- Usuario pregunta cómo bootea la app, cómo fluye la data, qué vive dónde, cross-module.
- **Skip** para: lookups de comando, edits de un solo archivo, preguntas de una sola skill.

### `.claude/docs/commands.md`
- Usuario pide comando no listado en CLAUDE.md "Most-used".

### `.claude/docs/gotchas.md`
- **Antes** de tocar: env config, setup del proyecto, configuración de tests.
- **Después** de un fallo inesperado de build/CI.

### `.claude/docs/git-workflow.md`
- Usuario pregunta por: nombre de branch, formato de commit, convenciones de PR.
- **Antes** de crear branch, abrir PR, o pushear.

### `.claude/skills/<skill>/SKILL.md`
- Invocada vía Skill tool cuando matchean triggers (ver INDEX.md).
- **Nunca** cargar más de un SKILL.md por turno salvo que aplique precedencia.

### `.claude/skills/<skill>/references/<topic>.md`
- Solo cuando el decision tree del SKILL.md apunta ahí Y el topic matchea el request.

## PARAR de cargar más contexto cuando

- La respuesta ya es derivable de lo cargado.
- Dos archivos ya leídos y el siguiente solo confirmaría.
- Ambigüedad restante está en el código → switch a `codegraph_*` / `Read` / `Grep`.
- Llegaste al cap: **1 doc + 1 skill + 2 references por turno**.

## Anti-patterns

- Cargar todos los references de una skill "por las dudas".
- Cargar `architecture.md` para responder una pregunta de comando.
- Re-leer CLAUDE.md a mitad de turno (ya está cargado).
- Leer múltiples SKILL.md "para comparar".
- Leer skills no listadas en INDEX.md.

## Caso especial: AI Usage Log

Después de **toda interacción significativa** (decisión técnica, prompt nuevo, archivo creado/modificado): invocar `/ai-usage-log` con la entrada correspondiente. Esto **no consume** el cap de retrieval — es un append a un archivo persistente, no carga de contexto.
