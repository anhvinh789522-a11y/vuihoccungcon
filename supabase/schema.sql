-- Đám mây chung cho web Vui Học Cùng Bảo Nhi.
-- Chạy 1 lần trong Supabase → SQL Editor → New query → Run.
create table if not exists family_state (
  code text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table family_state enable row level security;

-- Cho phép app (anon key) đọc/ghi theo Mã gia đình.
-- Mã càng dài càng khó đoán; đừng chia sẻ cho người ngoài.
drop policy if exists "anon all" on family_state;
create policy "anon all" on family_state
  for all to anon using (true) with check (true);
