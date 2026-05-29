# Architecture — emi-challenge

> Read when: pregunta sobre cómo bootea la app, cómo fluye la data, qué vive dónde, cross-module.

## Boot flow

### Server (`server/`)
1. `npm run dev` (server) → `tsx watch src/index.ts`
2. Express bootea en `localhost:3001`
3. Lee `data/candidates.json` y `data/columns.json` UNA vez al startup → estado in-memory mutable
4. Registra middleware: cors, json body parser, error handler
5. Monta routers: `/api/candidates`, `/api/columns`, `/api/reasons`

### Client (`client/`)
1. `npm run dev` (client) → `vite` en `localhost:5173`
2. Vite proxy `/api/*` → `http://localhost:3001`
3. `<App>` monta y dispara fetch de `/api/candidates` + `/api/columns` en paralelo
4. Tailwind procesa estilos en build-time (no runtime)

### Combined dev
- `npm run dev` (root) → `concurrently` corre client + server simultáneamente

## Data flow

```
candidates.json ─┐
columns.json ────┤
                 ▼
            [server: in-memory store]
                 │
        GET /api/candidates ───────► CandidatesTable
        GET /api/columns ───────────► ColumnConfig
        GET /api/reasons ───────────► RejectModal (dropdown)
                 │
        PATCH /api/candidates/:id ──► mutación in-memory
                                       └─► client re-fetch o optimistic update
```

## Dónde vive qué

### Client (`client/src/`)

- `api/` — wrappers de `fetch` con tipos. Una función por endpoint (`getCandidates`, `getColumns`, `getReasons`, `approveCandidate`, `rejectCandidate`).
- `components/` — UI presentacional + container components:
  - `CandidatesTable` — la tabla con columnas dinámicas
  - `ColumnConfig` — toggle de visibilidad de columnas (feature extra opcional)
  - `RejectModal` — modal con multi-select de razones
  - `ApproveButton` / `RejectButton` — acciones por fila
- `hooks/` — `useCandidates`, `useColumns`, `useReasons`. Fetch + estado local.
- `types/` — `Candidate`, `Column`, `Reason` (compartidos via copia con server).
- `App.tsx` — root component, orquesta data fetching y layout.

### Server (`server/src/`)

- `routes/`:
  - `candidates.ts` — `GET /api/candidates`, `GET /api/candidates/:id`, `PATCH /api/candidates/:id` (approve/reject)
  - `columns.ts` — `GET /api/columns`
  - `reasons.ts` — `GET /api/reasons` (lista de razones únicas extraídas de candidates)
- `services/`:
  - `candidatesService.ts` — read/update sobre el store in-memory
  - `dataLoader.ts` — carga inicial desde JSON files
- `middleware/` — error handler, request logger
- `types/` — DTOs compartidos
- `index.ts` — bootstrap de express

## Decisiones arquitectónicas clave

1. **Frontend y backend separados** — no monorepo. Razones: claridad para el evaluador, ownership claro, posibilidad de probar cada parte por separado.

2. **In-memory state en el server** — el enunciado permite "dummy endpoints". Razón: cumplir el spec sin overhead de DB. Se documenta como gotcha: el estado se pierde al reiniciar.

3. **Approval state derivado vs explícito** — `reason === ""` significa aprobado. Razón: respetar la fuente de verdad del enunciado en vez de inventar un campo `status` redundante. La UI deriva el badge "approved/rejected" del valor de `reason`.

4. **Razones extraídas dinámicamente** — `/api/reasons` retorna las razones únicas presentes en candidates, no una lista hardcoded. Razón: mantiene el feedback loop coherente — si un recruiter agrega una razón nueva al rechazar, queda disponible para futuros rechazos.

5. **Columnas como configuración del usuario** — la columns config define lo que se muestra, no lo que se manda. El server siempre manda el candidato completo. Razón: simplifica el server, da flexibilidad al client.

6. **Optimistic UI updates** — al aprobar/rechazar, actualizar el estado local primero, después confirmar con el server. Razón: percepción de velocidad. Rollback si la API falla.

## Cross-module

- **Types**: duplicados entre client y server por simplicidad (no monorepo). Cambio en uno → actualizar el otro. Documentado en gotchas.
- **Vite proxy** evita CORS en dev. En prod (si se desplegara), el server serviría el bundle del client o se configuraría CORS explícito.

## Features extra (mencionadas, no necesariamente implementadas)

Útiles para la list view (parte 1 del enunciado pide "pensar y nombrar"):
- Filtros: por approved/rejected, por carrera, por edad, por ubicación
- Ordenamiento por cualquier columna
- Búsqueda full-text por nombre/email/document
- Paginación o virtual scrolling (60+ candidates → razonable)
- Toggle de columnas en runtime (ColumnConfig)
- Detalle expandible por fila
- Bulk actions (aprobar/rechazar varios)
- Export a CSV
- Dark mode
