-- Drop OS v2 — auth members, invite codes, storage, auth-gated sync
-- Run after schema.sql on project vorg-eavy-drop-os

-- Squad membership (replaces shared pin for sync)
create table if not exists public.drop_members (
  drop_slug text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  joined_at timestamptz not null default now(),
  primary key (drop_slug, user_id)
);

create index if not exists drop_members_user_idx on public.drop_members (user_id);

-- One-time invite codes for squad onboarding
create table if not exists public.drop_invites (
  code text primary key,
  drop_slug text not null,
  role text not null default 'editor',
  max_uses int not null default 12,
  uses int not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.drop_states
  add column if not exists auth_only boolean not null default false;

-- Storage bucket for SKU reference photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'drop-sku-images',
  'drop-sku-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.is_drop_member(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.drop_members
    where drop_slug = p_slug and user_id = auth.uid()
  );
$$;

create or replace function public.redeem_drop_invite(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.drop_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'sign in required';
  end if;

  select * into inv
  from public.drop_invites
  where code = p_code
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_invite');
  end if;

  if inv.expires_at is not null and inv.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'invite_expired');
  end if;

  if inv.uses >= inv.max_uses then
    return jsonb_build_object('ok', false, 'error', 'invite_exhausted');
  end if;

  insert into public.drop_members (drop_slug, user_id, role)
  values (inv.drop_slug, auth.uid(), inv.role)
  on conflict (drop_slug, user_id) do update set role = excluded.role;

  update public.drop_invites set uses = uses + 1 where code = p_code;

  return jsonb_build_object('ok', true, 'drop_slug', inv.drop_slug, 'role', inv.role);
end;
$$;

create or replace function public.fetch_drop_state_auth(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.drop_states%rowtype;
begin
  if auth.uid() is null or not public.is_drop_member(p_slug) then
    return jsonb_build_object('found', false, 'error', 'not_authorized');
  end if;

  select * into row from public.drop_states where drop_slug = p_slug;
  if not found then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'state', row.state,
    'revision', row.revision,
    'updated_at', row.updated_at
  );
end;
$$;

create or replace function public.save_drop_state_auth(
  p_slug text,
  p_state jsonb,
  p_revision bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.drop_states%rowtype;
  next_revision bigint;
begin
  if auth.uid() is null or not public.is_drop_member(p_slug) then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;

  select * into row
  from public.drop_states
  where drop_slug = p_slug
  for update;

  if not found then
    insert into public.drop_states (drop_slug, sync_pin, state, revision, auth_only)
    values (p_slug, 'auth-only', p_state, 1, true)
    returning revision into next_revision;
    return jsonb_build_object('ok', true, 'revision', next_revision, 'conflict', false);
  end if;

  if p_revision > 0 and row.revision <> p_revision then
    return jsonb_build_object(
      'ok', false,
      'conflict', true,
      'revision', row.revision,
      'updated_at', row.updated_at,
      'state', row.state
    );
  end if;

  next_revision := row.revision + 1;
  update public.drop_states
  set state = p_state, revision = next_revision, updated_at = now(), auth_only = true
  where drop_slug = p_slug;

  return jsonb_build_object('ok', true, 'revision', next_revision, 'conflict', false);
end;
$$;

-- Storage policies: members upload to their drop folder
create policy "drop_sku_images_public_read"
on storage.objects for select
to public
using (bucket_id = 'drop-sku-images');

create policy "drop_sku_images_member_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'drop-sku-images'
  and public.is_drop_member((storage.foldername(name))[1])
);

create policy "drop_sku_images_member_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'drop-sku-images'
  and public.is_drop_member((storage.foldername(name))[1])
);

create policy "drop_sku_images_member_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'drop-sku-images'
  and public.is_drop_member((storage.foldername(name))[1])
);

revoke all on table public.drop_members from anon, authenticated;
revoke all on table public.drop_invites from anon, authenticated;
grant execute on function public.is_drop_member(text) to authenticated;
grant execute on function public.redeem_drop_invite(text) to authenticated;
grant execute on function public.fetch_drop_state_auth(text) to authenticated;
grant execute on function public.save_drop_state_auth(text, jsonb, bigint) to authenticated;

-- Seed Drop 001 invite (rotate in production)
insert into public.drop_invites (code, drop_slug, role, max_uses)
values ('ve-invite-drop001-2026', 'drop-001', 'editor', 24)
on conflict (code) do nothing;

update public.drop_states set auth_only = true where drop_slug = 'drop-001';
