export async function getReasons(): Promise<string[]> {
  const r = await fetch("/api/reasons");
  if (!r.ok) throw new Error(`Failed to load reasons (HTTP ${r.status})`);
  return (await r.json()) as string[];
}
