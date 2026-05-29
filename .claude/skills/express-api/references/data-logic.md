# Express Data Logic — emi-challenge

> Cargado on-demand desde `SKILL.md` cuando la pregunta es sobre la lógica de negocio de los candidatos (razones únicas, mutaciones, derivaciones).

## Extracción de razones únicas

```ts
export function extractUniqueReasons(candidates: Candidate[]): string[] {
  const set = new Set<string>();
  for (const c of candidates) {
    if (!c.reason) continue;
    c.reason.split(",").map((r) => r.trim()).filter(Boolean).forEach((r) => set.add(r));
  }
  return Array.from(set).sort();
}
```

**Cuidado:** si una razón contiene una coma interna, el split la rompe. Verificar en el dataset antes de asumir que es safe. En el dataset actual de Emi, las comas son separadores entre razones, no contenido — safe.

## Service de razones

```ts
import { candidatesService } from "./candidatesService";

export const reasonsService = {
  findAll(): string[] {
    return extractUniqueReasons(candidatesService.findAll());
  },
};
```

Nota: este service es **derivado** del store de candidates. No tiene estado propio. Si en el futuro los recruiters agregan razones nuevas al rechazar, automáticamente aparecen en el listado.

## Service de columnas

```ts
import type { ColumnsConfig } from "../types/api";

let config: ColumnsConfig = {};

export const columnsService = {
  loadInitial(c: ColumnsConfig) { config = { ...c }; },
  findAll(): ColumnsConfig { return config; },
};
```

## DataLoader inicial

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Candidate, ColumnsConfig } from "../types/api";

const DATA_DIR = path.resolve(process.cwd(), "../data");

export async function loadData(): Promise<{ candidates: Candidate[]; columns: ColumnsConfig }> {
  const [candidatesJson, columnsJson] = await Promise.all([
    readFile(path.join(DATA_DIR, "candidates.json"), "utf-8"),
    readFile(path.join(DATA_DIR, "columns.json"), "utf-8"),
  ]);
  return {
    candidates: JSON.parse(candidatesJson) as Candidate[],
    columns: JSON.parse(columnsJson) as ColumnsConfig,
  };
}
```

Nota: `process.cwd()` puede variar según desde dónde se ejecuta el server. Verificar en runtime con `console.log(DATA_DIR)` la primera vez. Si causa problemas, hacer el path absoluto o pasar via env var.

## DTO type (compartido entre client y server por copia)

```ts
export type Candidate = {
  id: string;
  name: string;
  document: number;
  cv_zonajobs: string;
  cv_bumeran: string;
  phone: string;
  email: string;
  date: string;
  age: number;
  has_university: string;
  career: string;
  graduated: string;
  courses_approved: string;
  location: string;
  accepts_working_hours: string;
  desired_salary: string;
  had_interview: string;
  reason: string;
};

export type ColumnsConfig = Record<keyof Candidate, boolean>;
```

**No es monorepo** — este tipo se duplica entre `client/src/types/` y `server/src/types/`. Cambio en uno → actualizar el otro. Documentado en `gotchas.md`.

## Approval derivation

La regla del enunciado: `reason === ""` significa aprobado. No agregar un campo `status` redundante. La UI deriva el badge de `reason.length === 0`.

```ts
export function isApproved(candidate: Candidate): boolean {
  return candidate.reason === "";
}
```

## Validación de PATCH body

Validación inline simple (sin zod para este scope):

```ts
function isValidReasonPayload(body: unknown): body is { reason: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "reason" in body &&
    typeof (body as { reason: unknown }).reason === "string"
  );
}
```

Si crece, migrar a zod o similar.
