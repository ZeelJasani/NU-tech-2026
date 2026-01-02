-- Migration: 001_initial_schema.sql
-- Description: Sets up the profiles table and links it to Supabase Auth.

-- 1. Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  role text default 'citizen' check (role in ('citizen', 'student', 'trainer', 'admin')),
  preparedness_score int default 0,
  region text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  primary key (id),
  constraint username_length check (char_length(full_name) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create Policy: Public Read (Everyone can view basic profile info - optional, or restrict to self)
-- For this app, let's say users can only read their own profile for now.
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

-- 4. Create Policy: Users can update their own profile
create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- 5. Create a Trigger to auto-create profile on Signup
-- This function runs securely on the server side (Definer = Admin privileges)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'citizen');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Grant usage to authenticated users
grant usage on schema public to anon, authenticated;
grant all on public.profiles to postgres, service_role;
grant select, update on public.profiles to authenticated;
