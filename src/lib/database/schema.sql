
-- Tabela de perfis de usuário (extensão da auth.users do Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  role text default 'user',
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para atualizar o updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Tabela de localidades
create table public.localities (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  active boolean default true
);

-- Tabela de permissões de acesso às localidades
create table public.locality_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  locality_id uuid references public.localities(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, locality_id)
);

-- Tabela principal de dados vetoriais
create table public.vector_data (
  id uuid default gen_random_uuid() primary key,
  municipality text not null,
  locality_id uuid references public.localities(id) not null,
  cycle text not null,
  epidemiological_week text not null,
  work_modality text not null,
  start_date date not null,
  end_date date not null,
  total_properties integer not null,
  inspections integer not null,
  deposits_eliminated integer not null,
  deposits_treated integer not null,
  supervisor uuid references public.profiles(id) not null,
  qt_residencias integer not null default 0,
  qt_comercio integer not null default 0,
  qt_terreno_baldio integer not null default 0,
  qt_pe integer not null default 0,
  qt_outros integer not null default 0,
  qt_total integer not null default 0,
  tratamento_focal integer not null default 0,
  tratamento_perifocal integer not null default 0,
  amostras_coletadas integer not null default 0,
  recusa integer not null default 0,
  fechadas integer not null default 0,
  recuperadas integer not null default 0,
  a1 integer not null default 0,
  a2 integer not null default 0,
  b integer not null default 0,
  c integer not null default 0,
  d1 integer not null default 0,
  d2 integer not null default 0,
  e integer not null default 0,
  larvicida text,
  quantidade_larvicida integer not null default 0,
  quantidade_depositos_tratados integer not null default 0,
  adulticida text,
  quantidade_cargas integer not null default 0,
  total_tec_saude integer not null default 0,
  total_dias_trabalhados integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para atualizar o updated_at em vector_data
create trigger vector_data_updated_at
  before update on public.vector_data
  for each row
  execute procedure public.handle_updated_at();

-- Políticas de segurança (RLS)
alter table public.profiles enable row level security;
alter table public.localities enable row level security;
alter table public.locality_access enable row level security;
alter table public.vector_data enable row level security;

-- Política para profiles (usuários só podem ver/editar seu próprio perfil)
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Política para localities (todos podem ver localidades ativas)
create policy "Anyone can view active localities"
  on public.localities for select
  using (active = true);

-- Política para locality_access (usuários podem ver suas próprias permissões)
create policy "Users can view own locality access"
  on public.locality_access for select
  using (auth.uid() = user_id);

-- Política para vector_data (usuários podem ver dados das localidades que têm acesso)
create policy "Users can view vector data for authorized localities"
  on public.vector_data for select
  using (
    exists (
      select 1 from public.locality_access la
      where la.user_id = auth.uid()
      and la.locality_id = vector_data.locality_id
    )
    or
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy "Users can insert vector data for authorized localities"
  on public.vector_data for insert
  with check (
    exists (
      select 1 from public.locality_access la
      where la.user_id = auth.uid()
      and la.locality_id = vector_data.locality_id
    )
    or
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

