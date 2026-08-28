#!/usr/bin/env node
/**
 * Uploads the case-study partner clips under public/videos/partners to
 * Cloudinary, which is where src/lib/case-studies.ts reads them from.
 *
 * Adding a partner's footage:
 *   1. drop the clips in public/videos/partners/<partner>/<clip-slug>.mp4
 *   2. node scripts/upload-partner-videos.mjs <partner>
 *   3. reference the printed ids with partnerVideo() in src/lib/case-studies.ts
 *   4. delete the local copies — Cloudinary is the source of truth from here
 *
 * With no arguments every partner directory is handled. A clip already on
 * Cloudinary is not re-uploaded unless --force is passed, but every clip is
 * still probed, so a re-run doubles as a check that each one is being served.
 *
 * Needs CLOUD_NAME, API_KEY and API_SECRET in .env.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const PARTNERS_DIR = "public/videos/partners";
const CLOUDINARY_FOLDER = "swift-agents/partners";
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

async function listClips(partners) {
  const entries = await readdir(PARTNERS_DIR, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => partners.length === 0 || partners.includes(name));

  const missing = partners.filter((name) => !directories.includes(name));
  if (missing.length > 0) {
    throw new Error(`No such partner directory: ${missing.join(", ")}`);
  }

  const clips = [];
  for (const partner of directories.sort()) {
    const files = await readdir(join(PARTNERS_DIR, partner));
    for (const file of files.sort()) {
      const extension = extname(file).toLowerCase();
      if (!VIDEO_EXTENSIONS.has(extension)) continue;
      const slug = basename(file, extension);
      clips.push({
        path: join(PARTNERS_DIR, partner, file),
        publicId: `${CLOUDINARY_FOLDER}/${partner}/${slug}`,
        reference: `${partner}/${slug}`,
      });
    }
  }
  return clips;
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
  const partners = args.filter((arg) => !arg.startsWith("--"));

  const credentials = readCredentials();
  const clips = await listClips(partners);
  if (clips.length === 0) {
    console.log(`No clips found under ${PARTNERS_DIR}.`);
    return;
  }

  const references = [];
  for (const clip of clips) {
    const skip = !force && (await isUploaded(clip.publicId, credentials));
    if (skip) {
      process.stdout.write(
        `· ${clip.publicId} — already uploaded, checking … `,
      );
    } else {
      const { size } = await stat(clip.path);
      process.stdout.write(`↑ ${clip.publicId} (${formatMb(size)}) … `);
      await upload(clip.path, clip.publicId, credentials);
    }

    // Every clip is probed, uploaded or not, so a re-run doubles as a check
    // that everything case-studies.ts points at is actually being served.
    const delivery = await warmDelivery(
      `https://res.cloudinary.com/${credentials.cloudName}/video/upload/f_auto:video,q_auto/${encodePublicId(clip.publicId)}`,
    );
    console.log(`delivers ${formatMb(delivery.bytes)} as ${delivery.format}`);
    references.push(clip.reference);
  }

  console.log(`\nReference these in src/lib/case-studies.ts:`);
  for (const reference of references) {
    console.log(`  video: partnerVideo("${reference}"),`);
  }
}

main().catch((error) => {
  console.error(`\n${describe(error)}`);
  process.exit(1);
});
