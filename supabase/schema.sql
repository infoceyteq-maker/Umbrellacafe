-- Cafe Umbrella admin data model
-- Run this once in Supabase Dashboard -> SQL Editor -> New query.
-- The policies below are intentionally open for the current demo admin.
-- Add Supabase Auth and tighten these policies before production use.

create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null default 0,
  image text,
  ingredients text[] not null default '{}',
  prep_time text not null default '15 Mins',
  description text not null default '',
  special boolean not null default false,
  spice_level smallint not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer text not null,
  contact text not null,
  email text,
  items jsonb not null default '[]'::jsonb,
  total numeric(10, 2) not null default 0,
  status text not null default 'Preparing',
  order_type text not null default 'Dine-in',
  payment text not null default 'Cash',
  order_date date not null default current_date,
  order_time text not null default '',
  table_ref text,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists order_type text not null default 'Dine-in';
alter table public.menu_items add column if not exists offer_price numeric(10, 2);

create table if not exists public.combo_flyers (
  id text primary key,
  title text not null,
  detail text not null default '',
  image text not null,
  price numeric(10, 2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.combo_flyers enable row level security;

drop policy if exists "public can read flyers" on public.combo_flyers;
drop policy if exists "public can insert flyers" on public.combo_flyers;
drop policy if exists "public can update flyers" on public.combo_flyers;
drop policy if exists "public can delete flyers" on public.combo_flyers;
create policy "public can read flyers" on public.combo_flyers for select to anon, authenticated using (true);
create policy "public can insert flyers" on public.combo_flyers for insert to anon, authenticated with check (true);
create policy "public can update flyers" on public.combo_flyers for update to anon, authenticated using (true) with check (true);
create policy "public can delete flyers" on public.combo_flyers for delete to anon, authenticated using (true);
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;

drop policy if exists "public can read menu" on public.menu_items;
drop policy if exists "public can insert menu" on public.menu_items;
drop policy if exists "public can update menu" on public.menu_items;
drop policy if exists "public can delete menu" on public.menu_items;
create policy "public can read menu" on public.menu_items for select to anon, authenticated using (true);
create policy "public can insert menu" on public.menu_items for insert to anon, authenticated with check (true);
create policy "public can update menu" on public.menu_items for update to anon, authenticated using (true) with check (true);
create policy "public can delete menu" on public.menu_items for delete to anon, authenticated using (true);

drop policy if exists "public can read orders" on public.orders;
drop policy if exists "public can insert orders" on public.orders;
drop policy if exists "public can update orders" on public.orders;
create policy "public can read orders" on public.orders for select to anon, authenticated using (true);
create policy "public can insert orders" on public.orders for insert to anon, authenticated with check (true);
create policy "public can update orders" on public.orders for update to anon, authenticated using (true) with check (true);

-- Optional first sync: the admin panel will continue to show its starter data
-- until you add an item or run an upsert from the panel.
