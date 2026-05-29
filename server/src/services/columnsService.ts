import type { ColumnsConfig } from "../types/api";

let config: ColumnsConfig = {};

export const columnsService = {
  loadInitial(c: ColumnsConfig): void {
    config = { ...c };
  },
  findAll(): ColumnsConfig {
    return { ...config };
  },
};
