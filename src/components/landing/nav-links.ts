export const LANDING_NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "AGENTS", href: "/agents" },
  { label: "PRODUCTS", href: "/products" },
  { label: "EARN", href: "/refer" },
  { label: "PRICING", href: "/#pricing" },
] as const;

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
