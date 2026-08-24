import { stripLocalePrefix } from "@/lib/locale-path";

/**
 * Nav entries carry structure only — an `id` that names their copy in the
 * `nav` catalogue, and an unprefixed href the locale-aware Link resolves.
 * Labels live in messages/<locale>/nav.json.
 */
export const PRODUCTS_DROPDOWN_LINKS = [
  { id: "downloadApp", href: "/products", arrow: true },
  { id: "useSdks", href: "/products#sdks", arrow: true },
] as const;

export const EARN_DROPDOWN_LINKS = [
  { id: "affiliate", href: "/affiliate", arrow: true },
  { id: "refer", href: "/refer", arrow: true },
] as const;

export const DEMO_DROPDOWN_LINKS = [
  { id: "costCalculator", href: "/demo", arrow: true },
  { id: "usecaseAnalysis", href: "/case-studies", arrow: true },
] as const;

export const RESOURCES_DROPDOWN_LINKS = [
  { id: "blog", href: "/blog", arrow: true },
  {
    id: "documentation",
    href: "https://docs.swiftagents.org/",
    arrow: true,
  },
] as const;

/** Absolute hrefs leave the site, so the nav opens them in a new tab. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

interface NavDropdownLink {
  readonly id: string;
  readonly href: string;
  readonly arrow?: boolean;
}

interface NavLink {
  readonly id: string;
  readonly href: string;
  readonly dropdown?: {
    readonly links: readonly NavDropdownLink[];
    readonly previewImage?: string;
  };
}

export const LANDING_NAV_LINKS: readonly NavLink[] = [
  { id: "home", href: "/" },
  { id: "agents", href: "/agents" },
  {
    id: "products",
    href: "/products",
    dropdown: {
      links: PRODUCTS_DROPDOWN_LINKS,
      previewImage: "/images/product-dropdown.svg",
    },
  },
  {
    id: "earn",
    href: "/refer",
    dropdown: { links: EARN_DROPDOWN_LINKS },
  },
  {
    id: "demo",
    href: "/demo",
    dropdown: { links: DEMO_DROPDOWN_LINKS },
  },
  {
    id: "resources",
    href: "/blog",
    dropdown: { links: RESOURCES_DROPDOWN_LINKS },
  },
  { id: "pricing", href: "/#pricing" },
];

export function isLandingNavLinkActive(
  href: string,
  pathname: string,
  hash = "",
) {
  // Nav hrefs are written unprefixed, so the current path is compared with its
  // locale segment removed rather than against one variant per locale.
  const path = stripLocalePrefix(pathname);
  const [hrefPath, hrefHash] = href.split("#");

  if (hrefHash) {
    return path === hrefPath && hash === `#${hrefHash}`;
  }

  return path === hrefPath;
}
