/**
 * Cloudinary hosts the site's video — see scripts/upload-videos.mjs for how it
 * gets there.
 *
 * The cloud name is a constant rather than an env var: it is a public account
 * identifier that appears in every delivery URL, it is the same in every
 * environment, and these URLs are built in code that ships to the browser, so
 * an unset variable would silently break every clip instead of failing a build.
 */
const CLOUD_NAME = "dmzoyse0g";

/**
 * `f_auto:video` serves VP9/WebM to browsers that take it and MP4 to the rest,
 * and `q_auto` picks the lowest bitrate that still looks clean.
 */
const VIDEO_DELIVERY = "f_auto:video,q_auto";

/** Ids mirror what used to be public/videos, so `path` reads like the file did. */
const VIDEO_FOLDER = "swift-agents";

/** @param path e.g. "hero-section", "platforms/website". No extension. */
export function videoUrl(path: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${VIDEO_DELIVERY}/${VIDEO_FOLDER}/${path}`;
}
