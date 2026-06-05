import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
}

const TOTAL_VAGAS = 200
const AUTH_USER = 'EquipeSIM'
const AUTH_PASS = 'lideres30!'

function checkAuth(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) return false
  const [user, pass] = atob(authHeader.split(' ')[1]).split(':')
  return user === AUTH_USER && pass === AUTH_PASS
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const url = new URL(req.url)

  try {
    // GET → contagem pública
    if (req.method === 'GET' && url.searchParams.get('action') !== 'lista') {
      const { count, error } = await supabase
        .from('reuniao_16')
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      const inscritos = count ?? 0
      const percentual = Math.min(Math.round((inscritos / TOTAL_VAGAS) * 100), 100)

      return new Response(
        JSON.stringify({ inscritos, total: TOTAL_VAGAS, percentual }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // POST → inscrição
    if (req.method === 'POST') {
      const { nome, telefone, email } = await req.json()

      if (!nome || !telefone || !email) {
        return new Response(
          JSON.stringify({ error: 'Nome, telefone e e-mail são obrigatórios.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const { count: currentCount } = await supabase
        .from('reuniao_16')
        .select('*', { count: 'exact', head: true })

      if ((currentCount ?? 0) >= TOTAL_VAGAS) {
        return new Response(
          JSON.stringify({ error: 'Todas as vagas já foram preenchidas.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      const { data, error } = await supabase
        .from('reuniao_16')
        .insert([{ nome, telefone, email }])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // GET ?action=lista → lista protegida
    if (req.method === 'GET' && url.searchParams.get('action') === 'lista') {
      if (!checkAuth(req)) {
        return new Response(
          JSON.stringify({ error: 'Acesso negado.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const { data, error } = await supabase
        .from('reuniao_16')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // PATCH → atualizar confirmado (protegido)
    if (req.method === 'PATCH') {
      if (!checkAuth(req)) {
        return new Response(
          JSON.stringify({ error: 'Acesso negado.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const { id, confirmado } = await req.json()

      if (!id || confirmado === undefined) {
        return new Response(
          JSON.stringify({ error: 'ID e confirmado são obrigatórios.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const { data, error } = await supabase
        .from('reuniao_16')
        .update({ confirmado })
        .eq('id', id)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
