"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/lib/geocode";
import type { LiderancaMarker } from "@/components/LiderancasMap";

const LiderancasMap = dynamic(
  () => import("@/components/LiderancasMap").then((m) => m.LiderancasMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[420px] rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">Carregando mapa...</p>
      </div>
    ),
  }
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
  ImageIcon,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Save,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Lideranca = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string | null;
  rua: string | null;
  numero: string | null;
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

type Responsavel = { id: string; nome: string; email: string };

type Session = {
  tipo: "admin" | "responsavel";
  responsavel?: Responsavel;
  credencial: string;
  senha: string;
};

type EditForm = {
  nome: string;
  telefone: string;
  descricao: string;
  situacao: string;
};

const POTENCIAL_LABELS: Record<string, string> = {
  solo: "Apoiador solo",
  familiar: "Núcleo familiar",
  "30-50": "30 - 50 pessoas",
  "50-80": "50 - 80 pessoas",
  "80-120": "80 - 120 pessoas",
  "120+": "120 +",
};

const SITUACAO_OPCOES = [
  "Fechado com Simone",
  "Em conversa",
  "Entrar em contato",
] as const;

const SITUACAO_COLORS: Record<string, string> = {
  "Fechado com Simone": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Em conversa": "bg-blue-50 text-blue-700 border-blue-200",
  "Entrar em contato": "bg-amber-50 text-amber-700 border-amber-200",
};

const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500";

