# Commands — emi-challenge

> Read when: necesitás un comando que no está en CLAUDE.md "Most-used".

## Setup inicial (una vez)

```bash
# Bootstrap del client (Vite + React + TS + Tailwind)
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Bootstrap del server (Express + TS)
cd ../server
npm init -y
npm install express cors
npm install -D typescript @types/node @types/express @types/cors tsx vitest

# Scripts root (concurrently para correr ambos)
cd ..
npm init -y
npm install -D concurrently
```

## Desarrollo

```bash
# Todo a la vez (recomendado)
npm run dev

# Por separado
cd client && npm run dev   # Vite en :5173
cd server && npm run dev   # Express en :3001
```

## Verificación

```bash
npm run lint              # eslint client + server
npm run typecheck         # tsc --noEmit en client + server
npm test                  # vitest en client + server
npm run validate          # lint + typecheck + test (pre-entrega gate)
```

Verificación por carpeta:

```bash
cd client && npm run lint
cd client && npm run typecheck
cd server && npm test
```

## Build

```bash
npm run build             # build de producción de client + server
cd client && npm run build   # solo client → dist/
cd server && npm run build   # solo server → dist/
```

## Tests

```bash
# Vitest watch mode (dev)
cd client && npx vitest

# Run once + coverage
cd client && npx vitest run --coverage

# Solo un archivo
cd client && npx vitest run src/components/CandidatesTable.test.tsx
```

## CodeGraph

```bash
codegraph status .                              # health check del index
codegraph sync .                                # forzar re-sync si parece desfasado
codegraph search "CandidatesTable" .            # buscar símbolo
codegraph callers "approveCandidate" .          # quién llama X
```

## Git

```bash
git status
git log --oneline --graph -20
git diff
git diff --staged
git branch
```

Para commit/push: pedir permiso explícito al usuario antes.

## AI Usage Log

No hay comando CLI — invocar `/ai-usage-log` desde Claude para appendear al `AI_USAGE_LOG.md`.

## Troubleshooting

```bash
# Port 3001 ocupado
lsof -ti:3001 | xargs kill -9

# Port 5173 ocupado
lsof -ti:5173 | xargs kill -9

# Cache de Vite raro
rm -rf client/node_modules/.vite

# Reset total de dependencias
rm -rf client/node_modules server/node_modules node_modules
npm install && cd client && npm install && cd ../server && npm install
```
