/**
 * Navigation links displayed in the contact footer overlay. Labels live in the
 * `common.contact.links` catalogue, keyed by id.
 */
export const NAV_LINKS = [
  { id: "twitter", href: "https://x.com/swftagents" },
  { id: "instagram", href: "/" },
  { id: "careers", href: "/" },
  { id: "blog", href: "/blog" },
  { id: "email", href: "mailto:thelma@swiftagents.org" },
] as const;

/** Stylised brand mark rather than a sentence, so it is not translated. */
export const COPYRIGHT_TEXT = "©COPYRIGHT@SWIFTAGENTS.ORG";
