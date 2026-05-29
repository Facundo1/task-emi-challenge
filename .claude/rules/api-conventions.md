---
paths:
  - "server/**/*.ts"
---

# API Conventions — emi-challenge

Auto-cargada al editar archivos del server.

## Reglas no negociables

1. **Routes thin, services thick.** El route handler valida input, llama service, formatea response. La lógica vive en services.
2. **Errores como excepciones tipadas + middleware central** — no `res.status(500)` esparcidos.
3. **Una responsabilidad por archivo de route.**

## Estructura

```
server/src/
├── routes/
│   ├── candidates.ts   GET /, GET /:id, PATCH /:id
│   ├── columns.ts      GET /
│   └── reasons.ts      GET /
├── services/
│   ├── candidatesService.ts   read/update
│   └── dataLoader.ts          carga inicial desde JSON
├── middleware/
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── types/
│   └── api.ts          DTOs + domain types
└── index.ts            bootstrap
```

## Endpoints (Part 1 + Part 2)

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/candidates` | `Candidate[]` |
| `GET` | `/api/candidates/:id` | `Candidate` o 404 |
| `PATCH` | `/api/candidates/:id` | `Candidate` actualizado o 404. Body: `{ reason: string }` |
| `GET` | `/api/columns` | `ColumnsConfig` (mapa `string -> boolean`) |
| `GET` | `/api/reasons` | `string[]` (razones únicas extraídas de candidates) |

Convenciones:

- **Plural en collections** (`/candidates`, no `/candidate`).
- **`:id` en path** para resource específico.
- **PATCH** (no PUT) para mutaciones parciales.
- **Status codes correctos**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal.

## Patrones

### Route handler

```ts
router.get("/:id", asyncHandler(async (req, res) => {
  const candidate = await candidatesService.findById(req.params.id);
  if (!candidate) throw new NotFoundError(`Candidate ${req.params.id} not found`);
  res.json(candidate);
}));
```

### Service

```ts
export const candidatesService = {
  findAll(): Candidate[] { ... },
  findById(id: string): Candidate | null { ... },
  update(id: string, patch: Partial<Candidate>): Candidate { ... },
};
```

### Error handling

- **Errores tipados**: `NotFoundError`, `ValidationError`, etc. extienden `Error`.
- **Middleware central** mapea cada tipo a status code + payload.
- **No swallowear errores** — un `try/catch` sin re-throw que loggea y sigue es bug.

### Validación de input

- Validar body de PATCH antes de pasarlo al service. Schema simple inline o zod si crece.
- Rechazar payloads no esperados con 400, no aceptar y ignorar.

## Qué NO hacer

- Lógica de negocio en route handlers.
- Mutar request/response objects más allá de lo necesario.
- `res.send(...)` mixed con `res.json(...)` — pick uno y consistir.
- `console.log` para errores en prod — usar el middleware logger.
- Hardcodear paths de archivos JSON (`./data/candidates.json` en literal) — pasar por config/constante.
- Exponer detalles de stacktrace a clientes en respuestas de error (solo en dev).

## CORS

- En dev: Vite proxy lo evita. No agregar `cors()` si no hace falta.
- Si en algún momento exponés el server fuera del proxy (deploy, testing tool externa), agregar `cors()` middleware con origin allowlist explícito.

## Cross-checking

```bash
cd server && npm run lint
cd server && npm run typecheck
cd server && npx vitest run
```

Smoke test manual:

```bash
curl http://localhost:3001/api/candidates | jq 'length'        # cantidad
curl http://localhost:3001/api/columns | jq                    # config
curl http://localhost:3001/api/reasons | jq                    # razones únicas
curl -X PATCH http://localhost:3001/api/candidates/<id> \
  -H "Content-Type: application/json" \
  -d '{"reason": ""}'                                          # approve
```
