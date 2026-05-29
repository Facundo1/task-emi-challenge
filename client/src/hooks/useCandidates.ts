import { useCallback, useEffect, useRef, useState } from "react";
import { getCandidates, patchCandidate } from "../api/candidates";
import type { Candidate } from "../types/api";

export type CandidatesState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; candidates: Candidate[] };

export type UseCandidatesResult = {
  state: CandidatesState;
  reload: () => void;
  updateCandidate: (id: string, patch: Partial<Candidate>) => Promise<Candidate>;
};

export function useCandidates(): UseCandidatesResult {
  const [state, setState] = useState<CandidatesState>({ status: "loading" });
  const stateRef = useRef(state);
  stateRef.current = state;

  const reload = useCallback(() => {
    setState({ status: "loading" });
    getCandidates()
      .then((candidates) => setState({ status: "success", candidates }))
      .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ status: "error", error: err });
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateCandidate = useCallback(
    async (id: string, patch: Partial<Candidate>): Promise<Candidate> => {
      const current = stateRef.current;
      if (current.status !== "success") {
        throw new Error("Cannot update before candidates are loaded");
      }
      const snapshot = current.candidates;

      setState({
        status: "success",
        candidates: snapshot.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      });

      try {
        const updated = await patchCandidate(id, patch);
        setState((prev) =>
          prev.status === "success"
            ? {
                status: "success",
                candidates: prev.candidates.map((c) =>
                  c.id === updated.id ? updated : c
                ),
              }
            : prev
        );
        return updated;
      } catch (error) {
        setState({ status: "success", candidates: snapshot });
        throw error;
      }
    },
    []
  );

  return { state, reload, updateCandidate };
}
