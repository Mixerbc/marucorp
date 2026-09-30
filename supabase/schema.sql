-- MARU CORP — Blog / Insights en Supabase
-- Pegar completo en Supabase → SQL Editor → Run. Se puede ejecutar varias veces.

-- 1) Tabla de blogs ---------------------------------------------------------
create table if not exists public.blogs (
  id              text primary key default replace(gen_random_uuid()::text, '-', ''),
  slug            text not null unique,
  title           text not null,
  category        text not null,
  lead_text       text not null default '',
  excerpt         text not null default '',
  reading_minutes integer not null default 5 check (reading_minutes between 1 and 60),
  status          text not null default 'draft' check (status in ('draft', 'published')),
  cover_image     text not null default '',
  sections        jsonb not null default '[]'::jsonb,
  position        integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists blogs_position_idx on public.blogs (position, created_at desc);

-- 2) Administradores (correos con permiso de editar) ------------------------
-- Sin políticas: nadie puede leer ni modificar esta tabla desde el sitio.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 3) Seguridad de la tabla de blogs -----------------------------------------
alter table public.blogs enable row level security;

drop policy if exists "blogs publicos o admin" on public.blogs;
create policy "blogs publicos o admin" on public.blogs
  for select using (status = 'published' or public.is_admin());

drop policy if exists "blogs admin insert" on public.blogs;
create policy "blogs admin insert" on public.blogs
  for insert to authenticated with check (public.is_admin());

drop policy if exists "blogs admin update" on public.blogs;
create policy "blogs admin update" on public.blogs
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blogs admin delete" on public.blogs;
create policy "blogs admin delete" on public.blogs
  for delete to authenticated using (public.is_admin());

-- 4) Reordenar: recibe los ids en el orden deseado --------------------------
create or replace function public.reorder_blogs(ids text[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;
  update public.blogs b
     set position = t.ord - 1
    from unnest(ids) with ordinality as t(id, ord)
   where b.id = t.id;
end;
$$;

revoke execute on function public.reorder_blogs(text[]) from anon;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.reorder_blogs(text[]) to authenticated;

-- 5) Imágenes de portada (Storage) ------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-covers', 'blog-covers', true, 3145728,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portadas admin insert" on storage.objects;
create policy "portadas admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog-covers' and public.is_admin());

drop policy if exists "portadas admin update" on storage.objects;
create policy "portadas admin update" on storage.objects
  for update to authenticated using (bucket_id = 'blog-covers' and public.is_admin());

drop policy if exists "portadas admin delete" on storage.objects;
create policy "portadas admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-covers' and public.is_admin());

-- 6) Dar permiso al correo del cliente (cambiar por el correo real) ---------
-- insert into public.admins (email) values ('contacto@marucorp.mx') on conflict do nothing;
