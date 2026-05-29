import type { Candidate } from "../types/api";

export function isApproved(candidate: Candidate): boolean {
  return candidate.reason === "";
}

export function parseReasons(reason: string): string[] {
  if (!reason) return [];
  return reason
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
}

export function formatReasons(reasons: string[]): string {
  return reasons
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
    .join(", ");
}
