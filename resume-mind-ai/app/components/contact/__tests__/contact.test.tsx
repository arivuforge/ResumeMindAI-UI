import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactInfo from "../ContactInfo";

const originalEnv = { ...process.env };

describe("Contact components", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("ContactInfo", () => {
    it("renders all contact items and social links", () => {
      render(<ContactInfo />);

      expect(screen.getByText("Get in Touch")).toBeInTheDocument();
      expect(screen.getByText("Email Support")).toBeInTheDocument();
      expect(screen.getByText("arivuforge@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Response Time")).toBeInTheDocument();
      expect(
        screen.getByText(/Typically within 24 business hours/i),
      ).toBeInTheDocument();

      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/Shrijeeth/ResumeMindAI-CLI",
      );

      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink).toBeInTheDocument();
    });
  });

  describe("ContactForm", () => {
    const fillForm = async () => {
      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/Name/i), "Jane Doe");
      await user.type(screen.getByLabelText(/Work Email/i), "jane@company.com");
      await user.type(screen.getByLabelText(/Subject/i), "Hello");
      await user.type(screen.getByLabelText(/Message/i), "Testing form submit");
    };

    it("shows configuration error when access key is missing", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = ""; // explicit missing key
      const { default: ContactForm } = await import("../ContactForm");
      render(<ContactForm />);

      await fillForm();

      await userEvent.click(
        screen.getByRole("button", { name: /Send Message/i }),
      );

      expect(
        await screen.findByText(
          /Missing form configuration. Please try again later./i,
        ),
      ).toBeInTheDocument();
    });

    it("shows configuration error when access key env is undefined", async () => {
      delete process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      const { default: ContactForm } = await import("../ContactForm");
      render(<ContactForm />);

      await fillForm();

      await userEvent.click(
        screen.getByRole("button", { name: /Send Message/i }),
      );

      expect(
        await screen.findByText(
          /Missing form configuration. Please try again later./i,
        ),
      ).toBeInTheDocument();
    });

    it("submits form and shows success message", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true, message: "OK" }),
      } as unknown as Response;

      // Stub fetch before rendering to avoid any real network calls
      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);
      // jsdom sometimes reads fetch from window; align both
      (globalThis as unknown as { window?: { fetch?: typeof fetch } }).window =
        {
          ...globalThis.window,
          fetch: fetchSpy as unknown as typeof fetch,
        };

      const { default: ContactForm } = await import("../ContactForm");

      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(
        await findByText(/Form submitted successfully|OK/i),
      ).toBeInTheDocument();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [[requestUrl, requestInit]] = fetchSpy.mock.calls as unknown as [
        [string, RequestInit],
      ];
      expect(requestUrl).toContain("web3forms");
      expect(requestInit.method).toBe("POST");
      // FormData can't be string-compared; ensure access_key was appended
      const body = requestInit.body as FormData;
      expect(body.get("access_key")).toBe("test-key");
    });

    it("shows server error message when response is not ok", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ message: "Server blew up" }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(await findByText(/Server blew up/i)).toBeInTheDocument();
    });

    it("shows generic error when response ok but success flag is false", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi
          .fn()
          .mockResolvedValue({ success: false, message: "Not allowed" }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(await findByText(/Not allowed/i)).toBeInTheDocument();
    });

    it("shows generic error when success flag is false without message", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: false }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(await findByText(/Error sending message/i)).toBeInTheDocument();
    });

    it("shows network error message when fetch rejects", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const fetchSpy = vi.fn().mockRejectedValue(new Error("boom"));
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(
        await findByText(/Network error, please try again/i),
      ).toBeInTheDocument();
    });

    it("falls back to default success message when none provided", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);
      (globalThis as unknown as { window?: { fetch?: typeof fetch } }).window =
        {
          ...globalThis.window,
          fetch: fetchSpy as unknown as typeof fetch,
        };

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(
        await findByText(/Form submitted successfully/i),
      ).toBeInTheDocument();
    });

    it("falls back to status text when response is not ok and no message returned", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: false,
        status: 503,
        json: vi.fn().mockResolvedValue(null),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(await findByText(/status 503/i)).toBeInTheDocument();
    });

    it("prevents duplicate submissions while one is in flight", async () => {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      let resolveFetch: (value: Response) => void = () => {};
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      );
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole, findByText } = render(<ContactForm />);
      await fillForm();

      const button = getByRole("button", { name: /Send Message/i });
      await userEvent.click(button);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      await userEvent.click(button);

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Resolve the in-flight request to let component finish
      resolveFetch!(mockResponse);

      expect(
        await findByText(/Form submitted successfully/i),
      ).toBeInTheDocument();
    });

    it("uses default Web3Forms URL when env is unset", async () => {
      delete process.env.NEXT_PUBLIC_WEB3FORMS_URL;
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "test-key";

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      } as unknown as Response;

      const fetchSpy = vi.fn().mockResolvedValue(mockResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { default: ContactForm } = await import("../ContactForm");
      const { getByRole } = render(<ContactForm />);
      await fillForm();

      await userEvent.click(getByRole("button", { name: /Send Message/i }));

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.web3forms.com/submit",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
