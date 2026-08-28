#!/usr/bin/env node
/**
 * Uploads the footage under public/videos to Cloudinary, which is where the
 * site plays it from (src/lib/cloudinary.ts).
 *
 * Adding footage:
 *   1. drop the file anywhere under public/videos, at any depth
 *   2. node scripts/upload-videos.mjs [path-prefix …]
 *   3. reference the printed ids with videoUrl() in the component
 *   4. delete the local copy — Cloudinary is the source of truth from here
 *
 * With no arguments the whole staged tree is handled; a prefix ("platforms",
 * "partners/selar") narrows it. A clip already on Cloudinary is not
 * re-uploaded unless --force is passed, but it is still probed, so re-running
 * after a run that died partway confirms what did land is being served. Once
 * the local copies are deleted there is nothing left to walk, which is the
 * expected end state, not an error.
 *
 * Ids mirror the path under public/videos, with each segment slugified, so a
 * file dropped in as "Agent 001.mp4" is served as "agent-001". The ids to
 * reference are printed at the end of a run.
 *
 * Needs CLOUD_NAME, API_KEY and API_SECRET in .env.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const VIDEOS_DIR = "public/videos";
const CLOUDINARY_FOLDER = "swift-agents";
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

/** Cloudinary answers 423 while it is still deriving a transformation. */
const PROCESSING_STATUS = 423;
const WARM_ATTEMPTS = 10;
const WARM_RETRY_MS = 3000;

/** Multi-megabyte POSTs to Cloudinary drop often enough to be worth a retry. */
const UPLOAD_ATTEMPTS = 3;
const UPLOAD_RETRY_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** `fetch` rejects with a bare "fetch failed"; the cause holds the real reason. */
function describe(error) {
  return error.cause ? `${error.message} (${error.cause})` : error.message;
}

