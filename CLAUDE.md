# CLAUDE.md — emi-challenge

Router del proyecto. Se lee al inicio de cada sesión; el resto se carga on-demand según [.claude/RETRIEVAL.md](.claude/RETRIEVAL.md).

## Qué es este repo

`emi-challenge` — React challenge para Emi. Frontend: React + Vite + TypeScript + Tailwind. Backend: Express + TypeScript. Node 20, npm.

Pide implementar un dashboard de reclutador que (1) lee candidatos desde un JSON con columnas dinámicas configurables, y (2) permite re-clasificar candidatos manualmente (aprobar / rechazar con razones). Entregable incluye un **AI Usage Log** con detalle de cómo se usó Claude — eso es parte fundamental de la evaluación.

## Routing

- Lookup de skills/docs → [.claude/INDEX.md](.claude/INDEX.md)
- Cuándo cargar qué → [.claude/RETRIEVAL.md](.claude/RETRIEVAL.md)
- Memoria del proyecto (decisiones, trade-offs) → [.claude/MEMORY.md](.claude/MEMORY.md)
- Guía para humanos → [.claude/README.md](.claude/README.md)

## Workflow triggers

- **Cada interacción significativa** (prompt nuevo, decisión, archivo creado/modificado): registrar en `AI_USAGE_LOG.md` siguiendo `/ai-usage-log`. Es el entregable obligatorio del challenge.
- **Antes de codear una feature**: `/brainstorming` para explorar diseño cuando hay ambigüedad. Luego task doc con AC en Given/When/Then.
- **Después de cambio no-trivial** (≥3 archivos o lógica nueva): `npm run lint` → `npm run typecheck` → `npm test` → si UI, verificar en dev → sugerir `/code-review-excellence`.
- **Bug**: `/diagnose` — reproducir → minimizar → fix → test que cubra la regresión.
- **Pre-entrega**: `npm run validate` verde, generar AI Usage Log final, smoke test manual de Part 1 + Part 2.

## Mapa de 30 segundos

```
coding-cha/
├── enunciado.md            consigna del challenge
├── data/                   candidates.json + columns.json (input data)
├── client/                 React + Vite + TS + Tailwind
│   └── src/
│       ├── api/            fetch wrappers
│       ├── components/     CandidatesTable, ColumnConfig, RejectModal
│       ├── hooks/          useCandidates, useColumns
│       ├── types/          Candidate, Column types
│       └── App.tsx
├── server/                 Express + TS
│   └── src/
│       ├── routes/         candidates.ts, columns.ts, reasons.ts
│       ├── services/       data layer (reads JSON, in-memory state)
│       └── index.ts        express bootstrap
├── task-emi-challenge.md   task doc (AC + plan + log)
└── AI_USAGE_LOG.md         entregable del challenge
```

Path aliases (cuando estén configurados): `@/*` (client), `@server/*` (server).

## Comandos más usados

```bash
npm run dev           # arranca client + server en paralelo
npm run lint          # eslint en client + server
npm run typecheck     # tsc --noEmit en client + server
npm test              # vitest
npm run build         # build de producción
npm run validate      # lint + typecheck + test (pre-entrega gate)
```

Lista completa → [.claude/docs/commands.md](.claude/docs/commands.md).

## CodeGraph

Repo indexado (`.codegraph/` con tree-sitter + SQLite + FTS5). El MCP server `codegraph_*` está registrado globalmente — las tools están disponibles sin config adicional.

**Usar codegraph antes que grep/Read para queries estructurales:**
- `codegraph_search` para "dónde está definido X"
- `codegraph_callers` / `codegraph_callees` para call-flow
- `codegraph_impact` antes de refactorizar algo compartido
- `codegraph_context` + UN `codegraph_explore` para preguntas de arquitectura

Reglas completas en `~/.claude/CLAUDE.md`. File watcher auto-sync (~500ms). `.codegraph/` blindado en `.git/info/exclude`.

## Hard rules

- **No comments en código ni tests.** Nunca. Los nombres son la documentación. Excepción única: restricción genuinamente oculta que un lector no podría deducir.
- **Verificación antes de declarar done.** Correr el comando fresh, leer el output completo. "Debería andar" sin haberlo corrido no es evidencia.
- **NEVER commit/push sin permiso explícito.** Completar la tarea ≠ permiso para `git commit` o `git push`. Pedir siempre.
- **NEVER agregar trailer `Co-Authored-By: Claude`.** El autor visible es solo el humano.
- **AI Usage Log es obligatorio.** Cada decisión, prompt, alternativa descartada, configuración usada — al log. La honestidad y detalle es parte de la evaluación.
- **TypeScript strict.** No `any` salvo en boundary explícito documentado. Tipos para todos los DTOs entre client y server.
