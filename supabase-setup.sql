create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '제목 없음',
  type text default '이미지',
  content text default '',
  image_path text not null,
  image_url text not null,
  pinned boolean not null default false,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read approved gallery items" on public.gallery_items;
create policy "Public can read approved gallery items"
on public.gallery_items
for select
to anon
using (status = 'approved');

drop policy if exists "Public can submit pending gallery items" on public.gallery_items;
create policy "Public can submit pending gallery items"
on public.gallery_items
for insert
to anon
with check (status = 'pending');

drop policy if exists "Public can view gallery images" on storage.objects;
create policy "Public can view gallery images"
on storage.objects
for select
to anon
using (bucket_id = 'gallery-images');

drop policy if exists "Public can upload pending gallery images" on storage.objects;
create policy "Public can upload pending gallery images"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'gallery-images'
  and (storage.foldername(name))[1] = 'pending'
);
