-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);
