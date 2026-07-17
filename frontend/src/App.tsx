import { type FormEvent, useEffect, useState } from "react";

type ShortUrl = {
	id: number;
	code: string;
	originalUrl: string;
	createdAt: string;
};

const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

function App() {
	const [url, setUrl] = useState("");
	const [urls, setUrls] = useState<ShortUrl[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadUrls() {
			try {
				const response = await fetch(`${API_URL}/api/urls`);

				if (!response.ok) {
					throw new Error("Unable to load URLs");
				}

				const data = (await response.json()) as ShortUrl[];
				setUrls(data);
			} catch {
				setError("Unable to reach the API");
			} finally {
				setIsLoading(false);
			}
		}

		void loadUrls();
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(`${API_URL}/api/urls`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: url.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Invalid URL");
			}

			const createdUrl = (await response.json()) as ShortUrl;

			setUrls((currentUrls) => [createdUrl, ...currentUrls]);
			setUrl("");
		} catch {
			setError("Enter a valid URL beginning with http:// or https://");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
			<div className="mx-auto max-w-3xl">
				<header className="mb-10">
					<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
						Seconde
					</p>

					<h1 className="text-4xl font-bold tracking-tight">URL Shortener</h1>

					<p className="mt-3 text-slate-400">
						Create short, shareable links in seconds.
					</p>
				</header>

				<section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
					<form className="space-y-4" onSubmit={handleSubmit}>
						<label className="block text-sm font-medium" htmlFor="url">
							URL to shorten
						</label>

						<div className="flex flex-col gap-3 sm:flex-row">
							<input
								className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
								id="url"
								onChange={(event) => setUrl(event.target.value)}
								placeholder="https://example.com/article"
								required
								type="url"
								value={url}
							/>

							<button
								className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={isSubmitting}
								type="submit"
							>
								{isSubmitting ? "Shortening…" : "Shorten"}
							</button>
						</div>
					</form>

					{error && (
						<p
							aria-live="polite"
							className="mt-4 rounded-lg bg-red-950 px-4 py-3 text-sm text-red-300"
						>
							{error}
						</p>
					)}
				</section>

				<section className="mt-10">
					<h2 className="mb-4 text-xl font-semibold">Recent URLs</h2>

					{isLoading && <p className="text-slate-400">Loading…</p>}

					{!isLoading && urls.length === 0 && (
						<p className="text-slate-400">No shortened URL yet.</p>
					)}

					<ul className="space-y-3">
						{urls.map((item) => {
							const shortUrl = `${API_URL}/${item.code}`;

							return (
								<li
									className="rounded-xl border border-slate-800 bg-slate-900 p-5"
									key={item.id}
								>
									<a
										className="font-semibold text-cyan-400 hover:text-cyan-300"
										href={shortUrl}
										rel="noreferrer"
										target="_blank"
									>
										{shortUrl}
									</a>

									<p className="mt-2 truncate text-sm text-slate-400">
										{item.originalUrl}
									</p>

									<time className="mt-3 block text-xs text-slate-500">
										{new Date(item.createdAt).toLocaleString()}
									</time>
								</li>
							);
						})}
					</ul>
				</section>
			</div>
		</main>
	);
}

export default App;
