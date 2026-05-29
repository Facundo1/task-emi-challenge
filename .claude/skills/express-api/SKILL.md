---
name: express-api
description: >
  Patrones Express + TypeScript para el server del challenge: routes, services, middleware,
  error handling, DTOs. Úsala cuando trabajás en server/, cuando hay que decidir cómo
  organizar endpoints, validar input, o manejar errores. Triggers: edits en server/**,
  "endpoint", "ruta", "middleware", "error handling", "API contract".
---

# Express API — emi-challenge

## Cuándo se activa

- Trabajás dentro de `server/`
- Diseñando un endpoint nuevo
- Decidiendo cómo validar input, manejar errores, organizar services

## Stack

Express + TypeScript + tsx (dev watch) + Vitest + supertest. Estado in-memory (no DB).

## Decision tree

| Si la pregunta es sobre... | Cargar... |
|---|---|
| Código de ejemplo de route/service/middleware | [references/patterns.md](references/patterns.md) |
| Extracción de razones únicas, lógica de mutación | [references/data-logic.md](references/data-logic.md) |

## Estructura

```
server/src/
├── routes/             route handlers, thin
├── services/           lógica de negocio, thick
├── middleware/         error handler, request logger, asyncHandler
├── types/              DTOs + domain types
└── index.ts            bootstrap
```

## Endpoints del challenge

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/candidates` | `Candidate[]` |
| `GET` | `/api/candidates/:id` | `Candidate` o 404 |
| `PATCH` | `/api/candidates/:id` | `Candidate` actualizado. Body: `{ reason: string }` |
| `GET` | `/api/columns` | `ColumnsConfig` (mapa `string -> boolean`) |
| `GET` | `/api/reasons` | `string[]` (razones únicas) |

## Convenciones REST

- Plural en collections (`/candidates`, no `/candidate`).
- `:id` en path para resource específico.
- **PATCH** (no PUT) para mutaciones parciales.
- Status codes correctos: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal.

## Principios

- **Routes thin, services thick.** Route valida input, llama service, formatea response. La lógica vive en services.
- **Errores como excepciones tipadas + middleware central** — no `res.status(500)` esparcidos.
- **Validar body** de PATCH antes de pasarlo al service. Rechazar payloads no esperados con 400.
- **No swallowear errores** — try/catch sin re-throw que loggea y sigue es un bug.
- **No hardcodear paths** de JSON files dispersos. Centralizar en config o constante.

## CORS

En dev: Vite proxy lo evita. No agregar `cors()` si no hace falta. Si exponés fuera del proxy, agregar middleware con origin allowlist explícito.

## Anti-patterns

- Lógica de negocio en route handlers.
- `res.send` mezclado con `res.json` — pick uno y consistir.
- Try/catch en cada handler en vez de error middleware.
- Exponer stacktrace completo en error responses de prod.
- Mutar `req` o `res` con campos custom sin tipar.

## Cross-checking

```bash
cd server && npm run lint && npm run typecheck && npx vitest run
```

Smoke test manual:

```bash
curl http://localhost:3001/api/candidates | jq 'length'
curl -X PATCH http://localhost:3001/api/candidates/<id> \
  -H "Content-Type: application/json" -d '{"reason": ""}'
```

## Hard rules

- Routes thin, services thick.
- Error middleware centralizado, no `res.status(500)` ad-hoc.
- Validación de body antes de service.
- Status codes correctos.
- No comments (política del proyecto).
- No `any` en types públicos.
