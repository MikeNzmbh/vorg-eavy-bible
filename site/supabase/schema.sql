-- VORG-EAVY Drop OS — shared drop state (run in Supabase SQL editor)
-- Pair with site/drop-os-config.js (never commit real pins to git)

create table if not exists public.drop_states (
  drop_slug text primary key,
  sync_pin text not null,
  state jsonb not null default '{}'::jsonb,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);

create index if not exists drop_states_updated_at_idx on public.drop_states (updated_at desc);

-- Pin-checked RPCs (security definer — pin never exposed via direct table reads)
create or replace function public.fetch_drop_state(p_slug text, p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.drop_states%rowtype;
begin
  select * into row
  from public.drop_states
  where drop_slug = p_slug and sync_pin = p_pin;

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

create or replace function public.save_drop_state(
  p_slug text,
  p_pin text,
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
  select * into row
  from public.drop_states
  where drop_slug = p_slug and sync_pin = p_pin
  for update;

  if not found then
    insert into public.drop_states (drop_slug, sync_pin, state, revision)
    values (p_slug, p_pin, p_state, 1)
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
  set state = p_state,
      revision = next_revision,
      updated_at = now()
  where drop_slug = p_slug and sync_pin = p_pin;

  return jsonb_build_object('ok', true, 'revision', next_revision, 'conflict', false);
end;
$$;

revoke all on table public.drop_states from anon, authenticated;
grant execute on function public.fetch_drop_state(text, text) to anon, authenticated;
grant execute on function public.save_drop_state(text, text, jsonb, bigint) to anon, authenticated;

-- Seed Drop 001 row (change pin before production)
-- insert into public.drop_states (drop_slug, sync_pin, state)
-- values ('drop-001', 'change-me-squad-pin', '{}'::jsonb)
-- on conflict (drop_slug) do nothing;
