-- 创建聊天会话表
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id), -- 如果需要用户系统
  title text not null default '新对话',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建聊天消息表 
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 添加RLS策略
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- 允许匿名访问
create policy "允许匿名访问聊天会话" on chat_sessions
  for all using (true);

create policy "允许匿名访问聊天消息" on chat_messages 
  for all using (true); 