import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import StrollSettingsPage from "@/app/(site)/[locale]/dashboard/settings/stroll/page";
import {
  emptyStrollForm,
  strollFormChanged,
  strollFormFromConfig,
} from "@/components/dashboard/stroll-config-fields";
import { strollApi, type StrollConfigPayload } from "@/services/stroll";

jest.mock("@/services/stroll", () => ({
  strollApi: {
    getConfig: jest.fn(),
    updateConfig: jest.fn(),
  },
}));

// The active company lives in a store, not the route, so switching it re-runs
// the query inside a page that never unmounts. That is the case under test.
let activeCompanyId: string | null = "company-a";
jest.mock("@/hooks/use-active-company", () => ({
  useActiveCompanyId: () => activeCompanyId,
}));

jest.mock("@/components/dashboard/settings/help-banner", () => ({
  HelpBanner: () => null,
}));

const mockGetConfig = jest.mocked(strollApi.getConfig);
const mockUpdateConfig = jest.mocked(strollApi.updateConfig);

const configFor = (name: string): StrollConfigPayload => ({
  dashboard_url: `https://${name}.example.com/dashboard`,
  schedule: "0 2 * * *",
  credentials: {
    login_url: `https://${name}.example.com/login`,
    username: `${name}@example.com`,
    password: `${name}-secret`,
  },
  sandbox_mode: true,
  max_pages: 50,
});

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <StrollSettingsPage />
    </QueryClientProvider>,
  );
}

const dashboardUrlField = () =>
  screen.getByLabelText("Dashboard URL") as HTMLInputElement;
const usernameField = () =>
  screen.getByLabelText("Email/Username") as HTMLInputElement;

describe("stroll config form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activeCompanyId = "company-a";
  });

  it("loads the active company's saved config into the form", async () => {
    mockGetConfig.mockResolvedValue(configFor("alpha"));

    renderPage();

    await waitFor(() =>
      expect(dashboardUrlField().value).toBe(
        "https://alpha.example.com/dashboard",
      ),
    );
    expect(usernameField().value).toBe("alpha@example.com");
  });

  it("clears the form when switching to a company that has no config", async () => {
    mockGetConfig.mockImplementation(async (companyId: string) =>
      companyId === "company-a" ? configFor("alpha") : null,
    );

    const { rerender } = renderPage();

    await waitFor(() =>
      expect(dashboardUrlField().value).toBe(
        "https://alpha.example.com/dashboard",
      ),
    );

    activeCompanyId = "company-b";
    rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <StrollSettingsPage />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(dashboardUrlField().value).toBe(""));
    expect(usernameField().value).toBe("");
  });

  it("never saves one company's credentials onto another", async () => {
    mockGetConfig.mockImplementation(async (companyId: string) =>
      companyId === "company-a" ? configFor("alpha") : null,
    );
    mockUpdateConfig.mockResolvedValue("ok");

    const { rerender } = renderPage();
    await waitFor(() =>
      expect(dashboardUrlField().value).toBe(
        "https://alpha.example.com/dashboard",
      ),
    );

    activeCompanyId = "company-b";
    rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <StrollSettingsPage />
      </QueryClientProvider>,
    );
    await waitFor(() => expect(dashboardUrlField().value).toBe(""));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByRole("status");
    expect(mockUpdateConfig).not.toHaveBeenCalled();
  });
});

describe("strollFormChanged", () => {
  it("is false for a form nobody touched", () => {
    const loaded = strollFormFromConfig(configFor("alpha"));
    expect(strollFormChanged({ ...loaded }, loaded)).toBe(false);
  });

  it("is true once any field differs", () => {
    const loaded = strollFormFromConfig(configFor("alpha"));
    expect(
      strollFormChanged({ ...loaded, maxPages: loaded.maxPages + 1 }, loaded),
    ).toBe(true);
    expect(strollFormChanged({ ...loaded, password: "" }, loaded)).toBe(true);
    expect(
      strollFormChanged(
        { ...loaded, sandboxMode: !loaded.sandboxMode },
        loaded,
      ),
    ).toBe(true);
  });

  // The sidebar saves stroll settings alongside unrelated ones, so a save that
  // lands before the existing config has loaded must not write the blank form
  // over a working config.
  it("reports a blank form against a loaded config as a change", () => {
    const loaded = strollFormFromConfig(configFor("alpha"));
    expect(strollFormChanged(emptyStrollForm(), loaded)).toBe(true);
  });

  it("reports no change while both sides are still blank", () => {
    expect(strollFormChanged(emptyStrollForm(), emptyStrollForm())).toBe(false);
  });
});
