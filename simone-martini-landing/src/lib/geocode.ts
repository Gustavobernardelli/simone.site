export type GeoCoords = { lat: number; lng: number };

const geocodeCache = new Map<string, GeoCoords | null>();

const SUPABASE_GEOCODE_URL =
  "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/geocode-address";

export async function geocodeAddress(address: string): Promise<GeoCoords | null> {
  const key = address.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  try {
    const response = await fetch(SUPABASE_GEOCODE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      geocodeCache.set(key, null);
      return null;
    }

    const data = await response.json();

    if (typeof data.lat !== "number" || typeof data.lng !== "number") {
      geocodeCache.set(key, null);
      return null;
    }

    const coords: GeoCoords = { lat: data.lat, lng: data.lng };
    geocodeCache.set(key, coords);
    return coords;
  } catch {
    geocodeCache.set(key, null);
    return null;
  }
}
