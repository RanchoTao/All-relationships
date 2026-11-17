// Deterministic build input only. Never authors or repairs card content.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const directory = "data/knowledge/cards";
const names = readdirSync(directory)
  .filter((name) => name.endsWith(".json"))
  .sort();
const ids = new Set();
const cards = names.map((name) => {
  const card = JSON.parse(readFileSync(`${directory}/${name}`, "utf8"));
  if (
    name !== `${card.id}.json` ||
    !/^A\d{2}-\d{3}$/.test(card.id) ||
    ids.has(card.id)
  )
    throw new Error(`Invalid or duplicate card filename/ID: ${name}`);
  ids.add(card.id);
  return card;
});
writeFileSync(
  "data/knowledge/cards.json",
  JSON.stringify({ version: "0.4.0", cards }, null, 2) + "\n",
);
console.log(`Aggregated ${cards.length} card files; no content generated.`);
