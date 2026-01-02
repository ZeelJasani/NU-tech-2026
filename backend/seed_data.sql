-- Seed Data for Hazards (Topics) and Modules
-- Run this in your Supabase SQL Editor to populate the dashboard

-- 1. Insert Hazards (These appear as "Learning Modules" on the Dashboard)
INSERT INTO public.hazards (title, description, image_url, slug) VALUES 
('Earthquake Safety', 'Learn drop, cover, and hold techniques and evacuation plans.', 'earthquake', 'earthquake-safety'),
('Fire & Lab Safety', 'Fire evacuation protocols, extinguisher usage, and lab safety.', 'fire', 'fire-safety'),
('Flood Preparedness', 'Flood safety tips, emergency kits, and evacuation routes.', 'flood', 'flood-preparedness'),
('Medical Emergencies', 'Basic First Aid, CPR, and handling medical crises.', 'medical', 'medical-emergencies'),
('Cyber Security', 'Protecting personal data and identifying digital threats.', 'security', 'cyber-security'),
('Weather Storms', 'Safety measures for cyclones, hurricanes, and severe storms.', 'weather', 'weather-storms');

-- 2. Insert Modules (Specific Lessons for each Hazard) - Optional for Dashboard calc but good for completeness
-- We first need IDs, but for simple seeding we can assume UUIDs or just insert hazards first.
-- The app currently fetches 'hazards' for the dashboard cards.
