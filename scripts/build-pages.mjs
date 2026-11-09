import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/All-relationships";
if (basePath !== "" && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH must be empty or one URL path segment",
  );
}
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync("out/index.html")) throw new Error("Static export is missing");
writeFileSync("out/.nojekyll", "");
