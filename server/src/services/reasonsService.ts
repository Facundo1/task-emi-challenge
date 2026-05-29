import { candidatesService } from "./candidatesService";
import type { Candidate } from "../types/api";

export function extractUniqueReasons(candidates: Candidate[]): string[] {
  const set = new Set<string>();
  for (const c of candidates) {
    if (!c.reason) continue;
    c.reason
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .forEach((r) => set.add(r));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export const reasonsService = {
  findAll(): string[] {
    return extractUniqueReasons(candidatesService.findAll());
  },
};
