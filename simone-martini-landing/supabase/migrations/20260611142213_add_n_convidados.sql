ALTER TABLE public.reuniao_16
  ADD COLUMN IF NOT EXISTS n_convidados integer NOT NULL DEFAULT 1;
