"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

export type LiderancaMarker = {
  id: string;
  nome: string;
  responsavel: string | null;
  lat: number;
  lng: number;
};

type LiderancasMapProps = {
  markers: LiderancaMarker[];
  selectedId: string | null;
  onMarkerClick?: (id: string) => void;
  loading?: boolean;
};

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%", minHeight: "420px" };
const DEFAULT_CENTER = { lat: -23.42, lng: -51.94 };
const GOOGLE_MAPS_API_KEY = "AIzaSyCk1iO0inZ5wYLIuHo3Jx-ZOcJ2hoevOGU";

export function LiderancasMap({ markers, selectedId, onMarkerClick, loading }: LiderancasMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);

  const fitBounds = useCallback((map: google.maps.Map, pts: LiderancaMarker[]) => {
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.setCenter({ lat: pts[0].lat, lng: pts[0].lng });
      map.setZoom(17);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    pts.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
    map.fitBounds(bounds, 40);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      fitBounds(mapRef.current, markers);
    }
  }, [markers, fitBounds]);

  // Pan to selected marker and open its InfoWindow
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const m = markers.find((m) => m.id === selectedId);
    if (m) {
      mapRef.current.panTo({ lat: m.lat, lng: m.lng });
      setOpenInfoId(selectedId);
    }
  }, [selectedId, markers]);

  const center =
    markers.length > 0 ? { lat: markers[0].lat, lng: markers[0].lng } : DEFAULT_CENTER;

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <p className="text-sm text-slate-600 font-medium">Carregando mapa...</p>
        </div>
      )}

      {!loading && markers.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center p-6 text-center">
          <p className="text-sm text-slate-500">
            Nenhum endereço foi localizado no mapa. Verifique se os endereços estão completos.
          </p>
        </div>
      )}

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={markers.length ? 10 : 7}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => {
                onMarkerClick?.(m.id);
                setOpenInfoId(m.id);
              }}
              icon={{
                url:
                  selectedId === m.id
                    ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            >
              {openInfoId === m.id && (
                <InfoWindow onCloseClick={() => setOpenInfoId(null)}>
                  <div style={{ minWidth: 160, padding: "2px 0" }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", lineHeight: 1.3 }}>
                      {m.nome}
                    </p>
                    <p style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.3 }}>
                      {m.responsavel || "Responsável não informado"}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full min-h-[420px] flex items-center justify-center">
          <p className="text-sm text-slate-500">Carregando mapa...</p>
        </div>
      )}
    </div>
  );
}
