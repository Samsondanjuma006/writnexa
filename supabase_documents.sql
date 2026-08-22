create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled document',
  type text not null default 'Blog post',
  tone text not null default 'Professional',
  idea text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Users can view their own documents" on public.documents;
create policy "Users can view their own documents"
on public.documents
for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own documents" on public.documents;
create policy "Users can create their own documents"
on public.documents
for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own documents" on public.documents;
create policy "Users can update their own documents"
on public.documents
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own documents" on public.documents;
create policy "Users can delete their own documents"
on public.documents
for delete
using ((select auth.uid()) = user_id);

create index if not exists documents_user_id_updated_at_idx
on public.documents(user_id, updated_at desc);

create or replace function public.set_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;

create trigger documents_updated_at
before update on public.documents
for each row
execute function public.set_documents_updated_at();
