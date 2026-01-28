"use client";

import { useState, useEffect, useCallback } from "react";
import type { GraphData } from "../types/graph";
import { dummyGraphData } from "../data/dummyGraphData";

interface UseGraphDataOptions {
  documentId?: string;
  useDummyData?: boolean;
}

interface UseGraphDataReturn {
  data: GraphData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching graph data.
 * Currently returns dummy data; ready for future BE API integration.
 */
export function useGraphData(
  options: UseGraphDataOptions = {},
): UseGraphDataReturn {
  const { useDummyData = true } = options;

  const [data, setData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useDummyData) {
        // Simulate network delay for realistic loading state
        await new Promise((resolve) => setTimeout(resolve, 800));
        setData(dummyGraphData);
      } else {
        // Future: Fetch from backend API
        // const response = await api.get<GraphData>(
        //   `/api/documents/${documentId}/graph`
        // );
        // if (response.error) throw new Error(response.error.message);
        // setData(response.data);
        throw new Error("Backend API not yet available");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load graph";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [useDummyData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}
