import { createClient } from "next-sanity";

import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from "@/sanity/env";

/** Null when no project is configured — see `env.ts` for why that is allowed. */
export const sanityClient = SANITY_PROJECT_ID
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
    })
  : null;
