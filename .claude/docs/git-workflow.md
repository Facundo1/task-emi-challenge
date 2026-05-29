# Git Workflow — emi-challenge

> **Leer antes de crear branch, commit, push, o PR.**

## Modelo

Trunk-based, single-branch (`main`). Es un challenge individual, no hay equipo, no hay PR review process. Cada commit va a `main`.

## Long-lived branches

| Branch | Rol |
|---|---|
| `main` | Única rama. Histórico lineal de progreso del challenge. |

Nunca force-push a `main`. Si rompiste algo, hacé un commit de revert, no rewriting.

## Branch naming (si decidís separar features)

Para un challenge tan acotado, lo razonable es trabajar en `main`. Si te tentás de hacer feature branches:

- `feat/part-1-list-view`
- `feat/part-2-reclassify`
- `fix/<descripción>`
- `chore/<descripción>`

Crear desde `main`:

```bash
git checkout main && git pull
git checkout -b feat/<nombre>
```

Mergeás de vuelta a `main` con `git merge --no-ff` para preservar el contexto del branch en el history.

## Commit format

Convencional, en inglés. Estructura:

```
<type>: <descripción imperativa corta>

<body opcional con detalle>
```

Types:

- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `chore:` — setup, config, dependencias
- `refactor:` — cambio interno sin cambio observable
- `docs:` — solo docs (incluye CLAUDE.md, README, etc — aunque CLAUDE.md no se commitea, contarías AI_USAGE_LOG si se versionara)
- `test:` — agregar/cambiar tests
- `style:` — formateo, sin cambio de lógica

Ejemplos:

```
feat: add CandidatesTable with dynamic columns
fix: handle empty reason field in approval badge
chore: bootstrap server with express and tsx watch
refactor: extract candidates service from route handler
```

## Reglas

- **NEVER commit/push sin permiso explícito del usuario en el mensaje actual.** Completar la tarea no implica permiso.
- **NEVER skip hooks** (`--no-verify`, etc).
- **NEVER force-push a main** (`--force`, `-f`).
- **NEVER commit secrets** (`.env`, credentials). Verificar el diff antes.
- **NEVER agregar trailer `Co-Authored-By: Claude`** — está bloqueado en `settings.local.json` también.
- **Mensaje en inglés** — match el style de la mayoría de los repos open-source y deja un repo "presentable" para Emi.
- **Un commit, un cambio lógico** — no mezclar feature + fix + refactor en un commit.

## Lo que NO se commitea (`.git/info/exclude`)

- `CLAUDE.md`, `.claude/`, `.mcp.json`, `.codegraph/`, `task-*.md`, `AI_USAGE_LOG.md`, `CLAUDE_INFRA.md`
- `node_modules/`, `dist/`, `build/`, `.env*`, `.DS_Store`

Verificar con:

```bash
git check-ignore -v CLAUDE.md .claude/INDEX.md task-emi-challenge.md
```

Cada uno debe responder con `.git/info/exclude:<linea>`.

## Entrega del challenge

Cuando esté listo para entregar:

1. Verificar que `npm run validate` pasa.
2. Verificar que el `AI_USAGE_LOG.md` está actualizado y consolidado.
3. Crear un zip o tag dependiendo de cómo Emi pida la entrega.
4. **Decidir consciente** si el `AI_USAGE_LOG.md` se incluye en el zip o se entrega aparte (Emi pide entregarlo, así que sí debe ir).
