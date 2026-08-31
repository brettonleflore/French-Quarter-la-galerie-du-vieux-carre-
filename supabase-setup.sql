-- Run this once in Supabase → SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  session_id text not null,
  referrer text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_at_idx on public.page_views(created_at desc);
create index if not exists page_views_session_id_idx on public.page_views(session_id);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  arrival date not null,
  departure date not null,
  guests integer not null default 1,
  message text,
  source_page text,
  status text not null default 'new' check (status in ('new','contacted','booked','closed')),
  created_at timestamptz not null default now()
);
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);

alter table public.page_views enable row level security;
alter table public.inquiries enable row level security;
-- No public policies are created. The browser never receives a database key;
-- only the Vercel serverless API uses the Supabase service-role key.
