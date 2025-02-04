-- Create users table if it doesn't exist
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  job_title text,
  industry text,
  goals text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comment to table
comment on table public.users is 'Profile data for each user.';

-- Create indexes
create index if not exists users_id_index on public.users(id);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);
