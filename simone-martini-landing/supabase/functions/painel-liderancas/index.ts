import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { credencial, senha } = await req.json()

    if (!credencial || !senha) {
      return new Response(
        JSON.stringify({ error: "Credenciais obrigatórias." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Verifica credenciais admin
    if (credencial === "EquipeSIM" && senha === "SIM2026!@!@") {
      const { data, error } = await supabaseClient
        .from("liderancas")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, tipo: "admin", data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      )
    }

    // Verifica credenciais responsavel
    const { data: responsavel, error: respError } = await supabaseClient
      .from("responsaveis")
      .select("id, nome, email")
      .eq("email", credencial.toLowerCase().trim())
      .eq("senha", senha)
      .maybeSingle()

    if (respError || !responsavel) {
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    const { data: liderancas, error: lidError } = await supabaseClient
      .from("liderancas")
      .select("*")
      .eq("responsavel", responsavel.nome)
      .order("created_at", { ascending: false })

    if (lidError) throw lidError

    return new Response(
      JSON.stringify({ success: true, tipo: "responsavel", responsavel, data: liderancas }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
