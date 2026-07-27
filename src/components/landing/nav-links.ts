export const PRODUCTS_DROPDOWN_LINKS = [
  { label: "DOWNLOAD THE SWIFT AGENTS APP", href: "/products", arrow: true },
  { label: "USE OUR SDKS", href: "/products#sdks", arrow: true },
] as const;

export const EARN_DROPDOWN_LINKS = [
  { label: "AFFILIATE PROGRAM", href: "/affiliate", arrow: true },
  { label: "REFER & EARN", href: "/refer", arrow: true },
] as const;

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
  { label: "DEMO", href: "/demo" },
  { label: "PRICING", href: "/#pricing" },
];

export function isLandingNavLinkActive(
  href: string,
  pathname: string,
  hash = "",
) {
  if (href === "/") {
    return pathname === "/" || pathname === "/en" || pathname === "/pl";
  }

  const [hrefPath, hrefHash] = href.split("#");
  const normalizedPaths = [hrefPath, `/en${hrefPath}`, `/pl${hrefPath}`];

  if (hrefHash) {
    return normalizedPaths.includes(pathname) && hash === `#${hrefHash}`;
  }

  return normalizedPaths.includes(pathname);
}
