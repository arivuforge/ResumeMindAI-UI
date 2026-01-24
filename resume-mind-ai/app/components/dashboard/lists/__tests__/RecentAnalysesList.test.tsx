import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecentAnalysesList from "../RecentAnalysesList";

const sampleAnalyses = [
  {
    id: "1",
    fileName: "resume1.pdf",
    status: "completed" as const,
    nodesExtracted: 10,
    timestamp: "1h ago",
  },
  {
    id: "2",
    fileName: "resume2.pdf",
    status: "processing" as const,
    nodesExtracted: 0,
    timestamp: "Just now",
  },
];

describe("RecentAnalysesList", () => {
  it("renders analyses list items with header", () => {
    render(<RecentAnalysesList analyses={sampleAnalyses} />);

    expect(screen.getByText(/recent analyses/i)).toBeVisible();
    expect(screen.getByText("resume1.pdf")).toBeVisible();
    expect(screen.getByText("resume2.pdf")).toBeVisible();
  });

  it("renders empty state when no analyses", () => {
    render(<RecentAnalysesList analyses={[]} />);

    expect(screen.getByText(/no analyses yet/i)).toBeVisible();
    expect(
      screen.getByText(/supports pdf, docx, and txt formats/i),
    ).toBeVisible();
  });

  it("calls onViewAnalysis when item clicked", async () => {
    const user = userEvent.setup();
    const onViewAnalysis = vi.fn();

    render(
      <RecentAnalysesList
        analyses={sampleAnalyses}
        onViewAnalysis={onViewAnalysis}
      />,
    );

    await user.click(screen.getByText("resume1.pdf"));
    expect(onViewAnalysis).toHaveBeenCalledWith("1");
  });

  it("calls onViewAll when button clicked", async () => {
    const user = userEvent.setup();
    const onViewAll = vi.fn();

    render(
      <RecentAnalysesList
        analyses={sampleAnalyses}
        onViewAnalysis={vi.fn()}
        onViewAll={onViewAll}
      />,
    );

    await user.click(screen.getByRole("button", { name: /view all/i }));
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });
});
