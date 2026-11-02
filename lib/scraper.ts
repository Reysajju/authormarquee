// Book data lookup — skeleton + mock demo implementation.
// TODO (before any production use): do NOT scrape Amazon pages directly.
// Amazon's terms prohibit automated scraping, and results are unreliable.
// Compliant path: use the Google Books API (or another licensed book-data
// source) by ISBN/title/author, and only store data you are licensed to use.
// This file therefore ships a MOCK implementation so the demo runs with no
// live scraping, no network calls to Amazon, and no real book data.

export interface ScrapedBook {
  asin_or_isbn: string;
  title: string;
  author_name: string;
  genre: string;
  rating: number | null;
  review_count: number | null;
  blurb: string;
  cover_url: string | null;
  amazon_url: string | null;
  source: "mock-demo" | "google-books-api-todo";
}

/** Extract an ASIN (10 chars) from an Amazon URL, or accept a bare ASIN. */
export function parseAsinFromUrl(input: string): string | null {
  const trimmed = input.trim();
  const dp = trimmed.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dp) return dp[1].toUpperCase();
  const gp = trimmed.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gp) return gp[1].toUpperCase();
  if (/^[A-Z0-9]{10}$/i.test(trimmed)) return trimmed.toUpperCase();
  return null;
}

/** Demo only: returns plausible mock data for any ASIN/URL. No live fetch. */
export function mockScrapeBook(input: string): ScrapedBook {
  const asin = parseAsinFromUrl(input) ?? "B0DEMO0001";
  return {
    asin_or_isbn: asin,
    title: "Demo Book Title (mock — replace via Google Books API)",
    author_name: "Demo Author",
    genre: "Thriller & Mystery",
    rating: 4.5,
    review_count: 123,
    blurb: "Mock blurb. Wire this to Google Books API / a licensed source before launch.",
    cover_url: `https://picsum.photos/seed/${asin.toLowerCase()}/400/600`,
    amazon_url: `https://www.amazon.com/dp/${asin}`,
    source: "mock-demo",
  };
}

// Production stub — intentionally NOT implemented. When ready, implement
// fetch from Google Books API here (fetch by ISBN, map volumeInfo -> ScrapedBook)
// and keep this function returning mock data until then.
export async function scrapeBook(input: string): Promise<ScrapedBook> {
  // TODO: replace with Google Books API call. Do not add Amazon scraping here.
  return mockScrapeBook(input);
}
