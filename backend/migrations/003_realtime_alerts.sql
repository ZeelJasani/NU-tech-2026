-- Migration: 003_realtime_alerts.sql
-- Description: Sets up the Alert system and enables Realtime replication.

-- 1. Alerts Table
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text check (severity in ('info', 'warning', 'critical')),
  region text, -- e.g. "Mumbai", "All"
  active boolean default true,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- 2. Enable RLS
alter table public.alerts enable row level security;

-- 3. Policies
-- Public read (active only)
create policy "Public can read active alerts" 
on public.alerts for select 
using (active = true);

-- Admin write
create policy "Admins can manage alerts"
on public.alerts for all
using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- 4. Enable Supabase Realtime
-- This is the specific command to tell Supabase to broadcast changes to this table
alter publication supabase_realtime add table public.alerts;

-- End of Migration
