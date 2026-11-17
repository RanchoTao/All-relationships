import { Explorer } from "@/components/explorer";
import { collectionIndex, defaultOrder } from "@/lib/index-data";
import {
  attributeLabels,
  categories,
  kindLabels,
  statusLabels,
} from "@/lib/catalog";
import { coverage } from "@/lib/knowledge";

// Server component: computes a slim index at build time so the browser
// never downloads the full draft catalog or knowledge cards for the home page.
export default function Home() {
  return (
    <Explorer
      items={defaultOrder(collectionIndex())}
      categories={categories.map(({ id, name, count }) => ({
        id,
        name,
        count,
      }))}
      coverage={coverage}
      kindLabels={kindLabels}
      statusLabels={statusLabels}
      attributeLabels={attributeLabels}
    />
  );
}
