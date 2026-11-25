-- ============================================================================
-- SEGURANÇA & ESTRUTURA DO PAINEL /gestao — FABRÍCIO MAGIOLI IMÓVEIS
-- Execute este script no SQL Editor do Supabase Dashboard.
-- ============================================================================

-- 1. TABELA DE ADMINISTRADORES AUTORIZADOS
-- Somente usuários listados aqui têm permissão de escrita no site.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admin pode verificar proprio registro" on public.admin_users;
create policy "Admin pode verificar proprio registro"
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 2. FUNÇÃO SEGURA DE VERIFICAÇÃO DE ADMIN
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- OPCIONAL (RECOMENDADO APÓS ATIVAR O 2FA NO PAINEL /gestao):
-- Depois de escanear o QR Code do Google Authenticator no painel /gestao,
-- você pode rodar o bloco abaixo para exigir 2FA (aal2) diretamente no banco:
--
-- create or replace function public.is_admin()
-- returns boolean
-- language sql
-- security definer
-- set search_path = public
-- stable
-- as $$
--   select exists (
--     select 1 from public.admin_users where user_id = auth.uid()
--   )
--   and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
-- $$;

-- 3. CADASTRE SEU USUÁRIO ADMINISTRADOR AQUI
-- Passo: Authentication -> Users -> Add user -> copie o UUID e descomente a linha abaixo:
-- insert into public.admin_users (user_id) values ('COLE-AQUI-O-UUID-DO-ADMIN') on conflict do nothing;

-- ============================================================================
-- 4. TABELA DE OPÇÕES DINÂMICAS (TIPOS, CATEGORIAS, ZONAS E BAIRROS)
-- ============================================================================
create table if not exists public.property_options (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('type', 'category', 'zone', 'location')),
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (group_name, label)
);

alter table public.property_options enable row level security;

drop policy if exists "Leitura publica de opcoes" on public.property_options;
create policy "Leitura publica de opcoes"
  on public.property_options
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Somente admin insere opcoes" on public.property_options;
create policy "Somente admin insere opcoes"
  on public.property_options
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Somente admin atualiza opcoes" on public.property_options;
create policy "Somente admin atualiza opcoes"
  on public.property_options
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Somente admin exclui opcoes" on public.property_options;
create policy "Somente admin exclui opcoes"
  on public.property_options
  for delete
  to authenticated
  using (public.is_admin());

-- Seed inicial com todas as opções padrão do site
insert into public.property_options (group_name, label, sort_order) values
  -- Tipos de negociação
  ('type', 'Comprar', 1),
  ('type', 'Alugar', 2),
  ('type', 'Vender', 3),
  -- Categorias de imóvel
  ('category', 'Apartamento', 1),
  ('category', 'Casa', 2),
  ('category', 'Cobertura', 3),
  ('category', 'Terreno', 4),
  -- Zonas
  ('zone', 'Zona Oeste', 1),
  ('zone', 'Zona Norte', 2),
  ('zone', 'Zona Sudoeste', 3),
  ('zone', 'Zona Sul', 4),
  ('zone', 'Porto Maravilha', 5),
  ('zone', 'Centro', 6),
  ('zone', 'Niterói', 7),
  -- Bairros
  ('location', 'Bangu', 1),
  ('location', 'Barra da Tijuca', 2),
  ('location', 'Barra Olímpica', 3),
  ('location', 'Cachambi', 4),
  ('location', 'Campo Grande', 5),
  ('location', 'Centro', 6),
  ('location', 'Irajá', 7),
  ('location', 'Niterói', 8),
  ('location', 'Olaria', 9),
  ('location', 'Recreio dos Bandeirantes', 10),
  ('location', 'Rio Comprido', 11),
  ('location', 'Santa Cruz', 12),
  ('location', 'Santo Cristo', 13),
  ('location', 'São Cristóvão', 14),
  ('location', 'Taquara', 15)
on conflict (group_name, label) do nothing;

-- ============================================================================
-- 5. COLUNA PUBLISHED (RASCUNHOS) & RLS NA TABELA PROPERTIES
-- ============================================================================
alter table public.properties
  add column if not exists published boolean not null default true;

alter table public.properties enable row level security;

drop policy if exists "Leitura publica de imoveis" on public.properties;
create policy "Leitura publica de imoveis"
  on public.properties
  for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "Somente admin insere imoveis" on public.properties;
create policy "Somente admin insere imoveis"
  on public.properties
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Somente admin atualiza imoveis" on public.properties;
create policy "Somente admin atualiza imoveis"
  on public.properties
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Somente admin exclui imoveis" on public.properties;
create policy "Somente admin exclui imoveis"
  on public.properties
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 6. RLS & VALIDAÇÃO NO SERVIDOR EM LEADS E NEWSLETTER (PROTEÇÃO LGPD + ANTIABUSO)
-- ============================================================================
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_name_length_chk'
  ) then
    alter table public.leads
      add constraint leads_name_length_chk
      check (char_length(trim(name)) between 3 and 120) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_contact_length_chk'
  ) then
    alter table public.leads
      add constraint leads_contact_length_chk
      check (char_length(trim(contact)) between 10 and 160) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_message_length_chk'
  ) then
    alter table public.leads
      add constraint leads_message_length_chk
      check (message is null or char_length(message) <= 4000) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'newsletter_email_format_chk'
  ) then
    alter table public.newsletter
      add constraint newsletter_email_format_chk
      check (
        char_length(trim(email)) <= 254
        and trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
      ) not valid;
  end if;
end $$;

alter table public.leads enable row level security;

drop policy if exists "Visitante envia lead" on public.leads;
create policy "Visitante envia lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 3 and 120
    and char_length(trim(contact)) between 10 and 160
  );

drop policy if exists "Somente admin le leads" on public.leads;
create policy "Somente admin le leads"
  on public.leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Somente admin exclui leads" on public.leads;
create policy "Somente admin exclui leads"
  on public.leads
  for delete
  to authenticated
  using (public.is_admin());

alter table public.newsletter enable row level security;

drop policy if exists "Visitante assina newsletter" on public.newsletter;
create policy "Visitante assina newsletter"
  on public.newsletter
  for insert
  to anon, authenticated
  with check (
    char_length(trim(email)) <= 254
    and trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

drop policy if exists "Somente admin le newsletter" on public.newsletter;
create policy "Somente admin le newsletter"
  on public.newsletter
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Somente admin exclui newsletter" on public.newsletter;
create policy "Somente admin exclui newsletter"
  on public.newsletter
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 7. STORAGE BUCKET SEGURO PARA FOTOS E VÍDEOS DOS IMÓVEIS
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media',
  'property-media',
  true,
  31457280, -- 30 MB max (para suportar vídeos curtos; fotos WebP ficam ~80-200 KB)
  array['image/webp', 'image/jpeg', 'image/png', 'video/mp4']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 31457280,
  allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png', 'video/mp4'];

drop policy if exists "Leitura publica property-media" on storage.objects;
create policy "Leitura publica property-media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'property-media');

drop policy if exists "Somente admin faz upload property-media" on storage.objects;
create policy "Somente admin faz upload property-media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'property-media' and public.is_admin());

drop policy if exists "Somente admin atualiza property-media" on storage.objects;
create policy "Somente admin atualiza property-media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'property-media' and public.is_admin())
  with check (bucket_id = 'property-media' and public.is_admin());

drop policy if exists "Somente admin remove property-media" on storage.objects;
create policy "Somente admin remove property-media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'property-media' and public.is_admin());
