# Gotchas — emi-challenge

> Read when: vas a tocar env config, setup, tests, o después de un fallo inesperado de build/CI.

## Datos & encoding

- **`candidates.json` tiene caracteres con tildes/ñ** (nombres, ubicaciones, carreras en español). El archivo original venía con encoding raro (`Ã­` en lugar de `í`, etc). La versión guardada en `data/` ya está normalizada a UTF-8. Si re-importás desde otra fuente, verificar encoding antes.

- **El campo `date` tiene un espacio leading** (`" 2017-12-05 19:21:27.555000"`). Si lo parseás con `new Date()`, JS lo tolera, pero si lo usás como key o lo trimmeás, recordá normalizar.

- **`reason` es string con comas, no array.** Para multi-select hay que `split(", ")` y join al guardar. Cuidado con razones que contengan comas internas (revisar los datos antes de asumir el split es safe — ej: "PwC, S.A." sería un problema).

## Lógica de aprobación

- **`reason === ""` significa aprobado.** No hay campo `status`. La UI debe derivar el badge approved/rejected de `reason`.
- **Aprobar manualmente** = `PATCH /api/candidates/:id` con `{ reason: "" }`. Limpia todas las razones.
- **Rechazar manualmente** = `PATCH /api/candidates/:id` con `{ reason: "razón1, razón2" }`. Reemplaza, no appendea.

## Estado in-memory

- **El server pierde mutaciones al reiniciar.** Es esperado por el enunciado ("dummy endpoints OK"). Si lo deployas o reiniciás durante demo, los cambios manuales vuelven al estado inicial del JSON.
- **No hay locking ni concurrencia real.** Múltiples PATCHes simultáneos no van a corromper estado en el setup actual (Node single-thread), pero no es production-grade.

## Vite proxy

- **CORS no es necesario en dev** porque Vite proxy redirige `/api/*` al server. Si testeas el client contra un server fuera del proxy, agregar `cors()` middleware al server.
- **Cambios en `vite.config.ts` requieren restart** del dev server.

## TypeScript

- **Strict mode prendido.** No `any`, no `as` salvo en boundaries documentadas (parsing JSON externo, etc).
- **Types entre client y server están duplicados** (no es monorepo). Cambio en un lado → actualizar el otro. Mantenelos sincronizados.
- **`tsconfig.json` separados** para client y server. Diferentes `target` y `lib`.

## Tailwind

- **Las clases se purgan en build.** Si una clase está armada dinámicamente con string concat (`"bg-" + color + "-500"`), Tailwind no la detecta y la purga. Solución: usar lookup table con clases completas: `{ red: "bg-red-500", green: "bg-green-500" }`.
- **El `content:` del config debe incluir todos los paths donde se usan clases**, incluyendo `src/**/*.{ts,tsx}`.

## Tests

- **No tests para JSON data files** — testear el código que los procesa, no los archivos.
- **Mocks de fetch en componentes**: preferir `msw` (Mock Service Worker) sobre mockear `fetch` global. Más realista y reusable.
- **No mockear el server cuando hay un test de integración** — correr el server real con datos de fixture es preferible.

## Performance

- **63 candidatos no requiere virtualización** — render full es OK. Si la lista crece a >500, considerar virtual scrolling (react-virtuoso / @tanstack/virtual).
- **Re-renders por columna toggle**: usar `memo` en `CandidatesTable` si el toggle de columnas causa re-render visible. Probar primero, optimizar después.

## AI Usage Log

- **Es ENTREGABLE.** Si lo olvidás de actualizar durante la sesión, vas a tener que reconstruirlo después (peor honestidad, peor calidad). Mantener al día.
- **Loggear también las cosas que NO hiciste pero considerar**: alternativas descartadas, prompts que te llevaron a callejones sin salida, decisiones de cuándo NO usar Claude.

## Git

- **`.git/info/exclude` blindea** `CLAUDE.md`, `.claude/`, `.codegraph/`, `task-*.md`, `AI_USAGE_LOG.md`, `CLAUDE_INFRA.md`. Verificar con `git check-ignore -v <file>` si tenés dudas.
- **El AI_USAGE_LOG.md NO se commitea al repo** del challenge — se entrega como artefacto separado. Si Emi pide commitearlo, mover de exclude a tracked en ese momento.
