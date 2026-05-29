import { useCallback, useEffect, useState } from "react";
import { getColumns } from "../api/columns";
import type { ColumnsConfig } from "../types/api";

export type ColumnsState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; columns: ColumnsConfig };

export type UseColumnsResult = {
  state: ColumnsState;
  reload: () => void;
};

export function useColumns(): UseColumnsResult {
  const [state, setState] = useState<ColumnsState>({ status: "loading" });

  const reload = useCallback(() => {
    setState({ status: "loading" });
    getColumns()
      .then((columns) => setState({ status: "success", columns }))
      .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ status: "error", error: err });
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { state, reload };
}
