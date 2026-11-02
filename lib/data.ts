// Mock data layer. The app runs WITHOUT Supabase/Stripe/FCM keys.
// Swap these helpers for real Supabase queries only after keys are supplied.
// Covers are picsum placeholders — never scraped Amazon images.
// MOBILE APP FIRST: this data powers the Android app (Capacitor).
// authormarquee.com is only a landing page; it does not host the app.

export const GENRES = [
  "Romance",
  "Thriller & Mystery",
  "Sci-Fi & Fantasy",
  "Non-Fiction & Self-Help",
  "Horror",
  "Historical",
  "YA",
  "Business",
  "Poetry",
  "Memoir",
] as const;

export type Genre = (typeof GENRES)[number];
export type ClaimStatus = "unclaimed" | "claimed";
export type EntryType = "free_draw" | "shortlisted_finalist" | "free_winner";

export interface ReaderReview {
  name: string;
  rating: number;
  text: string;
}

export interface MockBook {
  id: string;
  asin: string;
  title: string;
  author_name: string;
  genre: Genre;
  blurb: string;
  longBlurb: string;
  authorBio: string;
  rating: number;
  review_count: number;
  upvote_count: number;
  cover_url: string;
  amazon_url: string;
  claim_slug: string;
  claim_status: ClaimStatus;
  pages: number;
  publishedYear: number;
  language: string;
  listPrice: number;
  poolRank: number;
  impressions: number;
  pageViews: number;
  amazonClicks: number;
  series7: number[]; // last 7 days of impressions, for SVG charts
  reviews: ReaderReview[];
}

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/400/600`;

const REVIEWERS = ["Emma W.", "Carlos M.", "Priya S.", "Jordan T.", "Hannah L.", "Marcus B."];
const REVIEW_TEXTS = [
  "Could not put it down. Finished it in two nights and immediately recommended it to my book club.",
  "The pacing is superb and the ending genuinely surprised me. Deserves the front page.",
  "Beautifully written. I highlighted half the book and I am already waiting for the next one.",
  "A slow start, then it grips you and does not let go. One of my favourites this year.",
  "Easy to read, hard to forget. I bought a second copy as a gift.",
];

function seeded(n: number, salt: number) {
  const x = Math.sin(n * 127.1 + salt * 311.7) * 10000;
  return x - Math.floor(x);
}

function book(
  id: string,
  title: string,
  author_name: string,
  genre: Genre,
  upvote_count: number,
  rating = 4.5,
  claim_status: ClaimStatus = "unclaimed"
): MockBook {
  const n = parseInt(id, 10);
  const impressions = Math.round(upvote_count * 38 + 1200 + seeded(n, 1) * 3000);
  const pageViews = Math.round(impressions * 0.28);
  const amazonClicks = Math.round(pageViews * 0.15);
  const series7 = Array.from({ length: 7 }, (_, i) =>
    Math.round(impressions / 7 * (0.7 + seeded(n, i + 2) * 0.7))
  );
  const reviews: ReaderReview[] = [0, 1, 2].map((i) => ({
    name: REVIEWERS[(n + i) % REVIEWERS.length],
    rating: Math.max(3, Math.min(5, Math.round(rating + (seeded(n, i + 9) - 0.5)))),
    text: REVIEW_TEXTS[(n + i) % REVIEW_TEXTS.length],
  }));
  return {
    id,
    asin: `B0${id.padStart(8, "0")}`,
    title,
    author_name,
    genre,
    blurb: `A ${genre.toLowerCase()} read readers are talking about — the book that keeps climbing the ${genre} pool.`,
    longBlurb: `"${title}" is a ${genre.toLowerCase()} read that has been winning readers one upvote at a time. ${author_name} builds a world you step into fast and a story that keeps paying off to the last page. Readers call it the kind of book you finish, sit with for a minute, and then immediately hand to someone else. In the AuthorMarquee pool it is competing for today's front page, and every free upvote moves it closer to the lights.`,
    authorBio: `${author_name} writes ${genre.toLowerCase()} readers return to. Known for sharp pacing and characters that stay with you after the last page, ${author_name} has built a loyal audience one honest story at a time.`,
    rating,
    review_count: 120 + upvote_count * 3,
    upvote_count,
    cover_url: cover(id),
    amazon_url: `https://www.amazon.com/dp/B0${id.padStart(8, "0")}`,
    claim_slug: `b0${id.padStart(8, "0")}`,
    claim_status,
    pages: 180 + Math.floor(seeded(n, 3) * 320),
    publishedYear: 2019 + (n % 7),
    language: "English",
    listPrice: Math.round((9.99 + seeded(n, 4) * 12) * 100) / 100,
    poolRank: 1,
    impressions,
    pageViews,
    amazonClicks,
    series7,
    reviews,
  };
}

