# Project Memory — emi-challenge

> Memoria del proyecto. Append-only. Pruna lo más viejo cuando una sección supere ~20 entradas.

## Active Decisions

- 2026-05-27: **Stack confirmado** — React + Vite + TypeScript + Tailwind (client) / Express + TypeScript (server). Razón: stack más natural para un challenge frontend-pesado donde TS demuestra rigor y Tailwind permite UI rápida sin custom CSS. Vite > CRA por velocidad de DX. Express > Fastify por familiaridad de los evaluadores.
- 2026-05-27: **Carpetas separadas** `client/` y `server/`. Razón: claridad para el evaluador, cada parte se puede correr y testear de forma independiente. Compartiremos types vía un import path o copia mínima — sin monorepo overhead.
- 2026-05-27: **AI Usage Log como entregable de primera clase** — el enunciado pide explícitamente un log detallado y la calidad/honestidad cuenta en la evaluación. Mantener `AI_USAGE_LOG.md` actualizado durante toda la sesión vía la skill `/ai-usage-log`.

## Known Trade-offs

- **In-memory state en el server** vs persistencia real: elegido in-memory porque el enunciado lo permite ("dummy API endpoints son OK"). Trade-off: el estado se pierde al reiniciar; documentado en gotchas.
- **No monorepo** vs npm workspaces: elegidas carpetas separadas con sus propios `package.json`. Trade-off: types compartidos se duplican o copian. Beneficio: setup más simple para el evaluador, menos magia.

## Routing Misses

<!-- Casos donde cargué la skill/doc equivocada. Una línea cada uno. Sirve para refinar triggers de INDEX.md. -->

## Doc Drift Log

<!-- Cuando un doc contradijo al código, cuál ganó, y el patch. -->

## Skill Effectiveness Log

<!-- - <skill>: funcionó bien para <caso>; débil para <caso> -->

## Recent Decisions (rolling, last 20)

<!-- Append at top. Prune from bottom cuando >20. -->
