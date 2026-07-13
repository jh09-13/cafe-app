-- 이미 orders 테이블을 만드신 분들을 위한 추가 마이그레이션
-- Supabase 대시보드 → SQL Editor 에서 실행

alter table public.orders
  add column if not exists pickup_code_secret text not null default encode(gen_random_bytes(8), 'hex');
