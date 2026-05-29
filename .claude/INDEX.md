# Claude Context Index

> Router top-level. Cargar una vez vía [CLAUDE.md](../CLAUDE.md). NO autocargar nada de abajo — leer solo cuando matchea el trigger.

## Límites duros

CLAUDE.md ≤80 líneas · SKILL.md ≤120 líneas · reference ≤300 líneas · INDEX.md ≤50 líneas.

## Rules auto-cargadas (`.claude/rules/`)

Se inyectan automáticamente cuando se editan paths que matchean el frontmatter `paths:`. No leer manualmente.

| File | Triggers on |
|---|---|
| [rules/typescript-strict.md](rules/typescript-strict.md) | `**/*.ts`, `**/*.tsx` |
| [rules/react-conventions.md](rules/react-conventions.md) | `client/**/*.tsx`, `client/**/*.ts` |
| [rules/api-conventions.md](rules/api-conventions.md) | `server/**/*.ts` |
| [rules/test-conventions.md](rules/test-conventions.md) | `**/*.test.*`, `**/*.spec.*` |

## Docs (`.claude/docs/`)

| File | Read when |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Boot flow, data flow, dónde vive qué, cross-module |
| [docs/commands.md](docs/commands.md) | Comando no listado en CLAUDE.md "Most-used" |
| [docs/gotchas.md](docs/gotchas.md) | Fallo build/CI, env quirks, particularidades del setup |
| [docs/git-workflow.md](docs/git-workflow.md) | **ANTES de crear branch, commit, push, o PR** |

## Skills (`.claude/skills/`)

| Skill | Trigger keywords |
|---|---|
| `/brainstorming` | "diseñemos", "pensemos", "tradeoffs", "vamos a explorar" |
| `/clean-code` | "limpiá", "refactor", "simplificá", "dead code" |
| `/code-review-excellence` | "revisá", "review", post-implementación de feature |
| `/diagnose` | "bug", "no funciona", "está roto", "debug" |
| `/react-patterns` | client/ — componentes, hooks, estado, performance |
| `/express-api` | server/ — routes, middleware, error handling, DTOs |
| `/tailwind-ui` | estilos, theming, responsive, dark mode |
| `/ai-usage-log` | "actualizá el log", "loggear", "entregable AI", fin de sesión |

## Precedencia de routing (request multi-skill)

1. Si el usuario menciona "bug" o algo roto → `/diagnose` primero, después la skill del área.
2. Si toca client y server → leer la skill del área principal del cambio; usar la otra como reference si hay duda.
3. Antes de empezar una feature ambigua → `/brainstorming` primero.
4. Después de toda interacción significativa → registrar en `/ai-usage-log`.

## Reglas de carga

Ver [RETRIEVAL.md](RETRIEVAL.md). **Cap duro: 1 doc + 1 skill + 2 references por turno.**
