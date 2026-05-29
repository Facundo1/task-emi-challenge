# `.claude/` — Developer guide

> Este archivo es **para humanos**. Claude Code no lo autocarga.

## TL;DR

`.claude/` es la memoria de trabajo del proyecto para Claude Code. Organizada en capas que se cargan on-demand para no quemar tokens:

```
CLAUDE.md         ← cargado cada sesión (≤80 líneas, router)
.claude/
├── INDEX.md      ← índice de skills/docs/rules
├── RETRIEVAL.md  ← reglas de "cuándo leer qué"
├── MEMORY.md     ← decisiones del proyecto (este es el "diario")
├── README.md     ← este archivo
├── settings.local.json   ← permisos por proyecto
├── docs/         ← documentación de referencia
├── rules/        ← auto-cargadas cuando matchean paths
├── skills/       ← invocables vía /<skill-name>
└── plans/        ← planes generados por EnterPlanMode
```

## Por qué este setup

**Problema:** si meto todo en un solo `CLAUDE.md` de 500 líneas, Claude lo carga entero cada turno aunque solo necesite 20 líneas. Eso ensucia el contexto y degrada la calidad de la respuesta.

**Solución:** un router corto (≤80 líneas) que apunta a un INDEX, que apunta a docs/skills/rules específicas. Claude carga solo el camino mínimo. Resultado medido en proyectos reales: ~35-55% menos tokens por sesión vs el "dump everything" approach.

## Cómo se carga cada capa

| Capa | Cuándo |
|---|---|
| `CLAUDE.md` | Siempre, en cada turno |
| `INDEX.md` | On-demand, cuando hay que rutear |
| `RETRIEVAL.md` | On-demand, cuando hay duda de cuánto cargar |
| `MEMORY.md` | On-demand, para decisiones del proyecto |
| `docs/*.md` | On-demand cuando matchea el trigger del INDEX |
| `rules/*.md` | **Auto-load** cuando se editan paths del frontmatter |
| `skills/<x>/SKILL.md` | Cuando el usuario invoca `/<x>` o matchea el trigger |
| `skills/<x>/references/*.md` | Solo cuando SKILL.md delega ahí (≤2 por turno) |

## Skills disponibles

| Skill | Para qué |
|---|---|
| `/brainstorming` | Exploración de diseño antes de codear (tradeoffs, alternativas) |
| `/clean-code` | Pasada de limpieza, dead code, simplificación |
| `/code-review-excellence` | Review de cambios antes de declarar done |
| `/diagnose` | Loop disciplinado de debugging |
| `/react-patterns` | Patrones React (composición, hooks, estado, performance) |
| `/express-api` | Routes, middleware, error handling, DTOs |
| `/tailwind-ui` | Theming, responsive, dark mode, composición de utilities |
| `/ai-usage-log` | **Mantener AI_USAGE_LOG.md actualizado** — entregable del challenge |

## Rules auto-cargadas

| Rule | Se inyecta cuando se edita |
|---|---|
| `typescript-strict.md` | Cualquier `.ts` o `.tsx` |
| `react-conventions.md` | `client/**/*.tsx` o `client/**/*.ts` |
| `api-conventions.md` | `server/**/*.ts` |
| `test-conventions.md` | `**/*.test.*` o `**/*.spec.*` |

## Hard limits

| Archivo | Máximo |
|---|---|
| `CLAUDE.md` | 80 líneas |
| `INDEX.md` | 50 líneas |
| `SKILL.md` | 120 líneas |
| reference | 300 líneas |

Si algo crece más → split.

## Hard rules (las no negociables)

- No comments en código ni tests
- Verificación antes de declarar done (correr el comando, leer el output)
- NEVER commit/push sin permiso explícito
- NEVER agregar `Co-Authored-By: Claude`
- AI Usage Log se mantiene actualizado durante toda la sesión

## Cómo agregar una skill

1. Crear `.claude/skills/<nombre>/SKILL.md` con frontmatter (`name`, `description` con triggers).
2. Si tiene mucho contenido: split en `references/<topic>.md`.
3. Listarla en `.claude/INDEX.md`.
4. Si tiene workflow trigger ("después de tocar X, suggest esto"), agregarlo a CLAUDE.md.

## Cómo agregar una rule

1. Crear `.claude/rules/<nombre>.md` con frontmatter `paths:` listando globs.
2. Listarla en `.claude/INDEX.md` (tabla "Rules auto-cargadas").
