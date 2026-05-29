import type { Candidate } from "../types/api";

export async function getCandidates(): Promise<Candidate[]> {
  const r = await fetch("/api/candidates");
  if (!r.ok) throw new Error(`Failed to load candidates (HTTP ${r.status})`);
  return (await r.json()) as Candidate[];
}

export async function patchCandidate(
  id: string,
  patch: Partial<Candidate>
): Promise<Candidate> {
  const r = await fetch(`/api/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${r.status}`);
  }
  return (await r.json()) as Candidate;
}
