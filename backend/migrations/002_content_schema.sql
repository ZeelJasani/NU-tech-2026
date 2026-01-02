-- Migration: 002_content_schema.sql
-- Description: Sets up the educational content (Hazards, Modules, Quizzes).

-- 1. Hazards Table (e.g., Earthquake, Flood)
create table public.hazards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text, -- For the card visual
  slug text unique, -- For friendly URLs e.g. /learn/earthquake
  created_at timestamp with time zone default now()
);

-- 2. Modules Table (Attached to a Hazard)
-- From Flowchart: "Video", "Key Safety Points"
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  hazard_id uuid references public.hazards(id) on delete cascade,
  title text not null,
  video_url text, -- URL to YouTube/Vimeo
  content_markdown text, -- "Key Safety Points" in text format
  difficulty text default 'basic',
  order_index int default 0 -- To order them 1, 2, 3...
);

-- 3. Quizzes Table (One per module or standalone)
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade,
  title text not null
);

-- 4. Questions Table
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["Option A", "Option B"]
  correct_index int not null, -- 0, 1, 2...
  explanation text -- Shown after answering
);

-- 5. Quiz Attempts (Tracking User Progress)
-- From Flowchart: "Module Progress", "Congratulations"
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  score int not null,
  passed boolean default false,
  completed_at timestamp with time zone default now()
);

-- 6. RLS Policies
alter table public.hazards enable row level security;
alter table public.modules enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- Public Read Policies (Education is open)
create policy "Public can read hazards" on public.hazards for select using (true);
create policy "Public can read modules" on public.modules for select using (true);
create policy "Public can read quizzes" on public.quizzes for select using (true);
create policy "Public can read questions" on public.questions for select using (true);

-- Admin Write Policies (Only Admins can create content)
-- Using a helper function for clarity in future (or direct check)
-- create policy "Admins can insert hazards" on public.hazards for insert using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
-- For simplicity in Phase 2, we leave write policies restricted or assume Admin use Service Role.

-- User Progress Policies
create policy "Users can read own attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);
