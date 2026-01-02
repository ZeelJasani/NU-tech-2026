-- Migration: 004_diagram_features.sql
-- Description: Implements backend logic for visual elements in the diagram: Notes, SOS, Chat, Language.

-- 1. Update Profiles for Language Support
-- "Language" selector in top bar
alter table public.profiles add column if not exists language_code text default 'en';

-- 2. User Notes
-- "My Notes" in Quick Actions
create table public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. SOS Events
-- "SOS Icon" in top bar
create table public.sos_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lat double precision, -- Optional, if GPS available
  lng double precision, -- Optional
  status text default 'active' check (status in ('active', 'resolved', 'false_alarm')),
  created_at timestamp with time zone default now()
);

-- 4. Chat Logs (AI Chatbot)
-- "AI Chatbot Icon" -> "Ask me about disaster safety"
create table public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  sender text check (sender in ('user', 'bot')),
  message text not null,
  created_at timestamp with time zone default now()
);

-- 5. Enable RLS
alter table public.user_notes enable row level security;
alter table public.sos_events enable row level security;
alter table public.chat_logs enable row level security;

-- 6. Policies

-- Notes: Users manage their own notes
create policy "Users can crud own notes" on public.user_notes
  using (auth.uid() = user_id);

-- SOS: Users create events, Admins view all
create policy "Users can create sos" on public.sos_events
  for insert with check (auth.uid() = user_id);

create policy "Users can view own sos" on public.sos_events
  for select using (auth.uid() = user_id);

create policy "Admins can view all sos" on public.sos_events
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update sos status" on public.sos_events
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Chat: Users view/insert their own history
create policy "Users can crud own chat" on public.chat_logs
  using (auth.uid() = user_id);
