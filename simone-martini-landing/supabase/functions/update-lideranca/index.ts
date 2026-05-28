import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const SITUACAO_VALIDAS = ["Fechado com Simone", "Em conversa", "Entrar em contato"]
const CAMPOS_EDITAVEIS = ["nome", "telefone", "descricao", "cidade", "rua", "numero", "situacao"] as const

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response(
        JSON.stringify({ error: "Acesso negado: Autorização ausente." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    const decoded = atob(authHeader.split(" ")[1])
    const colonIdx = decoded.indexOf(":")
    const credencial = decoded.substring(0, colonIdx)
    const senha = decoded.substring(colonIdx + 1)

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    let isAdmin = false
    let responsavelNome: string | null = null

    if (credencial === "EquipeSIM" && senha === "SIM2026!@!@") {
      isAdmin = true
    } else {
      const { data: resp } = await supabaseClient
        .from("responsaveis")
        .select("nome")
        .eq("email", credencial.toLowerCase().trim())
        .eq("senha", senha)
        .maybeSingle()

      if (!resp) {
        return new Response(
          JSON.stringify({ error: "Acesso negado: Credenciais inválidas." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        )
      }
      responsavelNome = resp.nome
    }

    const body = await req.json()
    const { id, nome, telefone, descricao, situacao, cidade, rua, numero } = body

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID é obrigatório." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Busca o registro atual para validar permissão e capturar valores anteriores
    const { data: atual } = await supabaseClient
      .from("liderancas")
      .select("responsavel, nome, telefone, descricao, cidade, rua, numero, situacao, log_edit")
      .eq("id", id)
      .maybeSingle()

    if (!atual) {
      return new Response(
        JSON.stringify({ error: "Registro não encontrado." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      )
    }

    if (!isAdmin && responsavelNome && atual.responsavel !== responsavelNome) {
      return new Response(
        JSON.stringify({ error: "Sem permissão para editar este registro." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      )
    }

    const incoming: Record<string, string | undefined> = { nome, telefone, descricao, cidade, rua, numero, situacao }

    const updateData: Record<string, string> = {}
    if (nome !== undefined && nome.trim()) updateData.nome = nome.trim()
    if (telefone !== undefined && telefone.trim()) updateData.telefone = telefone.trim()
    if (descricao !== undefined && descricao.trim()) updateData.descricao = descricao.trim()
    if (cidade !== undefined && cidade.trim()) updateData.cidade = cidade.trim()
    if (rua !== undefined && rua.trim()) updateData.rua = rua.trim()
    if (numero !== undefined && numero.trim()) updateData.numero = numero.trim()
    if (situacao !== undefined) {
      if (!SITUACAO_VALIDAS.includes(situacao)) {
        return new Response(
          JSON.stringify({ error: "Situação inválida." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        )
      }
      updateData.situacao = situacao
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum campo para atualizar." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    // Monta o log apenas com os campos que realmente mudaram
    const alteracoes: Record<string, { de: string | null; para: string }> = {}
    for (const campo of CAMPOS_EDITAVEIS) {
      const novoValor = incoming[campo]
      if (novoValor !== undefined) {
        const valorTrimado = novoValor.trim?.() ?? novoValor
        if (valorTrimado && valorTrimado !== (atual[campo] ?? "")) {
          alteracoes[campo] = { de: atual[campo] ?? null, para: valorTrimado }
        }
      }
    }

    if (Object.keys(alteracoes).length > 0) {
      const entradaLog = {
        data: new Date().toISOString(),
        editado_por: isAdmin ? "Admin (EquipeSIM)" : responsavelNome,
        alteracoes,
      }
      updateData.log_edit = JSON.stringify([...(atual.log_edit ?? []), entradaLog]) as unknown as string
    }

    const { data, error } = await supabaseClient
      .from("liderancas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
