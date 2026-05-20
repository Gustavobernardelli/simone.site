import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const BUCKET = "Arquivos"
const FOLDER = "liderancas"

const POTENCIAL_VALIDOS = ["30-50", "50-80", "80-120", "120+"]
const SITUACAO_VALIDAS = [
  "Fechado com Simone",
  "Em conversa",
  "Entrar em contato",
]

async function geocodeEndereco(
  endereco: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = `${endereco.trim()}, Paraná, Brasil`
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status !== "OK" || !data.results?.length) return null
    const { lat, lng } = data.results[0].geometry.location
    return { lat, lng }
  } catch {
    return null
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const contentType = req.headers.get("content-type") ?? ""

    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Envie os dados como multipart/form-data." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const formData = await req.formData()

    const nome = (formData.get("nome") as string)?.trim()
    const telefone = (formData.get("telefone") as string)?.trim()
    const endereco = (formData.get("endereco") as string)?.trim()
    const descricao = (formData.get("descricao") as string)?.trim()
    const potencialInfluencia = (formData.get("potencialInfluencia") as string)?.trim()
    const situacao = (formData.get("situacao") as string)?.trim()
    const responsavel = ((formData.get("responsavel") as string) || "").trim() || null
    const imagem = formData.get("imagem")

    if (!nome || !telefone || !endereco || !descricao || !potencialInfluencia || !situacao) {
      return new Response(
        JSON.stringify({ error: "Preencha todos os campos obrigatórios." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    if (!POTENCIAL_VALIDOS.includes(potencialInfluencia)) {
      return new Response(
        JSON.stringify({ error: "Potencial de influência inválido." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    if (!SITUACAO_VALIDAS.includes(situacao)) {
      return new Response(
        JSON.stringify({ error: "Situação inválida." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    let imagemUrl: string | null = null

    if (imagem instanceof File && imagem.size > 0) {
      if (!imagem.type.startsWith("image/")) {
        return new Response(
          JSON.stringify({ error: "O arquivo anexado deve ser uma imagem." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        )
      }

      const ext = imagem.name.split(".").pop()?.toLowerCase() || "jpg"
      const fileName = `${crypto.randomUUID()}.${ext}`
      const filePath = `${FOLDER}/${fileName}`

      const { error: uploadError } = await supabaseClient.storage
        .from(BUCKET)
        .upload(filePath, await imagem.arrayBuffer(), {
          contentType: imagem.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("Erro ao enviar imagem:", uploadError)
        throw uploadError
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from(BUCKET)
        .getPublicUrl(filePath)

      imagemUrl = publicUrlData.publicUrl
    }

    // Geocodificar o endereço com Google Maps antes de inserir
    const googleApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY") ?? ""
    const coords = googleApiKey ? await geocodeEndereco(endereco, googleApiKey) : null

    const { data, error } = await supabaseClient
      .from("liderancas")
      .insert([
        {
          nome,
          telefone,
          endereco,
          descricao,
          potencial_influencia: potencialInfluencia,
          situacao,
          responsavel,
          imagem_url: imagemUrl,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
        },
      ])
      .select()

    if (error) {
      console.error("Erro ao inserir liderança:", error)
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Liderança registrada com sucesso!",
        data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
