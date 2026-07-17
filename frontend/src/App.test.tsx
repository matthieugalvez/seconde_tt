import { render, screen } from "@testing-library/react";
import App from "./App";

const fetchMock = jest.fn();

beforeEach(() => {
	fetchMock.mockResolvedValue({
		ok: true,
		json: async () => [],
	});

	globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
	fetchMock.mockReset();
});

test("renders the URL shortener form", async () => {
	render(<App />);

	expect(
		screen.getByRole("heading", { name: "URL Shortener" }),
	).toBeInTheDocument();

	expect(screen.getByLabelText("URL to shorten")).toBeInTheDocument();
	expect(await screen.findByText("No shortened URL yet.")).toBeInTheDocument();
});
