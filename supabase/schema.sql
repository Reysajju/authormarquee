-- AuthorMarquee — Supabase schema (PostgreSQL)
-- Run in the Supabase SQL editor. Demo data lives in lib/data.ts until then.
-- Tables exactly as specified, plus claim_slug on books (needed for
-- /claim/[slug] links, e.g. authormarquee.com/claim/b09xyz123 — planned URL, domain not yet bought).

create extension if not exists pgcrypto;

-- 1. authors
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  fcm_token text,
  credits_balance integer not null default 0,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. books
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references authors(id) on delete set null,
  asin text,
  title text not null,
  cover_url text,
  genre text not null,
  blurb text,
  claim_status text not null default 'unclaimed'
    check (claim_status in ('unclaimed', 'claimed')),
  claim_slug text unique,
  upvote_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. pool_entries
create table if not exists pool_entries (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  genre text not null,
  draw_date date not null,
  entry_type text not null default 'free_draw'
    check (entry_type in ('free_draw', 'shortlisted_finalist', 'free_winner')),
  discount_offer_expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- 4. sponsored_slots
create table if not exists sponsored_slots (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  genre text not null,
  slot_position text not null
    check (slot_position in ('#1_Hero', '#2_Spotlight', '#3_Spotlight')),
  feature_date date not null,
  price_paid numeric(10, 2),
  payment_source text
    check (payment_source in ('play_billing', 'web_checkout')),
  created_at timestamptz not null default now()
);

-- 5. analytics_events
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  event_type text not null
    check (event_type in ('impression', 'page_view', 'amazon_click', 'upvote')),
  visitor_country text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_books_genre on books(genre);
create index if not exists idx_books_claim_slug on books(claim_slug);
create index if not exists idx_books_author on books(author_id);
create index if not exists idx_pool_genre_date on pool_entries(genre, draw_date);
create index if not exists idx_pool_book on pool_entries(book_id);
create index if not exists idx_slots_genre_date on sponsored_slots(genre, feature_date);
create index if not exists idx_slots_book on sponsored_slots(book_id);
create index if not exists idx_analytics_book_type on analytics_events(book_id, event_type);
create index if not exists idx_analytics_created on analytics_events(created_at);

-- RLS: enable, then add permissive demo policies.
-- Tighten before production (e.g. authors see only their own rows).
alter table authors enable row level security;
alter table books enable row level security;
alter table pool_entries enable row level security;
alter table sponsored_slots enable row level security;
alter table analytics_events enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'demo_read_all' and tablename = 'books') then
    create policy demo_read_all on books for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'demo_read_all' and tablename = 'pool_entries') then
    create policy demo_read_all on pool_entries for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'demo_read_all' and tablename = 'sponsored_slots') then
    create policy demo_read_all on sponsored_slots for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'demo_read_all' and tablename = 'analytics_events') then
    create policy demo_read_all on analytics_events for select using (true);
  end if;
end $$;
