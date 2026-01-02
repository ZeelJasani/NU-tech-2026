-- Seed: 01_initial_content.sql
-- Run this in Supabase SQL Editor to populate basic data.
-- RETRY SAFE: This script checks for existing data before inserting to avoid errors.

-- 1. Insert Hazards (Idempotent)
insert into public.hazards (title, description, slug)
values 
('Earthquake', 'Sudden ground shaking caused by movement of tectonic plates.', 'earthquake'),
('Flood', 'Overflow of water onto normally dry land.', 'flood'),
('Fire', 'Uncontrolled fire in building or wild.', 'fire')
on conflict (slug) do nothing;

-- 2. Insert a Module for Earthquake
do $$
declare
  eq_id uuid;
  mod_exists boolean;
begin
  select id into eq_id from public.hazards where slug = 'earthquake';
  
  -- Check if module exists to practice idempotency (modules table usually has no unique slug, verifying by title)
  select exists(select 1 from public.modules where title = 'Earthquake Basics: Drop, Cover, Hold' and hazard_id = eq_id)
  into mod_exists;

  if eq_id is not null and not mod_exists then
    insert into public.modules (hazard_id, title, content_markdown, difficulty)
    values (eq_id, 'Earthquake Basics: Drop, Cover, Hold', 
    '# Drop, Cover, and Hold On
    1. **DROP** to your hands and knees.
    2. **COVER** your head and neck with your arms.
    3. **HOLD ON** until the shaking stops.',
    'basic');
  end if;
end $$;


-- 3. Insert Sample AI Embeddings (Simulated)
do $$
declare
  mod_id uuid;
begin
  select id into mod_id from public.modules where title like '%Earthquake Basics%' limit 1;

  -- Only insert if embeddings don't exist for this module to avoid duplicates on re-run
  if mod_id is not null and not exists (select 1 from public.module_embeddings where module_id = mod_id) then
    insert into public.module_embeddings (module_id, content_chunk, metadata)
    values 
    (mod_id, 'During an earthquake, drop to your hands and knees. This position prevents you from being knocked down.', '{"section": "safety_points"}'),
    (mod_id, 'Cover your head and neck with your arms. If a sturdy table or desk is nearby, crawl underneath it for shelter.', '{"section": "safety_points"}');
  end if;
end $$;

-- 4. Sample Progress & Notes (Requires at least one signed-up user)
do $$
declare
  test_user_id uuid;
  mod_id uuid;
begin
  -- Try to pick the first user found (must sign up in frontend first!)
  select id into test_user_id from auth.users limit 1;
  select id into mod_id from public.modules where title like '%Earthquake Basics%' limit 1;

  -- Only proceed if we have a user and the module
  if test_user_id is not null and mod_id is not null then
    
    -- Insert Sample Note (Idempotent check)
    if not exists (select 1 from public.user_notes where user_id = test_user_id and title = 'My Earthquake Plan') then
        insert into public.user_notes (user_id, title, content)
        values (test_user_id, 'My Earthquake Plan', 'Remember to check the emergency kit under the stairs.');
    end if;

    -- Insert Sample Progress (Idempotent via ON CONFLICT)
    insert into public.module_progress (user_id, module_id, video_watched, content_read)
    values (test_user_id, mod_id, true, true)
    on conflict (user_id, module_id) do nothing;
    
    -- Insert Sample SOS
    if not exists (select 1 from public.sos_signals where user_id = test_user_id) then
        insert into public.sos_signals (user_id, location, status)
        values (test_user_id, '{"lat": 35.6, "lng": 139.6}', 'resolved');
    end if;

  end if;
end $$;
