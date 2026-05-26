create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '제목 없음',
  type text default '이미지',
  content text default '',
  image_path text not null,
  image_url text not null,
  image_paths jsonb not null default '[]'::jsonb,
  image_urls jsonb not null default '[]'::jsonb,
  cover_index integer not null default 0,
  pinned boolean not null default false,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

alter table public.gallery_items
add column if not exists image_paths jsonb not null default '[]'::jsonb;

alter table public.gallery_items
add column if not exists image_urls jsonb not null default '[]'::jsonb;

alter table public.gallery_items
add column if not exists cover_index integer not null default 0;

update public.gallery_items
set
  image_paths = case when image_paths = '[]'::jsonb then jsonb_build_array(image_path) else image_paths end,
  image_urls = case when image_urls = '[]'::jsonb then jsonb_build_array(image_url) else image_urls end
where image_path is not null and image_url is not null;

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read approved gallery items" on public.gallery_items;
create policy "Public can read approved gallery items"
on public.gallery_items
for select
to anon
using (status = 'approved');

drop policy if exists "Admin can read gallery items" on public.gallery_items;
create policy "Admin can read gallery items"
on public.gallery_items
for select
to authenticated
using (true);

drop policy if exists "Public can submit pending gallery items" on public.gallery_items;
drop policy if exists "Public can upload pending gallery images" on storage.objects;

drop policy if exists "Admin can insert gallery items" on public.gallery_items;
create policy "Admin can insert gallery items"
on public.gallery_items
for insert
to authenticated
with check (status = 'approved');

drop policy if exists "Admin can update gallery items" on public.gallery_items;
create policy "Admin can update gallery items"
on public.gallery_items
for update
to authenticated
using (true)
with check (status = 'approved');

drop policy if exists "Admin can delete gallery items" on public.gallery_items;
create policy "Admin can delete gallery items"
on public.gallery_items
for delete
to authenticated
using (true);

drop policy if exists "Public can view gallery images" on storage.objects;
create policy "Public can view gallery images"
on storage.objects
for select
to anon
using (bucket_id = 'gallery-images');

drop policy if exists "Admin can upload gallery images" on storage.objects;
create policy "Admin can upload gallery images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery-images'
  and (storage.foldername(name))[1] = 'approved'
);

drop policy if exists "Admin can update gallery images" on storage.objects;
create policy "Admin can update gallery images"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery-images')
with check (bucket_id = 'gallery-images');

drop policy if exists "Admin can delete gallery images" on storage.objects;
create policy "Admin can delete gallery images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery-images');