export const MOCK_BOOKS: MockBook[] = [
  book("00000001", "The Midnight Letter", "Ayesha Khan", "Romance", 342, 4.7),
  book("00000002", "Love on the Last Train", "Daniel Reed", "Romance", 198, 4.4, "claimed"),
  book("00000003", "The Silent Witness", "Maya Okafor", "Thriller & Mystery", 511, 4.8),
  book("00000004", "Shadows Over Harrow", "Tom Ellison", "Thriller & Mystery", 289, 4.5),
  book("00000005", "Stars Beyond the Veil", "Lina Haddad", "Sci-Fi & Fantasy", 428, 4.6),
  book("00000006", "The Dragon's Ledger", "Owen Marsh", "Sci-Fi & Fantasy", 203, 4.3),
  book("00000007", "Atomic Habits for Founders", "Sara Iqbal", "Non-Fiction & Self-Help", 377, 4.7),
  book("00000008", "The Quiet Mind", "James Cole", "Non-Fiction & Self-Help", 164, 4.2),
  book("00000009", "The House That Whispered", "Nadia Hussain", "Horror", 296, 4.5),
  book("00000010", "Night of the Hollow", "Peter Voss", "Horror", 141, 4.1),
  book("00000011", "The Winter Duchess", "Elena Rossi", "Historical", 233, 4.6),
  book("00000012", "Empire of Salt", "Henry Grant", "Historical", 119, 4.4),
  book("00000013", "Sixteen Summers", "Zoe Bennett", "YA", 354, 4.7),
  book("00000014", "The Last School Bell", "Ali Raza", "YA", 187, 4.3),
  book("00000015", "The Founder's Playbook", "Rachel Kim", "Business", 402, 4.8),
  book("00000016", "Small Bets, Big Returns", "Mark Doyle", "Business", 176, 4.2, "claimed"),
  book("00000017", "Verses for Rainy Days", "Fatima Noor", "Poetry", 221, 4.6),
  book("00000018", "Paper Moons", "Jonas Berg", "Poetry", 98, 4.0),
  book("00000019", "My Mother's Kitchen", "Grace Adeyemi", "Memoir", 318, 4.7),
  book("00000020", "Walking Back Home", "Samuel Ortiz", "Memoir", 145, 4.4),
  book("00000021", "The Silent Witness", "Maya Okafor", "Thriller & Mystery", 511, 4.8),
];

// Pool rank: #1 = most upvotes in that genre.
for (const genre of GENRES) {
  const ranked = [...MOCK_BOOKS].filter((b) => b.genre === genre).sort((a, b) => b.upvote_count - a.upvote_count);
  ranked.forEach((b, i) => { const orig = MOCK_BOOKS.find((x) => x.id === b.id); if (orig) orig.poolRank = i + 1; });
}

export const DEMO_AUTHOR = {
  name: "Maya Okafor",
  email: "demo-author@example.com",
  password: "demo-password-placeholder",
  creditsBalance: 25,
  activeSlots: 2,
};

export const HERO_BOOK = MOCK_BOOKS[2];
export const MARQUEE_BOOKS = [MOCK_BOOKS[0], MOCK_BOOKS[4]];
export const FREE_WINNER_BOOK = MOCK_BOOKS[14];

export function getBookBySlug(slug: string): MockBook | undefined {
  return MOCK_BOOKS.find((b) => b.claim_slug === slug);
}
export function getBookById(id: string): MockBook | undefined {
  return MOCK_BOOKS.find((b) => b.id === id);
}
export function booksByGenre(genre: Genre): MockBook[] {
  return MOCK_BOOKS.filter((b) => b.genre === genre);
}
export function leaderboardForGenre(genre: Genre, limit = 5): MockBook[] {
  return booksByGenre(genre).sort((a, b) => b.upvote_count - a.upvote_count).slice(0, limit);
}
export function trendingBooks(limit = 6): MockBook[] {
  return [...MOCK_BOOKS].sort((a, b) => b.upvote_count * b.rating - a.upvote_count * a.rating).slice(0, limit);
}
export function poolSizeForGenre(genre: Genre): number {
  const sizes: Record<string, number> = {
    "Thriller & Mystery": 162, Romance: 148, "Sci-Fi & Fantasy": 131,
    "Non-Fiction & Self-Help": 119, Horror: 87, Historical: 94, YA: 108,
    Business: 76, Poetry: 63, Memoir: 71,
  };
  return sizes[genre] ?? 100;
}

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", icon: "🔥", title: "You made the Top 5% Finalist cut!", body: "The Silent Witness is a finalist in Thriller & Mystery. Your 24h Priority Slot offer is live.", time: "2h ago", unread: true },
  { id: "n2", icon: "🎉", title: "Midnight draw result", body: "Today's free winner in Business is The Founder's Playbook. No payment was involved.", time: "6h ago", unread: true },
  { id: "n3", icon: "⏰", title: "Slot expiring soon", body: "Your #2 Spotlight slot ends in 9 hours. Extend at 50% off before it closes.", time: "9h ago", unread: false },
  { id: "n4", icon: "👑", title: "Defend your crown", body: "You are #1 in Thriller & Mystery today with 184 impressions so far. Keep the crown for 48h more.", time: "Yesterday", unread: false },
  { id: "n5", icon: "⬆️", title: "12 new upvotes", body: "Readers upvoted The Silent Witness after you shared your link. Sharing is free and boosts your odds.", time: "Yesterday", unread: false },
];
