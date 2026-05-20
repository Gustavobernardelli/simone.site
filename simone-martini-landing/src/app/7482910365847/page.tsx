"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/lib/geocode";
import type { LiderancaMarker } from "@/components/LiderancasMap";

const LiderancasMap = dynamic(
  () => import("@/components/LiderancasMap").then((m) => m.LiderancasMap),
  { ssr: false, loading: () => (
    <div className="w-full min-h-[420px] rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
      <p className="text-sm text-slate-500">Carregando mapa...</p>
    </div>
  )}
);
import {
  Lock,
  Search,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Eye,
  X,
  Users,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Lideranca = {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  descricao: string;
  potencial_influencia: string;
  situacao: string;
  responsavel: string | null;
  imagem_url: string | null;
  created_at: string;
  lat: number | null;
  lng: number | null;
};

const POTENCIAL_LABELS: Record<string, string> = {
  "30-50": "30 - 50 pessoas",
  "50-80": "50 - 80 pessoas",
  "80-120": "80 - 120 pessoas",
  "120+": "120 +",
};

const SITUACAO_COLORS: Record<string, string> = {
  "Fechado com Simone": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Em conversa": "bg-blue-50 text-blue-700 border-blue-200",
  "Entrar em contato": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function PainelLiderancasPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liderancas, setLiderancas] = useState<Lideranca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Lideranca | null>(null);
  const [mapMarkers, setMapMarkers] = useState<LiderancaMarker[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const basicAuth = btoa(`${username}:${password}`);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/get-liderancas",
        {
          headers: { Authorization: `Basic ${basicAuth}` },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao autenticar");
      }

      setLiderancas(result.data);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Credenciais inválidas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => handleLogin();

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return liderancas.filter(
      (l) =>
        l.nome.toLowerCase().includes(term) ||
        l.telefone.toLowerCase().includes(term) ||
        l.endereco.toLowerCase().includes(term) ||
        l.situacao.toLowerCase().includes(term) ||
        (l.responsavel && l.responsavel.toLowerCase().includes(term))
    );
  }, [liderancas, searchTerm]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!isAuthenticated || filtered.length === 0) {
      setMapMarkers([]);
      return;
    }

    let cancelled = false;

    const loadMarkers = async () => {
      setMapLoading(true);
      const markers: LiderancaMarker[] = [];

      for (const l of filtered) {
        if (cancelled) break;

        // Use coordinates stored at registration time when available
        if (l.lat && l.lng) {
          markers.push({ id: l.id, nome: l.nome, responsavel: l.responsavel, lat: l.lat, lng: l.lng });
          continue;
        }

        // Fall back to on-demand geocoding for legacy records
        const coords = await geocodeAddress(l.endereco);
        if (coords) {
          markers.push({ id: l.id, nome: l.nome, responsavel: l.responsavel, lat: coords.lat, lng: coords.lng });
        }
      }

      if (!cancelled) {
        setMapMarkers(markers);
        setMapLoading(false);
      }
    };

    loadMarkers();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, filtered, searchTerm]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-[1600px]">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-600">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Acesso Restrito</h1>
              <p className="text-sm text-slate-500 mt-2">
                Painel exclusivo para a equipe de campanha da Simone Martini.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Autenticando..." : "Entrar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Painel de Lideranças</h1>
                <p className="text-slate-500 mt-1">
                  Cadastros recebidos pelo formulário de lideranças.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar liderança..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Atualizar dados"
                >
                  <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Coluna esquerda: tabela */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-semibold text-slate-700">Registros</h2>
                </div>
                <div className="overflow-x-auto max-h-[calc(100vh-220px)] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 font-semibold">Nome</th>
                        <th className="p-3 font-semibold">Telefone</th>
                        <th className="p-3 font-semibold">Potencial</th>
                        <th className="p-3 font-semibold">Situação</th>
                        <th className="p-3 font-semibold text-center">Ver</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            Nenhuma liderança encontrada.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((l) => (
                          <tr
                            key={l.id}
                            onClick={() => setHighlightedId(l.id)}
                            className={cn(
                              "hover:bg-slate-50/50 transition-colors cursor-pointer",
                              highlightedId === l.id && "bg-brand-50/60"
                            )}
                          >
                            <td className="p-3 font-medium text-slate-900 text-sm">{l.nome}</td>
                            <td className="p-3 text-slate-600 text-sm">
                              <a
                                href={`https://wa.me/55${l.telefone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                              >
                                <Phone size={14} />
                                {l.telefone}
                              </a>
                            </td>
                            <td className="p-3 text-slate-600 text-xs">
                              {POTENCIAL_LABELS[l.potencial_influencia] ||
                                l.potencial_influencia}
                            </td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "text-xs font-medium rounded-full px-2 py-0.5 border whitespace-nowrap",
                                  SITUACAO_COLORS[l.situacao] ||
                                    "bg-slate-100 text-slate-700 border-slate-200"
                                )}
                              >
                                {l.situacao}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected(l);
                                  setHighlightedId(l.id);
                                }}
                                className="p-2 bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-700 rounded-lg transition-colors inline-flex"
                                title="Visualizar liderança"
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Coluna direita: mapa */}
              <div className="min-w-0 xl:sticky xl:top-28">
                <div className="px-4 py-3 border border-slate-100 border-b-0 rounded-t-2xl bg-slate-50 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-600" />
                    Mapa de lideranças
                  </h2>
                  <span className="text-xs text-slate-500">
                    {mapLoading
                      ? "Localizando endereços..."
                      : `${mapMarkers.length} de ${filtered.length} no mapa`}
                  </span>
                </div>
                <LiderancasMap
                  markers={mapMarkers}
                  selectedId={highlightedId}
                  onMarkerClick={(id) => {
                    setHighlightedId(id);
                    const item = filtered.find((l) => l.id === id);
                    if (item) setSelected(item);
                  }}
                  loading={mapLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Detalhes da Liderança</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nome</p>
                  <p className="font-semibold text-slate-900">{selected.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Telefone</p>
                  <a
                    href={`https://wa.me/55${selected.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <Phone size={14} />
                    {selected.telefone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Potencial de influência</p>
                  <p className="font-semibold text-slate-900">
                    {POTENCIAL_LABELS[selected.potencial_influencia] ||
                      selected.potencial_influencia}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Situação</p>
                  <span
                    className={cn(
                      "text-xs font-medium rounded-full px-2.5 py-1 border inline-block",
                      SITUACAO_COLORS[selected.situacao] ||
                        "bg-slate-100 text-slate-700 border-slate-200"
                    )}
                  >
                    {selected.situacao}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Responsável</p>
                  <p className="font-semibold text-slate-900">
                    {selected.responsavel || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Data de cadastro</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    {formatDate(selected.created_at)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Endereço</p>
                  <p className="font-semibold text-slate-900 flex items-start gap-1">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    {selected.endereco}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Descrição</p>
                <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selected.descricao}
                </div>
              </div>

              {selected.imagem_url && (
                <div>
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <ImageIcon size={14} />
                    Imagem anexada
                  </p>
                  <a
                    href={selected.imagem_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selected.imagem_url}
                      alt={`Foto de ${selected.nome}`}
                      className="max-h-64 rounded-xl border border-slate-200 object-cover"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
