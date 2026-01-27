import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAuthToken, apiFetch } from "../api";
import type { ApiError } from "../api";

// Mock the supabase client
vi.mock("../supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthToken", () => {
    it("returns token when session exists", async () => {
      const { createClient } = await import("../supabase/client");
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: { access_token: "test-token" } },
      });
      (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getSession: mockGetSession },
      });

      const token = await getAuthToken();
      expect(token).toBe("test-token");
    });

    it("returns null when no session exists", async () => {
      const { createClient } = await import("../supabase/client");
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: null },
      });
      (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getSession: mockGetSession },
      });

      const token = await getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe("apiFetch", () => {
    it("makes successful request with auth token", async () => {
      const { createClient } = await import("../supabase/client");
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: { access_token: "auth-token" } },
      });
      (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getSession: mockGetSession },
      });

      const mockResponse = { data: "test" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiFetch("/test");

      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer auth-token",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("uses provided token instead of getting auth token", async () => {
      const mockResponse = { data: "test" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      await apiFetch("/test", { token: "custom-token" });

      expect(fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer custom-token",
          }),
        }),
      );
    });

    it("handles 204 No Content response", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await apiFetch("/test");
      expect(result).toBeUndefined();
    });

    it("throws ApiError on failed request", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: "Bad request" }),
      });

      await expect(apiFetch("/test")).rejects.toThrow("Bad request");
    });

    it("uses default error message when none provided", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}),
      });

      try {
        await apiFetch("/test");
      } catch (error) {
        expect((error as ApiError).message).toBe("Request failed");
      }
    });

    it("handles JSON parsing errors gracefully", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      try {
        await apiFetch("/test");
      } catch (error) {
        expect((error as ApiError).message).toBe("Request failed");
      }
    });

    it("uses base URL from environment", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
      });

      await apiFetch("/test");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.any(Object),
      );

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it("handles missing base URL gracefully", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
      });

      await apiFetch("/test");

      expect(fetch).toHaveBeenCalledWith("/test", expect.any(Object));

      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it("does not include Authorization header when no token available", async () => {
      const { createClient } = await import("../supabase/client");
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: null },
      });
      (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getSession: mockGetSession },
      });

      const mockResponse = { data: "test" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      await apiFetch("/test");

      // Verify Authorization header is not present
      const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[0]).toBe("undefined/test");
      expect(callArgs[1].headers).toEqual({
        "Content-Type": "application/json",
      });
      expect(callArgs[1].headers).not.toHaveProperty("Authorization");
    });

    it("merges custom headers with default headers", async () => {
      const { createClient } = await import("../supabase/client");
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: { access_token: "auth-token" } },
      });
      (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
        auth: { getSession: mockGetSession },
      });

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({}),
      });

      await apiFetch("/test", {
        headers: {
          "X-Custom-Header": "custom-value",
          "Content-Type": "text/plain", // Should override default
        },
      });

      // Verify the headers were merged correctly
      const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(callArgs[1].headers).toEqual({
        "Content-Type": "text/plain",
        "X-Custom-Header": "custom-value",
        Authorization: "Bearer auth-token",
      });
    });
  });
});
