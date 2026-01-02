create table public.drills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  scheduled_at timestamp with time zone not null,
  status text check (status in ('scheduled', 'pending', 'completed')) default 'scheduled',
  hazard_id uuid references public.hazards(id),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.drills enable row level security;

-- Admin and trainers can manage drills
create policy "Admins and trainers can manage drills"
  on public.drills
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'trainer')
    )
  );

-- All authenticated users can read drills
create policy "Users can view drills"
  on public.drills
  for select
  to authenticated
  using (true);
