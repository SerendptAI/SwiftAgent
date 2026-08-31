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

/**
 * A poster is a still cut from the clip itself, so it can never drift from the
 * video it fronts. `w_960` is wide enough for a full-bleed player without
 * shipping the source frame.
 */
const POSTER_DELIVERY = "f_auto,q_auto,w_960";

/** Far enough in to clear the title card a tutorial opens on. */
const POSTER_OFFSET = "so_30p";

/** Ids mirror what used to be public/videos, so `path` reads like the file did. */
const VIDEO_FOLDER = "swift-agents";

/** @param path e.g. "hero-section", "platforms/website". No extension. */
export function videoUrl(path: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${VIDEO_DELIVERY}/${VIDEO_FOLDER}/${path}`;
}

/** A still frame from the clip at `path`, for a thumbnail or a video poster. */
export function videoPosterUrl(path: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${POSTER_OFFSET},${POSTER_DELIVERY}/${VIDEO_FOLDER}/${path}.jpg`;
}
