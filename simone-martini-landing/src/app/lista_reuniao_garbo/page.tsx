"use client";

import { useState, useEffect } from "react";
import { Lock, Search, RefreshCw, Calendar, Phone, Mail, Check, Loader2, Users } from "lucide-react";

const EDGE_URL = "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/reuniao-garbo";

type Convidado = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  confirmado: boolean;
  created_at: string;
};

export default function ListaReuniaoGarbo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const toggleConfirmado = async (convidado: Convidado) => {
    setUpdatingId(convidado.id);
    try {
      const res = await fetch(EDGE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({ id: convidado.id, confirmado: !convidado.confirmado }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      setConvidados((prev) =>
        prev.map((c) =>
          c.id === convidado.id ? { ...c, confirmado: !c.confirmado } : c
        )
      );
    } catch {
      alert("Erro ao atualizar confirmação.");
    } finally {
      setUpdatingId(null);
    }
  };

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

  const confirmados = convidados.filter((c) => c.confirmado).length;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-16 max-w-7xl">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-600">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Lista de Convidados</h1>
              <p className="text-sm text-slate-500 mt-2">
                Reunião de Líderes · Garbo Eventos · 18/06
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
                  Reunião de Líderes · Garbo Eventos · 18/06 · 19h00
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
                  <p className="text-2xl font-bold text-slate-900">{confirmados}</p>
                  <p className="text-xs text-slate-500">Confirmados</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-slate-600 font-bold text-sm">
                    {convidados.length > 0 ? Math.round((confirmados / convidados.length) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{convidados.length - confirmados}</p>
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
                      <th className="p-4 font-semibold text-center">Confirmado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                          Nenhum convidado encontrado.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c, i) => (
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
                            <button
                              onClick={() => toggleConfirmado(c)}
                              disabled={updatingId === c.id}
                              title={c.confirmado ? "Desmarcar confirmação" : "Confirmar presença"}
                              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${
                                c.confirmado
                                  ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                                  : "bg-white border-slate-300 text-transparent hover:border-emerald-400"
                              }`}
                            >
                              {updatingId === c.id ? (
                                <Loader2 size={14} className="animate-spin text-slate-400" />
                              ) : (
                                <Check size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
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
