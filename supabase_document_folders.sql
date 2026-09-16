create table if not exists public.document_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.document_folders enable row level security;

drop policy if exists "Users can view their own document folders" on public.document_folders;
create policy "Users can view their own document folders"
on public.document_folders
for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own document folders" on public.document_folders;
create policy "Users can create their own document folders"
on public.document_folders
for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own document folders" on public.document_folders;
create policy "Users can update their own document folders"
on public.document_folders
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own document folders" on public.document_folders;
create policy "Users can delete their own document folders"
on public.document_folders
for delete
using ((select auth.uid()) = user_id);

create index if not exists document_folders_user_id_created_at_idx
on public.document_folders(user_id, created_at desc);

create or replace function public.set_document_folders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists document_folders_updated_at on public.document_folders;

create trigger document_folders_updated_at
before update on public.document_folders
for each row
execute function public.set_document_folders_updated_at();

alter table public.documents
add column if not exists folder_id uuid
references public.document_folders(id)
on delete set null;

create index if not exists documents_folder_id_idx
on public.documents(folder_id);
