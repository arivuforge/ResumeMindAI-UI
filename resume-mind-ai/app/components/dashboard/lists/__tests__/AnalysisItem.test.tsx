import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalysisItem, { type AnalysisStatus } from "../AnalysisItem";

describe("AnalysisItem", () => {
  const baseProps = {
    id: "1",
    fileName: "resume.pdf",
    status: "completed" as AnalysisStatus,
    nodesExtracted: 5,
    timestamp: "2h ago",
  };

  it("renders completed status with details", () => {
    render(<AnalysisItem {...baseProps} />);

    expect(screen.getByText("resume.pdf")).toBeVisible();
    expect(screen.getByText(/2h ago/i)).toBeVisible();
    expect(screen.getByText(/skills extracted/i)).toBeVisible();
    expect(screen.getByText("Completed")).toBeVisible();
  });

  it("shows processing message and animation", () => {
    render(<AnalysisItem {...baseProps} status="processing" />);

    expect(screen.getByText(/processing now/i)).toBeVisible();
    const badge = screen.getByText("Processing");
    expect(badge.className).toContain("animate-pulse");
  });

  it("shows failed badge styling", () => {
    render(<AnalysisItem {...baseProps} status="failed" />);

    const badge = screen.getByText("Failed");
    expect(badge.className).toContain("bg-red-500/10");
    expect(badge.className).toContain("text-red-400");
  });

  it("calls onView when clicked", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();

    render(<AnalysisItem {...baseProps} onView={onView} />);

    await user.click(screen.getByText("resume.pdf"));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
