import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()

    if (!address || typeof address !== "string") {
      return new Response(
        JSON.stringify({ error: "address is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY")
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Geocoding service not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      )
    }

    const query = `${address.trim()}, Paraná, Brasil`
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== "OK" || !data.results?.length) {
      return new Response(
        JSON.stringify({ error: `Geocoding failed: ${data.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      )
    }

    const { lat, lng } = data.results[0].geometry.location
    const locationType: string = data.results[0].geometry.location_type

    return new Response(
      JSON.stringify({ lat, lng, location_type: locationType }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
