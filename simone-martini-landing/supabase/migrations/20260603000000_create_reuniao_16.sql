CREATE TABLE IF NOT EXISTS public.reuniao_16 (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  telefone text NOT NULL,
  email text NOT NULL,
  confirmado boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.reuniao_16 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON public.reuniao_16
  USING (true)
  WITH CHECK (true);
