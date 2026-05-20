-- Adiciona colunas de geocodificação à tabela liderancas
ALTER TABLE liderancas
  ADD COLUMN IF NOT EXISTS lat  double precision,
  ADD COLUMN IF NOT EXISTS lng  double precision;
