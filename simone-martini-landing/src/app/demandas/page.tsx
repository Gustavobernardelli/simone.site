"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, Search, RefreshCw, Calendar, MapPin, MessageSquare, Phone } from "lucide-react";

type Demand = {
  id: string;
  full_name: string;
  whatsapp: string;
  city: string;
  demand_text: string | null;
  observations: string | null;
  created_at: string;
};

export default function DemandasDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demands, setDemands] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const basicAuth = btoa(`${username}:${password}`);
      const response = await fetch("https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/get-demands", {
        headers: {
          "Authorization": `Basic ${basicAuth}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao autenticar");
      }

      setDemands(result.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    handleLogin();
  };

  const filteredDemands = demands.filter(
    (d) =>
      d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.demand_text && d.demand_text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-32 max-w-6xl">
        
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
                {loading ? "Autenticando..." : "Entrar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Painel de Demandas</h1>
                <p className="text-slate-500 mt-1">
                  Gerencie e acompanhe as solicitações dos apoiadores.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/20 outline-none"
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">Contato</th>
                      <th className="p-4 font-semibold">Localização</th>
                      <th className="p-4 font-semibold">Demanda</th>
                      <th className="p-4 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDemands.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          Nenhuma demanda encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredDemands.map((demand) => (
                        <tr key={demand.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 align-top">
                            <div className="font-medium text-slate-900 mb-1">{demand.full_name}</div>
                            <div className="flex items-center gap-1 text-sm text-brand-600">
                              <Phone size={14} />
                              <a href={`https://wa.me/${demand.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {demand.whatsapp}
                              </a>
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="flex items-center gap-1 text-slate-600">
                              <MapPin size={16} className="text-slate-400" />
                              {demand.city}
                            </div>
                          </td>
                          <td className="p-4 align-top max-w-md">
                            {demand.demand_text ? (
                              <div className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm whitespace-pre-wrap">
                                {demand.demand_text}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-sm">Sem mensagem</span>
                            )}
                            {demand.observations && (
                              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-start gap-1">
                                <MessageSquare size={14} className="shrink-0 mt-0.5" />
                                <span>{demand.observations}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-top text-sm text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(demand.created_at)}
                            </div>
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

      <Footer />
    </main>
  );
}
