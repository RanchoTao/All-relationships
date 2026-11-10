// Full-data wrapper kept for tests and server code; the browser uses index-model directly.
import { entryById } from "./catalog";
import { collectionIndex } from "./index-data";
import { createSearch, facetOptionsFor, type Filters } from "./index-model";
import type { Entry } from "./schema";

export { emptyFilters, type Filters } from "./index-model";
const search = createSearch(collectionIndex());
export function searchEntries(filters: Filters): Entry[] {
  return search(filters).map((item) => entryById[item.id]);
}
export const facetOptions = facetOptionsFor(collectionIndex());
