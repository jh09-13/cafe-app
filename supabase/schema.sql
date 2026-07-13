-- cafe-app: Supabase 스키마 (menus, orders)
-- Supabase 대시보드 → SQL Editor 에서 전체 실행

create extension if not exists pgcrypto;

-- ============================================
-- menus
-- ============================================
create table if not exists public.menus (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  price integer not null,
  description text default '',
  image text default '',
  created_at timestamptz default now()
);

alter table public.menus enable row level security;

create policy "menus_public_select" on public.menus for select to anon using (true);
create policy "menus_public_insert" on public.menus for insert to anon with check (true);
create policy "menus_public_update" on public.menus for update to anon using (true);
create policy "menus_public_delete" on public.menus for delete to anon using (true);

insert into public.menus (name, category, price, description, image) values
('에스프레소', 'coffee', 2500, '진한 원샷 에스프레소', ''),
('아메리카노', 'coffee', 3500, '물과 에스프레소의 조화', ''),
('카페라떼', 'coffee', 4200, '부드러운 우유와 에스프레소', ''),
('카푸치노', 'coffee', 4500, '우유 거품이 풍부한 카푸치노', ''),
('모카', 'coffee', 4800, '초콜릿과 커피의 만남', ''),
('바닐라 라떼', 'coffee', 4800, '바닐라 시럽이 들어간 라떼', ''),
('녹차', 'tea', 3200, '순수한 일본 녹차', ''),
('아이스티', 'tea', 3500, '상쾌한 레몬 아이스티', ''),
('캐모마일', 'tea', 3500, '천연 허브의 은은한 향', ''),
('말차 라떼', 'tea', 4500, 'Uji 말차와 우유의 조화', ''),
('크로아상', 'bakery', 2800, '바삭한 버터 크로아상', ''),
('번', 'bakery', 2500, '부드러운 밀크 번', ''),
('머핀', 'bakery', 3000, '블루베리 머핀', ''),
('쿠키', 'bakery', 2200, '초콜릿칩 쿠키', ''),
('티라미수', 'dessert', 5500, '전통 이탈리아 티라미수', ''),
('체리즈', 'dessert', 4800, '크리스피 바깥, 부드러운 속', ''),
('젤라토', 'dessert', 4200, '이탈리아산 아이스크림', ''),
('생크림 케이크', 'dessert', 5200, '스트로베리 생크림 케이크', '');

-- ============================================
-- orders
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  items jsonb not null,
  total integer not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz,
  pickup_code_secret text not null default encode(gen_random_bytes(8), 'hex')
);

alter table public.orders enable row level security;

create policy "orders_public_select" on public.orders for select to anon using (true);
create policy "orders_public_insert" on public.orders for insert to anon with check (true);
create policy "orders_public_update" on public.orders for update to anon using (true);

create index if not exists orders_session_id_idx on public.orders (session_id);
