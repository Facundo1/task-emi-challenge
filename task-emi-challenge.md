# task-emi-challenge — React Challenge for Emi

## Contexto

Challenge técnico de Emi para puesto frontend/full-stack. Construir un dashboard de reclutador que (1) muestra candidatos screened con configuración de columnas dinámica, y (2) permite re-clasificar manualmente (aprobar / rechazar con razones).

Datos en `data/candidates.json` (63 candidatos) y `data/columns.json` (config de visibilidad). Lógica de aprobación: `reason === ""` significa aprobado; cualquier otro valor significa rechazado (razones separadas por coma).

Entregable explícito adicional: **AI Usage Log detallado** que documente uso de herramientas AI durante el challenge. Calidad y honestidad del log son parte de la evaluación.

<!-- Marcar ambigüedades con [NEEDS CLARIFICATION: qué no está claro] -->

[NEEDS CLARIFICATION: ¿La columns config debe ser modificable en runtime por el recruiter (ColumnConfig UI), o es solo configuración inicial? El enunciado no es explícito. Asunción inicial: implementar GET endpoint que la lee tal cual del JSON, y opcionalmente agregar toggle en runtime si hay tiempo — eso cae bajo "otras features útiles para la list view".]

[NEEDS CLARIFICATION: ¿La lista de razones disponibles (`GET /api/reasons`) viene de dónde? El enunciado dice "API to retrieve the list of available rejection reasons" pero no define la fuente. Asunción: extraer razones únicas de los candidatos existentes en `candidates.json`. Alternativa: lista hardcoded en el server. La primera es más coherente con "AI feedback loop".]

## Acceptance Criteria

### Part 1 — Display candidates

- **Given** el server corriendo y `data/candidates.json` con 63 candidatos, **When** el client hace GET a `/api/candidates`, **Then** retorna los 63 candidatos con todos sus campos.
- **Given** el server corriendo, **When** el client hace GET a `/api/columns`, **Then** retorna el mapa de columnas con su visibilidad (true/false).
- **Given** `columns.json` con `name=true, cv_bumeran=false, has_university=false, ...`, **When** la tabla renderiza, **Then** muestra solo las columnas con `true`, en el orden definido por el JSON.
- **Given** un candidato con `reason === ""`, **When** se renderiza la fila, **Then** se muestra un indicador visual de "Approved".
- **Given** un candidato con `reason` no vacío, **When** se renderiza la fila, **Then** se muestra "Rejected" y las razones son visibles (al menos en el campo `reason`).
- **Given** la tabla cargando, **When** el fetch tarda, **Then** se muestra un loading state. **When** el fetch falla, **Then** se muestra un error state recoverable.
- **Implementadas o nombradas** otras features útiles para list view (filtros, búsqueda, orden, paginación, toggle de columnas, detalle, bulk actions, export). Mínimo: nombrar 3 en el README/log, implementar 1.

### Part 2 — Reclassify candidates

- **Given** un candidato rechazado, **When** el recruiter clickea "Approve" y confirma, **Then** se llama `PATCH /api/candidates/:id` con `{ reason: "" }`, y la tabla refleja el cambio (el badge pasa a "Approved", `reason` se vacía).
- **Given** un candidato aprobado, **When** el recruiter clickea "Reject", **Then** se abre un modal/dropdown que primero hace `GET /api/reasons` para obtener las razones disponibles.
- **Given** el modal abierto, **When** el recruiter selecciona una o más razones y confirma, **Then** se llama `PATCH /api/candidates/:id` con `{ reason: "<razones, separadas por coma>" }`, y la tabla refleja el cambio.
- **Given** una mutation en curso, **When** falla la API, **Then** se hace rollback del optimistic update y se muestra error al usuario.

### Cross-cutting

- **TypeScript strict** sin `any` en código propio. `tsc --noEmit` pasa limpio.
- **Tests** cubren al menos: derivación approved/rejected, extracción de razones únicas, endpoint GET candidates 200, endpoint PATCH 404, componente CandidatesTable con columnas dinámicas, flujo de approve via user event.
- **Lint** pasa limpio.
- **AI Usage Log** está al día durante toda la sesión y consolidado pre-entrega.

## Plan

1. **Setup del repo** → verify: `npm run validate` (cuando exista) y `git status` limpio
   - `client/` con Vite + React + TS + Tailwind bootstrap
   - `server/` con Express + TS bootstrap
   - root `package.json` con `concurrently` para `npm run dev`
   - Scripts: `dev`, `lint`, `typecheck`, `test`, `build`, `validate` en root y por carpeta

2. **Backend Part 1** → verify: curl a los 3 endpoints retorna data correcta
   - `dataLoader.ts` lee `data/candidates.json` y `data/columns.json` al startup
   - `candidatesService` con `findAll`, `findById`, `update`
   - Routes: `GET /api/candidates`, `GET /api/columns`, `GET /api/reasons`
   - Middleware: error handler central, request logger
   - Test: supertest sobre los 3 endpoints

3. **Frontend Part 1** → verify: tabla renderiza 63 candidatos con columnas correctas en el browser
   - Types compartidos (`Candidate`, `ColumnsConfig`)
   - `api/` con `getCandidates`, `getColumns`, `getReasons`
   - `useCandidates`, `useColumns` hooks (con FetchState discriminated union)
   - `CandidatesTable` con columnas dinámicas, badge approved/rejected
   - Loading + error states
   - Test: render con fixture, columnas dinámicas, badge

4. **Backend Part 2** → verify: curl PATCH funciona, GET /reasons retorna lista no vacía
   - `PATCH /api/candidates/:id` con validación de body
   - `GET /api/reasons` extrayendo razones únicas
   - Test: PATCH 200 y 404, reasons no vacía

5. **Frontend Part 2** → verify: aprobar y rechazar funcionan visualmente
   - `ApproveButton` con confirmación
   - `RejectModal` con multi-select de razones (`GET /api/reasons` al abrir)
   - Optimistic updates con rollback
   - Test: user event de approve dispara el callback con id, reject dispara con razones seleccionadas

6. **Features extra (al menos 1 implementada, 3 nombradas)** → verify: feature funciona o está documentada
   - Sugerencias: filtro por estado, búsqueda por nombre, ordenamiento, toggle de columnas en runtime
   - Implementar la más alto-impacto-bajo-costo

7. **Pulido + verificación end-to-end** → verify: `npm run validate` verde
   - `/code-review-excellence` pasada completa
   - `/clean-code` pasada de limpieza final
   - Smoke test manual: Part 1 + Part 2 en el browser
   - README breve con instrucciones de arranque

8. **AI Usage Log consolidación** → verify: archivo refleja honestamente el trabajo
   - Repasar todas las entries
   - Completar appendices A-G
   - Re-leer asumiendo evaluador escéptico
   - Decidir formato de entrega (incluido en zip vs separado)

## Cambios

<!-- Append fecha + qué se hizo + archivos tocados + decisiones tomadas -->

- 2026-05-27 — Infraestructura Claude Code completa generada: `CLAUDE.md`, `.claude/` con docs/rules/skills (8), `task-emi-challenge.md` (este archivo), `AI_USAGE_LOG.md` inicializado, git init local con blindaje en `.git/info/exclude`. Data files copiados a `data/`. Sin código de aplicación todavía.
