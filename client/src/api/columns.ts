import type { ColumnsConfig } from "../types/api";

export async function getColumns(): Promise<ColumnsConfig> {
  const r = await fetch("/api/columns");
  if (!r.ok) throw new Error(`Failed to load columns (HTTP ${r.status})`);
  return (await r.json()) as ColumnsConfig;
}
