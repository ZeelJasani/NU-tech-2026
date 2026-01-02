-- Migration: 006_analytics_views.sql
-- Description: Database Views for Leaderboards and User Statistics.

-- 1. Leaderboard View (Peer Comparison)
-- Ranks users based on their preparedness score.
drop view if exists public.view_leaderboard;
create or replace view public.view_leaderboard as
select
  id as user_id,
  full_name,
  avatar_url,
  region,
  preparedness_score,
  rank() over (order by preparedness_score desc) as rank_position
from public.profiles
where role not in ('admin', 'trainer') -- Exclude admins from leaderboard
limit 100;

-- 2. User Stats View (Dashboard Summary)
-- Aggregates total modules completed and average quiz score for the current user.
-- access this via: select * from view_user_stats where user_id = auth.uid()
drop view if exists public.view_user_stats;
create or replace view public.view_user_stats as
select
  p.id as user_id,
  count(distinct mp.module_id) filter (where mp.video_watched and mp.content_read) as modules_completed,
  coalesce(avg(qa.score), 0) as average_quiz_score,
  count(distinct qa.id) as quizzes_taken
from public.profiles p
left join public.module_progress mp on p.id = mp.user_id
left join public.quiz_attempts qa on p.id = qa.user_id
group by p.id;

-- 3. Security (Grant access)
grant select on public.view_leaderboard to authenticated;
grant select on public.view_user_stats to authenticated;
