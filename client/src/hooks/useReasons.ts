import { useCallback, useState } from "react";
import { getReasons } from "../api/reasons";

export type ReasonsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; reasons: string[] };

export type UseReasonsResult = {
  state: ReasonsState;
  load: () => Promise<void>;
};

export function useReasons(): UseReasonsResult {
  const [state, setState] = useState<ReasonsState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const reasons = await getReasons();
      setState({ status: "success", reasons });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ status: "error", error: err });
    }
  }, []);

  return { state, load };
}
