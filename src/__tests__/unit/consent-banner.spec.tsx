import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ConsentBanner } from "@/components/consent-banner";
import { denyConsent, getConsentStatus, grantConsent } from "@/lib/analytics";

jest.mock("@/lib/analytics", () => ({
  getConsentStatus: jest.fn(),
  grantConsent: jest.fn(),
  denyConsent: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/landing",
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/navigation", () => {
  const { createElement } = jest.requireActual<typeof import("react")>("react");
  return {
    Link: (props: React.ComponentProps<"a">) => createElement("a", props),
  };
});

const mockGetConsentStatus = jest.mocked(getConsentStatus);

describe("ConsentBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows when no choice has been made yet", async () => {
    mockGetConsentStatus.mockResolvedValue("pending");

    render(<ConsentBanner />);

    expect(await screen.findByText("accept")).toBeInTheDocument();
    expect(screen.getByText("decline")).toBeInTheDocument();
  });

  it("stays hidden once consent was already granted", async () => {
    mockGetConsentStatus.mockResolvedValue("granted");

    render(<ConsentBanner />);

    await waitFor(() => expect(mockGetConsentStatus).toHaveBeenCalled());
    expect(screen.queryByText("accept")).not.toBeInTheDocument();
  });

  it("stays hidden when analytics is disabled", async () => {
    mockGetConsentStatus.mockResolvedValue(null);

    render(<ConsentBanner />);

    await waitFor(() => expect(mockGetConsentStatus).toHaveBeenCalled());
    expect(screen.queryByText("accept")).not.toBeInTheDocument();
  });

  it("grants consent for the current route and dismisses", async () => {
    mockGetConsentStatus.mockResolvedValue("pending");

    render(<ConsentBanner />);
    fireEvent.click(await screen.findByText("accept"));

    expect(grantConsent).toHaveBeenCalledWith("/en/landing");
    expect(screen.queryByText("accept")).not.toBeInTheDocument();
  });

  it("denies consent and dismisses", async () => {
    mockGetConsentStatus.mockResolvedValue("pending");

    render(<ConsentBanner />);
    fireEvent.click(await screen.findByText("decline"));

    expect(denyConsent).toHaveBeenCalled();
    expect(screen.queryByText("decline")).not.toBeInTheDocument();
  });
});
