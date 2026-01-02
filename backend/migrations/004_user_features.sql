-- Migration: 004_user_features.sql
-- Description: Adds tables for User Notes, SOS Signals, detailed Progress, and Profile enhancements.

-- 1. Updates to Profiles (Language Support)
alter table public.profiles 
add column if not exists language_code text default 'en';

-- 2. User Notes Table ('My Notes')
create table if not exists public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text, -- Optional title
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. SOS Signals Table
create table if not exists public.sos_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  location jsonb, -- e.g. {"lat": 12.34, "lng": 56.78} or "Home"
  status text default 'active' check (status in ('active', 'resolved', 'false_alarm')),
  created_at timestamp with time zone default now()
);

-- 4. Module Progress Table (Granular Tracking)
-- Tracks if a user has watched the video or read the content, separate from quiz scores.
create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  module_id uuid references public.modules(id) on delete cascade not null,
  video_watched boolean default false,
  content_read boolean default false,
  last_updated timestamp with time zone default now(),
  
  unique(user_id, module_id) -- One progress record per module per user
);

-- 5. Row Level Security (RLS)

-- Enable RLS
alter table public.user_notes enable row level security;
alter table public.sos_signals enable row level security;
alter table public.module_progress enable row level security;

-- Policies for User Notes
create policy "Users can manage own notes" 
on public.user_notes for all 
using (auth.uid() = user_id);

-- Policies for SOS Signals
create policy "Users can create SOS signals" 
on public.sos_signals for insert 
with check (auth.uid() = user_id);

create policy "Users can read own SOS signals" 
on public.sos_signals for select 
using (auth.uid() = user_id);

-- (Optional) Admins can read all SOS signals
-- create policy "Admins can read all SOS" 
-- on public.sos_signals for select 
-- using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Policies for Module Progress
create policy "Users can manage own progress" 
on public.module_progress for all 
using (auth.uid() = user_id);
