"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Search, RefreshCw, Calendar, Phone, Mail, Check, Loader2, Users, X, ChevronDown } from "lucide-react";

const EDGE_URL = "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/reuniao-garbo";

type Convidado = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  confirmado: boolean | null;
  n_convidados: number;
  created_at: string;
};

type PresencaStatus = "confirmado" | "nao_vai" | null;

function statusFromBool(v: boolean | null): PresencaStatus {
  if (v === true) return "confirmado";
  if (v === false) return "nao_vai";
  return null;
}

export default function ListaReuniaoGarbo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal de quantidade de convidados
  const [modalConvidado, setModalConvidado] = useState<Convidado | null>(null);
  const [nConvidadosInput, setNConvidadosInput] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);

  const basicAuth = typeof window !== "undefined" ? btoa(`${username}:${password}`) : "";

  const fetchLista = async (auth: string) => {
    const res = await fetch(`${EDGE_URL}?action=lista`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Erro ao autenticar");
    return result.data as Convidado[];
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const auth = btoa(`${username}:${password}`);
      const data = await fetchLista(auth);
      setConvidados(data);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchLista(basicAuth);
      setConvidados(data);
    } finally {
      setLoading(false);
    }
  };

  const patchPresenca = async (id: string, confirmado: boolean | null, n_convidados?: number) => {
    const body: Record<string, unknown> = { id, confirmado };
    if (n_convidados !== undefined) body.n_convidados = n_convidados;

    const res = await fetch(EDGE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Erro ao atualizar");
  };

  const handleSelectPresenca = async (convidado: Convidado, novoStatus: PresencaStatus) => {
    if (novoStatus === "confirmado") {
      // Abre modal para perguntar quantos convidados
      setNConvidadosInput(Math.max(1, convidado.n_convidados ?? 0));
      setModalConvidado(convidado);
      return;
    }

    // "Não vai" → false, sem modal
    setUpdatingId(convidado.id);
    try {
      const confirmadoBool = novoStatus === null ? null : false;
      await patchPresenca(convidado.id, confirmadoBool);
      setConvidados((prev) =>
        prev.map((c) =>
          c.id === convidado.id ? { ...c, confirmado: confirmadoBool } : c
        )
      );
    } catch {
      alert("Erro ao atualizar confirmação.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmarComConvidados = async () => {
    if (!modalConvidado) return;
    const n = Math.max(1, nConvidadosInput);
    setUpdatingId(modalConvidado.id);
    setModalConvidado(null);
    try {
      await patchPresenca(modalConvidado.id, true, n);
      setConvidados((prev) =>
        prev.map((c) =>
          c.id === modalConvidado.id ? { ...c, confirmado: true, n_convidados: n } : c
        )
      );
    } catch {
      alert("Erro ao confirmar presença.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Fecha modal ao clicar fora
  useEffect(() => {
    if (!modalConvidado) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalConvidado(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalConvidado]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filtered = convidados.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefone.includes(searchTerm)
  );

  const totalConfirmados = convidados
    .filter((c) => c.confirmado === true)
    .reduce((sum, c) => sum + (c.n_convidados ?? 0), 0);

  const pendentes = convidados.filter((c) => c.confirmado === null).length;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* Modal de quantidade de convidados */}
      {modalConvidado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Confirmar presença</h2>
              <button
                onClick={() => setModalConvidado(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-1">
              <span className="font-semibold text-slate-800">{modalConvidado.nome}</span>
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Quantas pessoas virão com esse registro?
            </p>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setNConvidadosInput((v) => Math.max(1, v - 1))}
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={nConvidadosInput}
                onChange={(e) => setNConvidadosInput(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center py-2 px-3 rounded-lg border border-slate-200 text-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                onClick={() => setNConvidadosInput((v) => v + 1)}
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xl font-bold"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConvidado(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarComConvidados}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check size={15} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 md:px-6 py-16 max-w-7xl">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-600">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Lista de Convidados</h1>
              <p className="text-sm text-slate-500 mt-2">
                Reunião de Líderes · Garbo Eventos · 16/06
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Usuário</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
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
                {loading ? <><Loader2 size={18} className="animate-spin" /> Autenticando...</> : "Entrar"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Lista de Convidados</h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Reunião de Líderes · Garbo Eventos · 16/06 · 19h00
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar convidado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Atualizar"
                >
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{convidados.length}</p>
                  <p className="text-xs text-slate-500">Inscritos</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Check size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalConfirmados}</p>
                  <p className="text-xs text-slate-500">Confirmados</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-slate-600 font-bold text-sm">
                    {convidados.length > 0 ? Math.round((totalConfirmados / convidados.length) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{pendentes}</p>
                  <p className="text-xs text-slate-500">Pendentes</p>
                </div>
              </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">#</th>
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Telefone</th>
                      <th className="p-4 font-semibold">E-mail</th>
                      <th className="p-4 font-semibold">Inscrito em</th>
                      <th className="p-4 font-semibold text-center">N°</th>
                      <th className="p-4 font-semibold text-center">Presença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                          Nenhum convidado encontrado.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c, i) => {
                        const status = statusFromBool(c.confirmado);
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-slate-400 text-sm font-mono">{i + 1}</td>
                            <td className="p-4 font-semibold text-slate-900">{c.nome}</td>
                            <td className="p-4 text-slate-600">
                              <a
                                href={`https://wa.me/${c.telefone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
                              >
                                <Phone size={13} />
                                {c.telefone}
                              </a>
                            </td>
                            <td className="p-4 text-slate-600">
                              <a
                                href={`mailto:${c.email}`}
                                className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
                              >
                                <Mail size={13} />
                                {c.email}
                              </a>
                            </td>
                            <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar size={13} className="text-slate-400" />
                                {formatDate(c.created_at)}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {status === "confirmado" ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold">
                                  {c.n_convidados ?? 1}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-sm">—</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {updatingId === c.id ? (
                                <div className="flex justify-center">
                                  <Loader2 size={16} className="animate-spin text-slate-400" />
                                </div>
                              ) : (
                                <PresencaDropdown
                                  status={status}
                                  disabled={updatingId !== null}
                                  onChange={(novo) => handleSelectPresenca(c, novo)}
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---------- Dropdown de presença ----------

const OPCOES: { value: PresencaStatus; label: string }[] = [
  { value: null, label: "Confirmar presença" },
  { value: "confirmado", label: "Confirmado" },
  { value: "nao_vai", label: "Não vai" },
];

function PresencaDropdown({
  status,
  disabled,
  onChange,
}: {
  status: PresencaStatus;
  disabled: boolean;
  onChange: (v: PresencaStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = OPCOES.find((o) => o.value === status) ?? OPCOES[0];

  const colorClass =
    status === "confirmado"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "nao_vai"
      ? "bg-red-50 text-red-600 border-red-200"
      : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${colorClass} hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {status === "confirmado" && <Check size={12} />}
        {current.label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-1 overflow-hidden">
          {OPCOES.map((op) => (
            <button
              key={String(op.value)}
              onClick={() => {
                setOpen(false);
                if (op.value !== status) onChange(op.value);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
                op.value === status ? "text-brand-600 bg-brand-50/50" : "text-slate-700"
              }`}
            >
              {op.value === "confirmado" && <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 mr-2 align-middle" />}
              {op.value === "nao_vai" && <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-2 align-middle" />}
              {op.value === null && <span className="inline-block w-3 h-3 rounded-full bg-slate-300 mr-2 align-middle" />}
              {op.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
