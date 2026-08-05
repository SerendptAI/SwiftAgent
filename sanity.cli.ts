import { defineCliConfig } from "sanity/cli";

/**
 * Config for the `sanity` CLI (dataset management, document import/export).
 * It reads the same variables as the app so the CLI and the running site can
 * never point at different projects.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
