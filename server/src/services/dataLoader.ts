import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Candidate, ColumnsConfig } from "../types/api";

const DEFAULT_DATA_DIR = path.resolve(__dirname, "..", "..", "..", "data");
const DATA_DIR = process.env.DATA_DIR ?? DEFAULT_DATA_DIR;

export async function loadData(): Promise<{
  candidates: Candidate[];
  columns: ColumnsConfig;
}> {
  const [candidatesJson, columnsJson] = await Promise.all([
    readFile(path.join(DATA_DIR, "candidates.json"), "utf-8"),
    readFile(path.join(DATA_DIR, "columns.json"), "utf-8"),
  ]);
  return {
    candidates: JSON.parse(candidatesJson) as Candidate[],
    columns: JSON.parse(columnsJson) as ColumnsConfig,
  };
}
