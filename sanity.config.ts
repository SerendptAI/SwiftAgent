"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schema";

/**
 * Config for the Studio embedded at /studio. `projectId` falls back to an empty
 * string so a checkout with no Sanity project still typechecks and builds; the
 * route itself refuses to render without one.
 */
export default defineConfig({
  name: "swift-agents",
  title: "Swift Agents",
  basePath: "/studio",
  projectId: SANITY_PROJECT_ID ?? "",
  dataset: SANITY_DATASET,
  schema: { types: schemaTypes },
  plugins: [structureTool()],
});
