create table public.supporters (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  whatsapp text not null,
  city text not null,
  demand_text text,
  observations text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativa Segurança a Nível de Linha (Row Level Security)
alter table public.supporters enable row level security;

-- Cria uma política para permitir que qualquer pessoa insira dados (já que é um formulário público)
create policy "Enable insert for anonymous users" 
on public.supporters for insert 
with check (true);
