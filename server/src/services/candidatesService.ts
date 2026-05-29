import type { Candidate } from "../types/api";

let store: Candidate[] = [];

export const candidatesService = {
  loadInitial(candidates: Candidate[]): void {
    store = candidates.map((c) => ({ ...c }));
  },
  findAll(): Candidate[] {
    return store.slice();
  },
  findById(id: string): Candidate | null {
    const found = store.find((c) => c.id === id);
    return found ? { ...found } : null;
  },
  update(id: string, patch: Partial<Candidate>): Candidate | null {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...patch };
    return { ...store[idx] };
  },
};
