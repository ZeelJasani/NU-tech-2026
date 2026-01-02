-- Migration: 005_ai_chatbot.sql
-- Description: Sets up the AI Chatbot backend using pgvector for RAG (Retrieval Augmented Generation).

-- 1. Enable pgvector extension
-- Note: This requires the Supabase project to support pgvector (enabled by default on new projects).
create extension if not exists vector;

-- 2. Chat Messages Table (History)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- 3. Module Embeddings Table (Knowledge Base)
-- Stores chunks of text from modules and their vector representations.
create table if not exists public.module_embeddings (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade,
  content_chunk text not null, -- The actual text segment
  embedding vector(1536), -- 1536 dimensions for OpenAI text-embedding-ada-002
  metadata jsonb -- Extra info like page number, section title
);

-- 4. Similarity Search Function
-- Used by the backend/client to find relevant content for the chatbot.
create or replace function match_module_content (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content_chunk text,
  similarity float
)
language plpgsql
stable
as $$
begin
  return query
  select
    module_embeddings.id,
    module_embeddings.content_chunk,
    1 - (module_embeddings.embedding <=> query_embedding) as similarity
  from module_embeddings
  where 1 - (module_embeddings.embedding <=> query_embedding) > match_threshold
  order by module_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. RLS Policies

-- Chat Messages
alter table public.chat_messages enable row level security;

create policy "Users can manage own chat history"
on public.chat_messages for all
using (auth.uid() = user_id);

-- Module Embeddings
alter table public.module_embeddings enable row level security;

-- Public/Users can READ embeddings (if doing client-side search, though usually done server-side)
-- For security, usually only the 'service_role' key deals with embeddings, but for a simple demo:
create policy "Authenticated users can search embeddings"
on public.module_embeddings for select
to authenticated
using (true);

-- Only admins/service_role can INSERT embeddings
