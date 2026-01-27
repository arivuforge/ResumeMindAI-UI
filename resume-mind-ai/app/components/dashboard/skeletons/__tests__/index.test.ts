import {
  PipelineStatusSkeleton,
  ProviderCardSkeleton,
  InsightCardSkeleton,
  RecentAnalysesListSkeleton,
  KnowledgeGraphSkeleton,
} from "../index";
import { render } from "@testing-library/react";

describe("skeletons index exports", () => {
  it("exports PipelineStatusSkeleton correctly", () => {
    expect(PipelineStatusSkeleton).toBeDefined();
    expect(typeof PipelineStatusSkeleton).toBe("function");
  });

  it("exports ProviderCardSkeleton correctly", () => {
    expect(ProviderCardSkeleton).toBeDefined();
    expect(typeof ProviderCardSkeleton).toBe("function");
  });

  it("exports InsightCardSkeleton correctly", () => {
    expect(InsightCardSkeleton).toBeDefined();
    expect(typeof InsightCardSkeleton).toBe("function");
  });

  it("exports RecentAnalysesListSkeleton correctly", () => {
    expect(RecentAnalysesListSkeleton).toBeDefined();
    expect(typeof RecentAnalysesListSkeleton).toBe("function");
  });

  it("exports KnowledgeGraphSkeleton correctly", () => {
    expect(KnowledgeGraphSkeleton).toBeDefined();
    expect(typeof KnowledgeGraphSkeleton).toBe("function");
  });

  it("exports all expected skeleton components", () => {
    const exports = {
      PipelineStatusSkeleton,
      ProviderCardSkeleton,
      InsightCardSkeleton,
      RecentAnalysesListSkeleton,
      KnowledgeGraphSkeleton,
    };

    const expectedExports = [
      "PipelineStatusSkeleton",
      "ProviderCardSkeleton",
      "InsightCardSkeleton",
      "RecentAnalysesListSkeleton",
      "KnowledgeGraphSkeleton",
    ];

    expectedExports.forEach((exportName) => {
      expect(exports[exportName as keyof typeof exports]).toBeDefined();
    });
  });

  it("all exports are functions/components", () => {
    const components = [
      PipelineStatusSkeleton,
      ProviderCardSkeleton,
      InsightCardSkeleton,
      RecentAnalysesListSkeleton,
      KnowledgeGraphSkeleton,
    ];

    components.forEach((component) => {
      expect(typeof component).toBe("function");
    });
  });

  it("can render all exported skeleton components", () => {
    expect(() => render(PipelineStatusSkeleton())).not.toThrow();
    expect(() => render(ProviderCardSkeleton())).not.toThrow();
    expect(() => render(InsightCardSkeleton())).not.toThrow();
    expect(() => render(RecentAnalysesListSkeleton())).not.toThrow();
    expect(() => render(KnowledgeGraphSkeleton())).not.toThrow();
  });
});
