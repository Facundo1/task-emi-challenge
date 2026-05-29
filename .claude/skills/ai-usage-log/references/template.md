# AI_USAGE_LOG.md — Template inicial

> Esta es la plantilla de arranque para `AI_USAGE_LOG.md`. Se copia al root del proyecto la primera vez que se invoca `/ai-usage-log` o cuando arranca el challenge. Después se appendea durante toda la sesión.

```markdown
# AI Usage Log — Emi React Challenge

> Detailed log of AI usage during the challenge, as required by the deliverable.
> Author: Facundo Loberse
> Primary tool: Claude Code (Anthropic) — Opus 4.7 model
> Started: <fecha>

## Summary

- **Total interactions logged:** _to be completed_
- **Time span:** _to be completed_
- **Primary AI tool:** Claude Code (CLI + VSCode extension)
- **MCP servers used:** CodeGraph (semantic code search)
- **Configuration approach:** layered context system in `.claude/` — see Appendix A

## Workflow approach

I structured my AI collaboration around a layered context system in `.claude/`:

- **CLAUDE.md** (≤80 lines, project router) loaded each session
- **`.claude/INDEX.md`** maps each request type to the right skill/doc/rule
- **`.claude/skills/`** — invocable via `/skill-name`, each ≤120 lines, with decision trees
- **`.claude/rules/`** — auto-loaded based on file path patterns (TypeScript strict, React conventions, etc.)
- **CodeGraph MCP** — tree-sitter AST + SQLite index for semantic code queries (instead of grep)

This layered approach keeps Claude's working context minimal (~35-55% token savings vs. dumping everything in one CLAUDE.md), which improves response quality and reduces hallucination.

I logged every significant decision in real time using the `/ai-usage-log` skill, capturing alternatives considered, prompts that didn't work, and what I chose not to delegate to AI.

---

## Detailed log (chronological)

### Entry 1 — <YYYY-MM-DD HH:MM> — Infrastructure setup

**Trigger:** Start of challenge. Decision to set up Claude Code infrastructure before writing any code.

**Prompt / Request:**
> "Tengo este enunciado de práctica pero todavía no quiero empezar, sino que quiero acomodar absolutamente toda la documentación de Claude... con esta información puedes arrancar a hacer algo o necesitas esperar los archivos json?"

**AI action:**
- Read the existing `CLAUDE_INFRA.md` playbook
- Proposed variables (PROJECT_NAME, STACK, etc.) inferred from the challenge description
- Asked for confirmation on remaining ambiguities (TypeScript, Tailwind, separation of front/back, AI log skill)
- Generated `CLAUDE.md`, `.claude/INDEX.md`, `.claude/RETRIEVAL.md`, `.claude/MEMORY.md`, `.claude/README.md`, `.claude/settings.local.json`
- Generated docs (architecture, commands, gotchas, git-workflow)
- Generated auto-load rules (typescript-strict, react-conventions, api-conventions, test-conventions)
- Generated 8 skills (4 core + 3 stack + 1 ai-usage-log)
- Initialized git locally + blindó archivos Claude en `.git/info/exclude`

**Alternatives considered:**
- _A) Start coding directly with minimal Claude setup_ — descartada: el log de AI usage es parte de la evaluación, montar la infra correctamente es inversión que paga durante todo el challenge.
- _B) Just a single `CLAUDE.md` file with everything_ — descartada: 500+ líneas se cargan cada turno, ensucia contexto, peor calidad de respuestas.
- _C) Layered system (chosen)_ — router corto + INDEX + skills/docs/rules on-demand. ~35-55% menos tokens según mediciones previas.

**Decision:** Layered system per `CLAUDE_INFRA.md` playbook, adapted to React+Vite+TS+Tailwind / Express+TS stack.

**Outcome:** Infra completa generada. AI_USAGE_LOG.md inicializado (este archivo).

**Honesty note:** El stack (React+Vite+TS, Express+TS) se decidió por defaults razonables del playbook. No se exploraron tradeoffs profundos contra Next.js o Fastify porque el challenge tiene scope acotado y los defaults son apropiados.

---

<!-- Append nuevas entries acá -->

---

## Appendix A — Claude Code configuration files

- `CLAUDE.md` — project router (≤80 lines, en español)
- `.claude/INDEX.md` — skill/doc/rule lookup index (≤50 lines)
- `.claude/RETRIEVAL.md` — when-to-load rules (cap: 1 doc + 1 skill + 2 refs per turn)
- `.claude/MEMORY.md` — project decisions log
- `.claude/README.md` — human-facing guide to the system
- `.claude/settings.local.json` — permissions (allow/ask/deny lists), `attribution.commit=""` to disable Co-Authored-By, `outputStyle: "Concise"`
- `.claude/docs/architecture.md` — boot flow, data flow, decisions
- `.claude/docs/commands.md` — full command reference
- `.claude/docs/gotchas.md` — quirks (JSON encoding, in-memory state, Tailwind purge, etc.)
- `.claude/docs/git-workflow.md` — trunk-based, commit format, hard rules
- `.claude/rules/typescript-strict.md` — auto-loaded on `**/*.ts(x)`
- `.claude/rules/react-conventions.md` — auto-loaded on `client/**`
- `.claude/rules/api-conventions.md` — auto-loaded on `server/**`
- `.claude/rules/test-conventions.md` — auto-loaded on `**/*.test.*`

## Appendix B — Skills available

| Skill | Purpose |
|---|---|
| `/brainstorming` | Design exploration before coding |
| `/clean-code` | Cleanup pass: dead code, naming, simplification |
| `/code-review-excellence` | Rigorous review before declaring done |
| `/diagnose` | Disciplined debugging loop |
| `/react-patterns` | React composition, hooks, state, performance |
| `/express-api` | Express routes, services, middleware, error handling |
| `/tailwind-ui` | Tailwind composition, theming, responsive |
| `/ai-usage-log` | This very log — append + consolidate |

## Appendix C — MCP servers

- **codegraph** — registered globally in `~/.claude.json`. Tree-sitter AST + SQLite + FTS5 index of the codebase. Used for semantic queries (where is X defined, what calls Y, impact of changing Z) instead of grep.

## Appendix D — Skills usage count

_To be completed at consolidate time._

## Appendix E — Prompts that didn't work

_To be appended as encountered._

## Appendix F — What I did NOT delegate to AI

_To be appended as encountered. Examples: code I read line-by-line before accepting, decisions I made manually, validations I ran by hand._

## Appendix G — Token / cost transparency (optional)

_If available from Claude Code telemetry, mention rough token usage and cost. Else omit._
```