/** Keeps ids URL-clean and kebab-case, whatever the dropped file was called. */
function slugify(segment) {
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function signature(params, apiSecret) {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(canonical + apiSecret)
    .digest("hex");
}

function adminHeaders({ apiKey, apiSecret }) {
  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

/** Public ids carry folder slashes, so only the segments may be escaped. */
function encodePublicId(publicId) {
  return publicId.split("/").map(encodeURIComponent).join("/");
}

function formatMb(bytes) {
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

async function isUploaded(publicId, credentials) {
  const { cloudName } = credentials;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload/${encodePublicId(publicId)}`,
    { headers: adminHeaders(credentials) },
  );
  if (response.status === 404) return false;
  if (!response.ok) {
    throw new Error(
      `Could not look up ${publicId}: HTTP ${response.status} ${await response.text()}`,
    );
  }
  return true;
}

async function upload(filePath, publicId, credentials) {
  const { cloudName, apiKey, apiSecret } = credentials;
  const bytes = await readFile(filePath);

  for (let attempt = 1; ; attempt += 1) {
    const signed = {
      invalidate: "true",
      overwrite: "true",
      public_id: publicId,
      timestamp: Math.floor(Date.now() / 1000),
    };

    const form = new FormData();
    form.append("file", new Blob([bytes]), basename(filePath));
    for (const [key, value] of Object.entries(signed)) {
      form.append(key, String(value));
    }
    form.append("api_key", apiKey);
    form.append("signature", signature(signed, apiSecret));

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        { method: "POST", body: form },
      );
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error?.message ?? `HTTP ${response.status}`);
      }
      return body;
    } catch (error) {
      if (attempt >= UPLOAD_ATTEMPTS) throw error;
      process.stdout.write(`retrying (${describe(error)}) … `);
      await wait(UPLOAD_RETRY_MS);
    }
  }
}

/**
 * Asks for the first byte of the delivery URL, which both proves the clip is
 * reachable and starts Cloudinary deriving the f_auto/q_auto variant. Until
 * that variant is ready Cloudinary keeps serving the original MP4, so early
 * visitors get a working — just larger — file rather than a stall, and this
 * reports whichever variant is live at the time.
 *
 * Retries cover both that derivation window and the connection drops a long
 * upload session attracts; an unwarmed clip still plays, so losing the whole
 * run to one timed-out probe would be the worse outcome.
 */
async function warmDelivery(url) {
  const headers = {
    Accept: "video/webm,video/ogg,video/*;q=0.9,*/*;q=0.5",
    Range: "bytes=0-0",
  };

  let lastFailure = "no attempt completed";
  for (let attempt = 1; attempt <= WARM_ATTEMPTS; attempt += 1) {
    if (attempt > 1) await wait(WARM_RETRY_MS);

    let response;
    try {
      response = await fetch(url, { headers });
      await response.arrayBuffer();
    } catch (error) {
      lastFailure = describe(error);
      continue;
    }

    if (response.ok) {
      const total = response.headers.get("content-range")?.split("/").at(-1);
      return {
        bytes: Number(total ?? response.headers.get("content-length")) || 0,
        format: response.headers.get("content-type") ?? "unknown",
      };
    }
    if (response.status !== PROCESSING_STATUS) {
      throw new Error(`Delivery failed: HTTP ${response.status} for ${url}`);
    }
    lastFailure = `HTTP ${PROCESSING_STATUS}, still deriving`;
  }
  throw new Error(`Gave up warming ${url}: ${lastFailure}`);
}

async function collectClips(directory, prefix, clips) {
  // The staging tree is gitignored, so a fresh clone has no footage at all
  // until someone drops a file in — not an error.
  const entries = await readdir(directory, { withFileTypes: true }).catch(
    (error) => {
      if (error.code === "ENOENT") return [];
      throw error;
    },
  );

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectClips(path, `${prefix}${slugify(entry.name)}/`, clips);
      continue;
    }
    const extension = extname(entry.name).toLowerCase();
    if (!VIDEO_EXTENSIONS.has(extension)) continue;
    const slug = slugify(entry.name.slice(0, -extension.length));
    clips.push({ path, reference: `${prefix}${slug}` });
  }
}

async function listClips(prefixes) {
  const clips = [];
  await collectClips(VIDEOS_DIR, "", clips);
  if (prefixes.length === 0) return clips;

  const matches = (clip, prefix) =>
    clip.reference === prefix || clip.reference.startsWith(`${prefix}/`);

  const unmatched = prefixes.filter(
    (prefix) => !clips.some((clip) => matches(clip, prefix)),
  );
  if (unmatched.length > 0) {
    throw new Error(
      `Nothing under ${VIDEOS_DIR} matches: ${unmatched.join(", ")}`,
    );
  }
  return clips.filter((clip) => prefixes.some((p) => matches(clip, p)));
}

function readCredentials() {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Already exported into the environment, or running in CI.
  }

  const credentials = {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  };
  const missing = Object.entries(credentials)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(
      `Missing Cloudinary credentials in .env: ${missing.join(", ")}`,
    );
  }
  return credentials;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const prefixes = args.filter((arg) => !arg.startsWith("--"));

  const credentials = readCredentials();
  const clips = await listClips(prefixes);
  if (clips.length === 0) {
    console.log(`No clips found under ${VIDEOS_DIR}.`);
    return;
  }

  const references = [];
  for (const clip of clips) {
    const publicId = `${CLOUDINARY_FOLDER}/${clip.reference}`;
    const skip = !force && (await isUploaded(publicId, credentials));
    if (skip) {
      process.stdout.write(
        `· ${clip.reference} — already uploaded, checking … `,
      );
    } else {
      const { size } = await stat(clip.path);
      process.stdout.write(`↑ ${clip.reference} (${formatMb(size)}) … `);
      await upload(clip.path, publicId, credentials);
    }

    // Every clip is probed, uploaded or not, so a re-run doubles as a check
    // that everything the site points at is actually being served.
    const delivery = await warmDelivery(
      `https://res.cloudinary.com/${credentials.cloudName}/video/upload/f_auto:video,q_auto/${encodePublicId(publicId)}`,
    );
    console.log(`delivers ${formatMb(delivery.bytes)} as ${delivery.format}`);
    references.push(clip.reference);
  }

  console.log(`\nReference these with videoUrl():`);
  for (const reference of references) {
    console.log(`  videoUrl("${reference}")`);
  }
}

main().catch((error) => {
  console.error(`\n${describe(error)}`);
  process.exit(1);
});
