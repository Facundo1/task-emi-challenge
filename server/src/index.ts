import { createApp } from "./app";
import { loadData } from "./services/dataLoader";
import { candidatesService } from "./services/candidatesService";
import { columnsService } from "./services/columnsService";

const PORT = Number(process.env.PORT ?? 3001);

async function main(): Promise<void> {
  const { candidates, columns } = await loadData();
  candidatesService.loadInitial(candidates);
  columnsService.loadInitial(columns);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
