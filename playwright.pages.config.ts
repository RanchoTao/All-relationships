import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

process.env.PLAYWRIGHT_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/All-relationships";

export default defineConfig(config, {
  use: { baseURL: "http://127.0.0.1:3101" },
  webServer: {
    command: "npm run preview:pages",
    url: `http://127.0.0.1:3101${process.env.PLAYWRIGHT_BASE_PATH}/`,
    reuseExistingServer: false,
    timeout: 30000,
  },
});
