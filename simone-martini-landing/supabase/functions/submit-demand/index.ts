import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Trata a requisição de preflight (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Cria o cliente do Supabase usando as variáveis de ambiente padrão da Edge Function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extrai os dados enviados pelo frontend
    const body = await req.json()
    const { fullName, whatsapp, city, demand, observations } = body

    // Validação básica
    if (!fullName || !whatsapp || !city) {
      return new Response(
        JSON.stringify({ error: 'Nome, WhatsApp e Cidade são obrigatórios.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Insere os dados na tabela supporters
    const { data, error } = await supabaseClient
      .from('supporters')
      .insert([
        { 
          full_name: fullName, 
          whatsapp: whatsapp, 
          city: city, 
          demand_text: demand || null,
          observations: observations || null
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao inserir no Supabase:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Demanda registrada com sucesso!', data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
