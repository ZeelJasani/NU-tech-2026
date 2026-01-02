-- Migration: 005_analytics_views.sql
-- Description: Analytics and Aggregations for "Peer Comparison" and Dashboard stats.

-- 1. Leaderboard View
-- "Peer Comparison" in Quick Actions
-- Shows top 10 users by preparedness score in the same region, or globally.
create or replace view public.view_leaderboard as
select 
  id as user_id,
  full_name,
  avatar_url,
  region,
  preparedness_score,
  rank() over (partition by region order by preparedness_score desc) as regional_rank,
  rank() over (order by preparedness_score desc) as global_rank
from public.profiles
where role = 'citizen'; -- Only compare regular users

-- 2. Grant Access to View
grant select on public.view_leaderboard to authenticated;
-- (RLS on Views is tricky in Postgres < 15 without security_invoker. 
-- For now, authenticated users can see the leaderboard. Ideally, filter sensitive columns.)

-- 3. (Optional) Safety Score Calculation Function
-- "User overall score bar"
-- This could be a computed column or a function that aggregates quiz scores.
-- For now, we rely on 'preparedness_score' in profiles being updated by quiz triggers or app logic.
