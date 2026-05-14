# Task Checklist

# April 27, 2026

## Feature: Widget Popup Button Link

- [x] Identify the button popup widget entry point in the codebase
- [x] Implement the button trigger UI for opening widgets
- [x] Wire up the popup open/close logic
- [x] Test across breakpoints and widget types

## Feature: Offline State (Custom Offline Screen)

- [x] Intercept offline/online browser events
- [x] Build a custom offline UI component (not the browser default)
- [x] Show offline screen when connection is lost, restore view on reconnect
- [x] Test with DevTools network throttling (offline mode)

## Feature: SEO Improvements

- [x] Audit current meta tags, title, and Open Graph data
- [x] Add/update `<Head>` metadata per page
- [x] Add structured data (JSON-LD) where applicable
- [x] Generate sitemap and robots.txt
- [x] Verify with Lighthouse SEO audit

# April 29, 2026

## Bug: Incorrect Site Title in SEO (`SwiftAgent` → `Swift Agents`)

- [x] Update the `title` field in `src/lib/site-config.ts` from `"SwiftAgent"` to `"Swift Agents"`
- [x] Search for any hardcoded `"SwiftAgent"` strings in metadata, JSON-LD, and OG tags and correct them
- [x] Run `bun run typecheck` and rebuild to confirm the corrected title propagates to all pages

## Feature: Google Search Console Indexing

- [x] Verify ownership of the domain via Google Search Console (add DNS TXT record or HTML file method)
- [x] Submit the sitemap URL (`/sitemap.xml`) to Google Search Console
- [x] Confirm `robots.txt` allows `Googlebot` and that no `noindex` tags are present on public pages
- [x] Request indexing for the root URL via the URL Inspection tool

## Bug: Offline Screen Shown Globally Instead of Dashboard Only

- [x] Reference and analyze this image for better context on what to do: /home/allie/Pasted image.png
- [x] Audit `OfflineScreen` component — it is currently mounted in the root layout and covers all pages
- [x] Move `OfflineScreen` out of `src/app/[locale]/layout.tsx` and into the dashboard page (`src/app/[locale]/dashboard/page.tsx`) wrapping only the stats grid — sidebar, header, CompanyToolbar, WidgetCard, and VisitorsList remain visible
- [x] The offline UI renders as an inline content replacement within the stats area (sidebar and header remain visible), matching the design: "YOU ARE OFFLINE" message with inlined SVG illustration and a Reconnect button
- [x] Verify the offline screen does not appear on the landing page, login, or onboarding routes
- [x] Test by toggling offline mode in DevTools while on a dashboard page and a non-dashboard page

## Bug: Mobile Blocker Flashes and Disappears on Dashboard

- [x] Remove `usePathname()` conditional from `MobileBlocker` — the client-side pathname check causes a hydration re-render that hides the blocker after it first appears
- [x] Make the component always render on mobile across all pages (CSS `md:hidden` already handles responsive hiding)
- [x] Drop the `"use client"` directive and `usePathname` import since they are no longer needed
- [x] Gate all rendering and API calls behind `MobileGate` — children only mount after viewport check, so no providers, hooks, or API calls fire on mobile
- [x] Test on a real mobile viewport and in DevTools responsive mode at ≤768 px — blocker should persist without flashing

## Feature: Registration Page Route (`/signup`)

- [x] Create `/[locale]/signup` route and page file
- [x] Wire up the existing registration form component at that route
- [x] Add `/signup` to the sitemap and update any nav/CTA links that should point to it
- [x] Verify locale-aware navigation helpers are used (no raw Next.js `Link`)

## Feature: Replace Static Agent Images with Looping Motion Videos (About Agents Tab)

- [x] Identify the "About agents" tab component and locate the static `<img>` elements
- [x] Replace each static image with a `<video>` element pointing to the supplied motion design video files
- [x] Set `autoPlay`, `loop`, `muted`, and `playsInline` attributes; remove `controls` to hide the browser video bar
- [x] Confirm videos are placed in `public/videos/` and referenced correctly (Agent 001/007/047/626)
- [x] Test that videos autoplay and loop on both Chrome and Safari (Safari requires `muted` + `playsInline`)

# May 1, 2026

## Bug: Login Page Design Accuracy

- [x] Compare the login page against the supplied design reference
- [x] Update login page typography to match the design fonts and font sizes
- [x] Adjust input and button dimensions, spacing, and visual styling to match the design
- [x] Verify the login page matches the design across supported breakpoints

## Feature: Register Form

- [x] Confirm whether Romeo has added the register form
- [x] If the register form is missing, add it following the existing auth page patterns
- [x] Verify the register form route, validation, and submission flow work correctly

## Bug: Choose Email Username Popup Design Alignment

- [x] Compare the choose email username popup against the supplied design reference
- [x] Align popup layout, typography, spacing, inputs, and actions with the design
- [x] Verify the popup renders correctly across supported breakpoints

## Bug: Onboarding Chats Design Alignment

- [x] Compare the onboarding chats against the supplied design reference
- [x] Align chat layout, typography, spacing, message bubbles, and controls with the design
- [x] Verify the onboarding chats render correctly across supported breakpoints

## Bug: Chat Box Dropdown Icon Mismatch

- [x] Replace the rightmost chat box dropdown icon with the correct Figma icon
- [x] Match the dropdown icon size to the Figma design
- [x] Verify the updated icon aligns correctly inside the chat box

## Feature: 404 Error Page

- [x] Add a custom 404 page for users who search for a wrong page or get lost
- [x] Match the 404 page styling to the existing product design
- [x] Verify wrong or missing routes render the 404 page correctly

## Bug: Customer Size Dropdown Option Color

- [x] Update dropdown options in the "Estimated/customer size" or "Average customer size" field to use black text in "/signup" page
- [x] Verify the dropdown options remain readable across themes and states

# May 6, 2026

## Feature: Dashboard Tooltips

- [x] Go through the dashboard and add tooltips to everything that needs them, especially the sidebar

## Feature: Referral Page

- [x] Build the referral page
- [x] Update the website navbar to match the new design, see reference

# May 7, 2026

## Widget Updates

- [x] Dashboard -> Right Side: Remove sticky button from the widget tab

## Bug: Settings Security Account Details

- [x] In Settings -> Security -> right side, fix the user's name showing one name for all accounts; it seems disconnected
- [x] Fix "Logged In VIA (Google)" showing for all login methods, including normal email login

## Feature: Referral Page Screens

- [x] Build refer page screens

## Ticketing

- [x] Update ticketing empty state

# May 11, 2026

- [x] Build refer page screens
- [x] Billing page: Fix the position of the "SAVED CARDS" text
- [x] Bug fix: Prevent duplicate company creation during onboarding by updating the existing signup company unless adding a new company intentionally
- [ ] Create an account with team@serendptai.com, then add Swift Agents as a company to the account; fix any errors encountered
- [ ] Add a team member to the account; fix any errors encountered in the process
