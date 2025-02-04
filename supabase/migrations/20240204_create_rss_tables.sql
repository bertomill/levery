-- Create RSS feeds table
create table if not exists public.rss_feeds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url)
);

-- Create articles table
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  feed_id uuid references public.rss_feeds(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  content text,
  author text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(feed_id, url)
);

-- Enable RLS
alter table public.rss_feeds enable row level security;
alter table public.articles enable row level security;

-- Create RLS policies
create policy "Users can manage their own RSS feeds"
  on public.rss_feeds
  for all
  using (auth.uid() = user_id);

create policy "Users can view articles from their feeds"
  on public.articles
  for select
  using (
    exists (
      select 1 from public.rss_feeds
      where rss_feeds.id = articles.feed_id
      and rss_feeds.user_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists rss_feeds_user_id_idx on public.rss_feeds(user_id);
create index if not exists articles_feed_id_idx on public.articles(feed_id);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
