-- Create RSS sources table
create table if not exists public.rss_sources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text,
  description text,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url)
);

-- Enable RLS
alter table public.rss_sources enable row level security;

-- Create RLS policies
create policy "Users can manage their own RSS sources"
  on public.rss_sources
  for all
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists rss_sources_user_id_idx on public.rss_sources(user_id);

-- Add source column to articles if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'articles' 
    and column_name = 'source') then
    
    alter table public.articles 
    add column source text;
  end if;
end $$;
