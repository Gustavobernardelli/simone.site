create table public.liderancas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  telefone text not null,
  endereco text not null,
  descricao text not null,
  potencial_influencia text not null,
  situacao text not null,
  responsavel text,
  imagem_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.liderancas enable row level security;