export default function PainelLiderancasPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [credencial, setCredencial] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liderancas, setLiderancas] = useState<Lideranca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Lideranca | null>(null);
  const [editing, setEditing] = useState<Lideranca | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ nome: "", telefone: "", descricao: "", situacao: "" });
  const [saving, setSaving] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<LiderancaMarker[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  type SortKey = "nome" | "cidade" | "telefone" | "potencial_influencia" | "situacao" | "responsavel";
  type SortDir = "asc" | "desc";
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const fetchData = async (sess: Session) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/painel-liderancas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credencial: sess.credencial, senha: sess.senha }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao carregar dados");
      setLiderancas(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/painel-liderancas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credencial: credencial.trim(), senha }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Credenciais inválidas");

      const sess: Session = {
        tipo: result.tipo,
        responsavel: result.responsavel,
        credencial: credencial.trim(),
        senha,
      };
      setSession(sess);
      setLiderancas(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (session) fetchData(session);
  };

  const handleLogout = () => {
    setSession(null);
    setLiderancas([]);
    setCredencial("");
    setSenha("");
    setError("");
    setSelected(null);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!session || session.tipo !== "admin") return;
    if (!confirm("Excluir este registro permanentemente?")) return;
    setDeletingId(id);
    try {
      const authToken = btoa(`${session.credencial}:${session.senha}`);
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/delete-lideranca",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro ao excluir");
      }
      setLiderancas((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir registro");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (l: Lideranca) => {
    setEditing(l);
    setEditForm({
      nome: l.nome,
      telefone: l.telefone,
      descricao: l.descricao,
      situacao: l.situacao,
    });
  };

  const handleSaveEdit = async () => {
    if (!editing || !session) return;
    setSaving(true);
    try {
      const authToken = btoa(`${session.credencial}:${session.senha}`);
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/update-lideranca",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editing.id,
            nome: editForm.nome,
            telefone: editForm.telefone,
            descricao: editForm.descricao,
            situacao: editForm.situacao,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao salvar");

      setLiderancas((prev) =>
        prev.map((l) => (l.id === editing.id ? { ...l, ...result.data } : l))
      );
      if (selected?.id === editing.id) setSelected({ ...selected, ...result.data });
      setEditing(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  const getCidade = (l: Lideranca): string => {
    if (l.cidade) return l.cidade;
    const parts = l.endereco.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return "—";
    const last = parts[parts.length - 1];
    if (/^[A-Z]{2}$/.test(last) && parts.length >= 2) return parts[parts.length - 2];
    return last;
  };

  const getEnderecoCompleto = (l: Lideranca): string => {
    if (l.rua && l.numero && l.cidade) return `${l.rua}, ${l.numero} — ${l.cidade}`;
    return l.endereco;
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const rows = liderancas.filter(
      (l) =>
        l.nome.toLowerCase().includes(term) ||
        l.telefone.toLowerCase().includes(term) ||
        l.endereco.toLowerCase().includes(term) ||
        l.situacao.toLowerCase().includes(term) ||
        (l.responsavel && l.responsavel.toLowerCase().includes(term)) ||
        (l.cidade && l.cidade.toLowerCase().includes(term))
    );

    return [...rows].sort((a, b) => {
      let aVal: string;
      let bVal: string;
      if (sortKey === "cidade") {
        aVal = (a.cidade ?? "").toLowerCase();
        bVal = (b.cidade ?? "").toLowerCase();
      } else {
        aVal = ((a[sortKey] as string | null) ?? "").toLowerCase();
        bVal = ((b[sortKey] as string | null) ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [liderancas, searchTerm, sortKey, sortDir]);

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
    if (!session || filtered.length === 0) {
      setMapMarkers([]);
      return;
    }

    let cancelled = false;

    const loadMarkers = async () => {
      setMapLoading(true);
      const markers: LiderancaMarker[] = [];

      for (const l of filtered) {
        if (cancelled) break;

        if (l.lat && l.lng) {
          markers.push({ id: l.id, nome: l.nome, responsavel: l.responsavel, lat: l.lat, lng: l.lng });
          continue;
        }

        const enderecoParaGeocode =
          l.rua && l.numero && l.cidade
            ? `${l.rua}, ${l.numero}, ${l.cidade}`
            : l.endereco;
        const coords = await geocodeAddress(enderecoParaGeocode);
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
  }, [session, filtered, searchTerm]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 w-full px-2 py-6 max-w-[1800px] mx-auto">
        {!session ? (
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
                  Usuário / E-mail
                </label>
                <input
                  type="text"
                  value={credencial}
                  onChange={(e) => setCredencial(e.target.value)}
                  className={inputClass}
                  placeholder="E-mail ou usuário admin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={inputClass}
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {session.tipo === "responsavel"
                    ? `Minhas Lideranças`
                    : "Painel de Lideranças"}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <User size={13} className="text-slate-400" />
                  <p className="text-slate-500 text-sm">
                    {session.tipo === "responsavel"
                      ? session.responsavel?.nome
                      : "Administrador"}
                  </p>
                  {session.tipo === "responsavel" && (
                    <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full font-medium">
                      {liderancas.length} cadastro{liderancas.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
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
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
              {/* Tabela */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-xs font-semibold text-slate-700">Registros</h2>
                </div>
                <div className="overflow-x-auto max-h-[calc(100vh-180px)] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[620px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[9px] uppercase tracking-wider">
                        {(
                          [
                            { key: "nome", label: "Nome" },
                            { key: "cidade", label: "Cidade" },
                            { key: "telefone", label: "Telefone" },
                            { key: "potencial_influencia", label: "Potencial" },
                            { key: "situacao", label: "Situação" },
                            ...(session.tipo === "admin"
                              ? [{ key: "responsavel" as SortKey, label: "Responsável" }]
                              : []),
                          ] as { key: SortKey; label: string }[]
                        ).map(({ key, label }) => (
                          <th
                            key={key}
                            className="px-2 py-1.5 font-semibold cursor-pointer select-none hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            onClick={() => handleSort(key)}
                          >
                            <span className="flex items-center gap-0.5">
                              {label}
                              {sortKey === key ? (
                                sortDir === "asc" ? (
                                  <ChevronUp size={10} className="text-brand-600" />
                                ) : (
                                  <ChevronDown size={10} className="text-brand-600" />
                                )
                              ) : (
                                <ChevronsUpDown size={10} className="opacity-30" />
                              )}
                            </span>
                          </th>
                        ))}
                        <th className="px-2 py-1.5 font-semibold text-center">Ver</th>
                        <th className="px-2 py-1.5 font-semibold text-center">Editar</th>
                        {session.tipo === "admin" && (
                          <th className="px-2 py-1.5 font-semibold text-center">Del</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-500 text-xs">
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
                            <td className="px-2 py-1.5 font-medium text-slate-900 text-[11px] max-w-[130px] truncate">
                              {l.nome}
                            </td>
                            <td className="px-2 py-1.5 text-slate-600 text-[11px] whitespace-nowrap">
                              {getCidade(l)}
                            </td>
                            <td className="px-2 py-1.5 text-slate-600 text-[11px]">
                              <a
                                href={`https://wa.me/55${l.telefone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 hover:text-brand-600 transition-colors whitespace-nowrap"
                              >
                                <Phone size={11} />
                                {l.telefone}
                              </a>
                            </td>
                            <td className="px-2 py-1.5 text-slate-600 text-[11px] whitespace-nowrap">
                              {POTENCIAL_LABELS[l.potencial_influencia] || l.potencial_influencia}
                            </td>
                            <td className="px-2 py-1.5">
                              <span
                                className={cn(
                                  "text-[9px] font-medium rounded-full px-1.5 py-0.5 border whitespace-nowrap",
                                  SITUACAO_COLORS[l.situacao] ||
                                    "bg-slate-100 text-slate-700 border-slate-200"
                                )}
                              >
                                {l.situacao}
                              </span>
                            </td>
                            {session.tipo === "admin" && (
                              <td className="px-2 py-1.5 text-slate-600 text-[11px] max-w-[100px] truncate">
                                {l.responsavel || "—"}
                              </td>
                            )}
                            <td className="px-2 py-1.5 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected(l);
                                  setHighlightedId(l.id);
                                }}
                                className="p-1 bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-700 rounded transition-colors inline-flex"
                                title="Visualizar"
                              >
                                <Eye size={13} />
                              </button>
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEdit(l);
                                }}
                                className="p-1 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 rounded transition-colors inline-flex"
                                title="Editar"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                            {session.tipo === "admin" && (
                              <td className="px-2 py-1.5 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(l.id);
                                  }}
                                  disabled={deletingId === l.id}
                                  className="p-1 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded transition-colors inline-flex disabled:opacity-50"
                                  title="Excluir"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mapa */}
              <div className="min-w-0 xl:sticky xl:top-6">
                <div className="px-3 py-2 border border-slate-100 border-b-0 rounded-t-xl bg-slate-50 flex items-center justify-between gap-2">
                  <h2 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-brand-600" />
                    Mapa de lideranças
                  </h2>
                  <span className="text-[10px] text-slate-500">
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

      {/* Modal: Detalhes */}
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
                  <p className="font-semibold text-slate-900">{selected.responsavel || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Data de cadastro</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    {formatDate(selected.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Cidade</p>
                  <p className="font-semibold text-slate-900">{getCidade(selected)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Número</p>
                  <p className="font-semibold text-slate-900">{selected.numero || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Rua / Endereço completo</p>
                  <p className="font-semibold text-slate-900 flex items-start gap-1">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    {getEnderecoCompleto(selected)}
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
                  <a href={selected.imagem_url} target="_blank" rel="noopener noreferrer" className="block">
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

      {/* Modal: Editar */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Editar Liderança</h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={editForm.nome}
                  onChange={(e) => setEditForm((f) => ({ ...f, nome: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                <input
                  type="text"
                  value={editForm.telefone}
                  onChange={(e) => setEditForm((f) => ({ ...f, telefone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Situação</label>
                <select
                  value={editForm.situacao}
                  onChange={(e) => setEditForm((f) => ({ ...f, situacao: e.target.value }))}
                  className={inputClass}
                >
                  {SITUACAO_OPCOES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                <textarea
                  rows={4}
                  value={editForm.descricao}
                  onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Salvar alterações
                  </>
                )}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
