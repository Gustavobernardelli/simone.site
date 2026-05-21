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
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response(
        JSON.stringify({ error: "Acesso negado: Cabeçalho de autorização ausente ou inválido." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    const b64auth = authHeader.split(" ")[1]
    const [user, password] = atob(b64auth).split(":")

    if (user !== "EquipeSIM" || password !== "SIM2026!@!@") {
      return new Response(
        JSON.stringify({ error: "Acesso negado: Credenciais inválidas." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    const { id } = await req.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID do registro não informado." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { error } = await supabaseClient
      .from("liderancas")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir liderança:", error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
