-- Apply once to the intended Supabase project. Fails if listings already exists.
begin;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  relations text[] not null,
  primary_relation text not null,
  bottom_lines text[] not null default '{}',
  city text not null,
  public_note text,
  contact_type text not null check (contact_type in ('wechat', 'phone', 'email')),
  contact text not null,
  is_adult boolean not null check (is_adult is true),
  consent boolean not null check (consent is true),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'matched', 'declined', 'deleted')),
  matched_with uuid,
  admin_note text
);

alter table public.listings enable row level security;

-- Supabase projects can inherit table grants from default privileges.
revoke all on table public.listings from public, anon, authenticated, service_role;
grant insert (
  relations, primary_relation, bottom_lines, city, public_note,
  contact_type, contact, is_adult, consent
) on public.listings to anon;

create policy listings_anon_insert on public.listings
  for insert to anon
  with check (
    is_adult is true
    and consent is true
    and status = 'new'
    and matched_with is null
    and admin_note is null
    and array_ndims(relations) = 1
    and array_lower(relations, 1) = 1
    and cardinality(relations) between 1 and 3
    and array_to_string(relations, ',', '!') ~ '^A[0-9]{2}-[0-9]{3}(,A[0-9]{2}-[0-9]{3}){0,2}$'
    and primary_relation = any(relations)
    and cardinality(bottom_lines) <= 2
    and (
      cardinality(bottom_lines) = 0
      or (
        array_ndims(bottom_lines) = 1
        and array_lower(bottom_lines, 1) = 1
        and coalesce(char_length(btrim(bottom_lines[1])) >= 1
                     and char_length(bottom_lines[1]) <= 60, false)
        and (
          cardinality(bottom_lines) = 1
          or coalesce(char_length(btrim(bottom_lines[2])) >= 1
                      and char_length(bottom_lines[2]) <= 60, false)
        )
      )
    )
    and char_length(btrim(city)) >= 1 and char_length(city) <= 30
    and (public_note is null or char_length(public_note) <= 80)
    and contact_type in ('wechat', 'phone', 'email')
    and char_length(btrim(contact)) >= 1 and char_length(contact) <= 100
  );

notify pgrst, 'reload schema';
commit;
