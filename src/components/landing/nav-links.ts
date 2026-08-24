import { stripLocalePrefix } from "@/lib/locale-path";

export const PRODUCTS_DROPDOWN_LINKS = [
  { label: "DOWNLOAD THE SWIFT AGENTS APP", href: "/products", arrow: true },
  { label: "USE OUR SDKS", href: "/products#sdks", arrow: true },
] as const;

export const EARN_DROPDOWN_LINKS = [
  { label: "AFFILIATE PROGRAM", href: "/affiliate", arrow: true },
  { label: "REFER & EARN", href: "/refer", arrow: true },
] as const;

export const DEMO_DROPDOWN_LINKS = [
  { label: "COST CALCULATOR", href: "/demo", arrow: true },
  { label: "USECASE ANALYSIS", href: "/case-studies", arrow: true },
] as const;

export const RESOURCES_DROPDOWN_LINKS = [
  { label: "BLOG", href: "/blog", arrow: true },
  {
    label: "DOCUMENTATION",
    href: "https://docs.swiftagents.org/",
    arrow: true,
  },
] as const;

/** Absolute hrefs leave the site, so the nav opens them in a new tab. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

interface NavDropdownLink {
  readonly label: string;
  readonly href: string;
  readonly arrow?: boolean;
}

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly dropdown?: {
    readonly title: string;
    readonly links: readonly NavDropdownLink[];
    readonly previewImage?: string;
  };
}

export const LANDING_NAV_LINKS: readonly NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "AGENTS", href: "/agents" },
  {
    label: "PRODUCTS",
    href: "/products",
    dropdown: {
      title: "OUR PRODUCTS",
      links: PRODUCTS_DROPDOWN_LINKS,
      previewImage: "/images/product-dropdown.svg",
    },
  },
  {
    label: "EARN",
    href: "/refer",
    dropdown: { title: "START EARNING", links: EARN_DROPDOWN_LINKS },
  },
  {
    label: "DEMO",
    href: "/demo",
    dropdown: { title: "TRY THE DEMO", links: DEMO_DROPDOWN_LINKS },
  },
  {
    label: "RESOURCES",
    href: "/blog",
    dropdown: { title: "READ UP", links: RESOURCES_DROPDOWN_LINKS },
  },
  { label: "PRICING", href: "/#pricing" },
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
