import { render, screen } from "@testing-library/react";
import { User } from "@supabase/supabase-js";
import SettingsLayout from "../SettingsLayout";

// Mock the DashboardLayout component
vi.mock("../layout/DashboardLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

// Mock the SettingsNav component
vi.mock("../SettingsNav", () => ({
  default: () => <div data-testid="settings-nav">Settings Navigation</div>,
}));

describe("SettingsLayout", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    created_at: "2024-01-01T00:00:00Z",
  } as User;

  const mockOnSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children content", () => {
    render(
      <SettingsLayout user={mockUser} onSignOut={mockOnSignOut}>
        <div data-testid="settings-content">Settings Content</div>
      </SettingsLayout>,
    );

    expect(screen.getByTestId("settings-content")).toBeVisible();
    expect(screen.getByTestId("settings-content")).toHaveTextContent(
      "Settings Content",
    );
  });

  it("renders settings navigation", () => {
    render(
      <SettingsLayout user={mockUser} onSignOut={mockOnSignOut}>
        <div data-testid="settings-content">Settings Content</div>
      </SettingsLayout>,
    );

    expect(screen.getByTestId("settings-nav")).toBeVisible();
  });

  it("renders with correct layout structure", () => {
    const { container } = render(
      <SettingsLayout user={mockUser} onSignOut={mockOnSignOut}>
        <div data-testid="settings-content">Settings Content</div>
      </SettingsLayout>,
    );

    // Check that the component renders without crashing
    expect(container.firstChild).toBeVisible();
  });
});
