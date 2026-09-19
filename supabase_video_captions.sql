-- Writnexa video caption storage
-- Run this in the Supabase SQL Editor before testing production captions.

insert into storage.buckets (id, name, public)
values ('video-captions', 'video-captions', false)
on conflict (id) do update
set public = false;

drop policy if exists "Users can upload their caption videos" on storage.objects;
create policy "Users can upload their caption videos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'video-captions'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can view their caption videos" on storage.objects;
create policy "Users can view their caption videos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'video-captions'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can update their caption videos" on storage.objects;
create policy "Users can update their caption videos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'video-captions'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'video-captions'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can delete their caption videos" on storage.objects;
create policy "Users can delete their caption videos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'video-captions'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
