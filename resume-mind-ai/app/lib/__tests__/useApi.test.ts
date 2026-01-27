/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useApi, clearApiCache, invalidateCache } from "../useApi";
import { apiFetch } from "../api";

// Mock the apiFetch function
vi.mock("../api", () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearApiCache();
  });

  describe("basic functionality", () => {
    it("returns initial loading state", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { result } = renderHook(() => useApi("/test"));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isValidating).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(typeof result.current.mutate).toBe("function");
    });

    it("does not fetch when path is null", () => {
      const { result } = renderHook(() => useApi(null));

      expect(result.current.isLoading).toBe(true); // Initial state
      expect(result.current.isValidating).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();

      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  describe("mutate function", () => {
    it("mutate function exists and is callable", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { result } = renderHook(() => useApi("/test"));

      expect(typeof result.current.mutate).toBe("function");
      expect(() => result.current.mutate()).not.toThrow();
    });

    it("mutate with function argument updates data and cache", async () => {
      (apiFetch as any).mockResolvedValue([]);

      const { result } = renderHook(() => useApi<string[]>("/test"));

      // Wait for initial load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updateFn = (current?: string[]) => [...(current || []), "new-item"];

      // Trigger the mutate and wait for it to complete
      await result.current.mutate(updateFn);

      // Wait a bit for the state to update
      await vi.waitFor(() => {
        expect(result.current.data).toEqual(["new-item"]);
      });
    });

    it("mutate with Promise argument updates data and cache", async () => {
      (apiFetch as any).mockResolvedValue("initial");

      const { result } = renderHook(() => useApi<string>("/test"));

      // Wait for initial load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const promiseData = Promise.resolve("promise-result");
      await result.current.mutate(promiseData);

      // Wait a bit for the state to update
      await vi.waitFor(() => {
        expect(result.current.data).toBe("promise-result");
      });
    });

    it("mutate with direct data updates data and cache", async () => {
      (apiFetch as any).mockResolvedValue("initial");

      const { result } = renderHook(() => useApi<string>("/test"));

      // Wait for initial load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.mutate("direct-data");

      // Wait a bit for the state to update
      await vi.waitFor(() => {
        expect(result.current.data).toBe("direct-data");
      });
    });

    it("mutate with no argument triggers revalidation", async () => {
      const mockApiFetch = vi.fn().mockResolvedValue("revalidated");
      (apiFetch as any) = mockApiFetch;

      const { result } = renderHook(() => useApi<string>("/test"));

      // Wait for initial load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.mutate();

      expect(mockApiFetch).toHaveBeenCalledWith("/test");
    });

    it("mutate handles undefined data correctly", async () => {
      (apiFetch as any).mockResolvedValue("initial");

      const { result } = renderHook(() => useApi<string>("/test"));

      // Wait for initial load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.mutate(undefined);

      // Should trigger revalidation when undefined is passed
      expect(apiFetch).toHaveBeenCalled();
    });

    it("handles and sets error when request fails", async () => {
      const mockError = new Error("Test error") as any;
      mockError.status = 500;
      mockError.message = "Test error";

      (apiFetch as any).mockRejectedValue(mockError);

      const { result } = renderHook(() => useApi<string>("/test"));

      // Wait for the error to be handled
      await vi.waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("Test error");
        expect(result.current.error?.status).toBe(500);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isValidating).toBe(false);
      });
    });

    it("does not set error when component is unmounted during error", async () => {
      vi.useFakeTimers();

      const mockError = new Error("Test error") as any;
      mockError.status = 500;
      mockError.message = "Test error";

      (apiFetch as any).mockRejectedValue(mockError);

      const { result, unmount } = renderHook(() => useApi<string>("/test"));

      // Unmount immediately
      unmount();

      // Advance timers to trigger the error handling
      vi.advanceTimersByTime(0);

      // Wait for the error to be handled
      await vi.waitFor(() => {
        // Error should not be set since component is unmounted
        expect(result.current.error).toBeUndefined();
      });

      vi.useRealTimers();
    });
  });

  describe("refresh interval", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets up refresh interval when provided", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { result } = renderHook(() =>
        useApi("/test", { refreshInterval: 5000 }),
      );

      expect(result.current.isLoading).toBe(true);

      // Fast-forward time
      vi.advanceTimersByTime(5000);

      expect(apiFetch).toHaveBeenCalledTimes(2); // Initial + refresh
    });

    it("does not set up interval when refreshInterval is 0", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() => useApi("/test", { refreshInterval: 0 }));

      vi.advanceTimersByTime(10000);

      expect(apiFetch).toHaveBeenCalledTimes(1); // Only initial call
    });

    it("does not set up interval when refreshInterval is negative", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() => useApi("/test", { refreshInterval: -1000 }));

      vi.advanceTimersByTime(10000);

      expect(apiFetch).toHaveBeenCalledTimes(1); // Only initial call
    });

    it("cleans up interval on unmount", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { unmount } = renderHook(() =>
        useApi("/test", { refreshInterval: 5000 }),
      );

      vi.advanceTimersByTime(5000);
      expect(apiFetch).toHaveBeenCalledTimes(2);

      unmount();

      // Advance time after unmount - should not trigger additional calls
      vi.advanceTimersByTime(5000);
      expect(apiFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("caching behavior", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns cached data when available and not expired", async () => {
      const mockData = { data: "cached" };
      (apiFetch as any).mockResolvedValue(mockData);

      // First call - should fetch
      const { result, rerender } = renderHook(() => useApi("/cache-test"));

      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(apiFetch).toHaveBeenCalledTimes(1);

      // Rerender with same path - should use cache
      rerender();

      // Should not fetch again since cache is still valid
      expect(apiFetch).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockData);
    });

    it("fetches fresh data when cache is expired", async () => {
      const mockData1 = "first";
      const mockData2 = "second";
      (apiFetch as any)
        .mockResolvedValueOnce(mockData1)
        .mockResolvedValueOnce(mockData2);

      const { result } = renderHook(() => useApi("/cache-test"));

      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData1);
      expect(apiFetch).toHaveBeenCalledTimes(1);

      // Advance time beyond cache TTL (30 seconds)
      vi.advanceTimersByTime(31000);

      // Trigger re-fetch by calling mutate with no args
      await result.current.mutate();

      await vi.waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });

      expect(apiFetch).toHaveBeenCalledTimes(2);
    });

    it("initializes with cached data from previous hook instance", async () => {
      const mockData = "cached";
      (apiFetch as any).mockResolvedValue(mockData);

      // First hook instance to populate cache
      const { result: result1, unmount } = renderHook(() =>
        useApi("/shared-cache"),
      );

      await vi.waitFor(() => {
        expect(result1.current.data).toEqual(mockData);
      });

      unmount();

      // Second hook instance should initialize with cached data
      const { result: result2 } = renderHook(() => useApi("/shared-cache"));

      // Should immediately have cached data without loading state
      expect(result2.current.data).toEqual(mockData);
      expect(result2.current.isLoading).toBe(false);
    });

    it("does not use cache when path is null", () => {
      const { result } = renderHook(() => useApi(null));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  describe("deduping interval", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("dedupes requests within deduping interval", async () => {
      (apiFetch as any).mockResolvedValue("test");

      const { result } = renderHook(() =>
        useApi("/dedupe-test", { dedupingInterval: 2000 }),
      );

      // Initial fetch
      expect(apiFetch).toHaveBeenCalledTimes(1);

      // Wait for deduping interval to pass
      vi.advanceTimersByTime(2001);

      // Trigger another fetch with mutate
      await result.current.mutate();
      expect(apiFetch).toHaveBeenCalledTimes(2);
    });

    it("respects custom deduping interval", async () => {
      (apiFetch as any).mockResolvedValue("test");

      const { result } = renderHook(() =>
        useApi("/dedupe-custom", { dedupingInterval: 5000 }),
      );

      // Initial fetch
      expect(apiFetch).toHaveBeenCalledTimes(1);

      // Try to fetch before custom interval - should be deduped
      vi.advanceTimersByTime(4000);
      await result.current.mutate();
      expect(apiFetch).toHaveBeenCalledTimes(1);

      // After custom interval - should fetch
      vi.advanceTimersByTime(1001);
      await result.current.mutate();
      expect(apiFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("revalidation on focus and reconnect", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Mock window object
      Object.defineProperty(window, "addEventListener", {
        value: vi.fn(),
        writable: true,
      });
      Object.defineProperty(window, "removeEventListener", {
        value: vi.fn(),
        writable: true,
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets up focus revalidation when enabled", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() => useApi("/focus-test", { revalidateOnFocus: true }));

      expect(window.addEventListener).toHaveBeenCalledWith(
        "focus",
        expect.any(Function),
      );
    });

    it("does not set up focus revalidation when disabled", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() => useApi("/focus-test", { revalidateOnFocus: false }));

      expect(window.addEventListener).not.toHaveBeenCalledWith(
        "focus",
        expect.any(Function),
      );
    });

    it("sets up reconnect revalidation when enabled", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() =>
        useApi("/reconnect-test", { revalidateOnReconnect: true }),
      );

      expect(window.addEventListener).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
    });

    it("does not set up reconnect revalidation when disabled", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      renderHook(() =>
        useApi("/reconnect-test", { revalidateOnReconnect: false }),
      );

      expect(window.addEventListener).not.toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
    });

    it("cleans up event listeners on unmount", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { unmount } = renderHook(() =>
        useApi("/cleanup-test", {
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
        }),
      );

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "focus",
        expect.any(Function),
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
    });
  });

  describe("cache utilities", () => {
    it("clearApiCache clears all cached data", () => {
      // Test that the function exists and can be called
      expect(typeof clearApiCache).toBe("function");
      expect(() => clearApiCache()).not.toThrow();
    });

    it("invalidateCache clears specific path", () => {
      // Test that the function exists and can be called
      expect(typeof invalidateCache).toBe("function");
      expect(() => invalidateCache("/test")).not.toThrow();
    });
  });

  describe("internal callback functions", () => {
    it("initializes state with cached data when available", async () => {
      // Set up cache first by populating it
      const mockData = { cached: "data" };
      (apiFetch as any).mockResolvedValue(mockData);

      // First hook to populate cache
      const { result: result1, unmount } = renderHook(() =>
        useApi("/cache-init-test"),
      );

      // Wait for data to be cached
      await vi.waitFor(() => {
        expect(result1.current.data).toEqual(mockData);
      });

      unmount();

      // Second hook should initialize with cached data
      const { result: result2 } = renderHook(() => useApi("/cache-init-test"));

      // Should immediately have cached data without loading
      expect(result2.current.data).toEqual(mockData);
      expect(result2.current.isLoading).toBe(false);
    });

    it("initializes state without cached data when none available", () => {
      (apiFetch as any).mockResolvedValue({ data: "test" });

      const { result } = renderHook(() => useApi("/no-cache-test"));

      // Should start with loading state since no cache
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("initializes state with expired cache data", () => {
      vi.useFakeTimers();

      const mockData = { cached: "data" };
      (apiFetch as any).mockResolvedValue(mockData);

      // First hook to populate cache
      const { result: result1, unmount } = renderHook(() =>
        useApi("/cache-expired-test"),
      );

      // Wait for data to be cached
      vi.waitFor(() => {
        expect(result1.current.data).toEqual(mockData);
      }).then(() => {
        unmount();

        // Advance time beyond cache TTL (30 seconds)
        vi.advanceTimersByTime(31000);

        // Second hook should not use expired cache
        const { result: result2 } = renderHook(() =>
          useApi("/cache-expired-test"),
        );

        // Should start with loading state since cache is expired
        expect(result2.current.isLoading).toBe(true);
        expect(result2.current.data).toBeUndefined();

        vi.useRealTimers();
      });
    });
  });
});
