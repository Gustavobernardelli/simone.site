"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, Search, RefreshCw, Calendar, MapPin, MessageSquare, Phone, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Demand = {
  id: string;
  full_name: string;
  whatsapp: string;
  city: string;
  demand_text: string | null;
  observations: string | null;
  status: string;
  created_at: string;
};

const STATUS_COLORS = {
  "Aberto": "bg-slate-100 text-slate-700 border-slate-200",
  "Em progresso": "bg-blue-50 text-blue-700 border-blue-200",
  "Finalizado": "bg-emerald-50 text-emerald-700 border-emerald-200"
} as const;

function DemandRow({ 
  demand, 
  basicAuth 
}: { 
  demand: Demand; 
  basicAuth: string;
}) {
  const [status, setStatus] = useState(demand.status || "Aberto");
  const [obs, setObs] = useState(demand.observations || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingObs, setSavingObs] = useState(false);
  const [obsChanged, setObsChanged] = useState(false);

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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSavingStatus(true);
    try {
      await fetch("https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/update-demand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`
        },
        body: JSON.stringify({ id: demand.id, status: newStatus })
      });
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveObs = async () => {
    if (!obsChanged) return;
    setSavingObs(true);
    try {
      await fetch("https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/update-demand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`
        },
        body: JSON.stringify({ id: demand.id, observations: obs })
      });
      setObsChanged(false);
    } catch (err) {
      console.error("Erro ao atualizar observações", err);
    } finally {
      setSavingObs(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
      <td className="p-4 align-top w-1/5">
        <div className="font-medium text-slate-900 mb-1">{demand.full_name}</div>
        <div className="flex items-center gap-1 text-sm text-brand-600 mb-2">
          <Phone size={14} />
          <a href={`https://wa.me/${demand.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {demand.whatsapp}
          </a>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={14} className="text-slate-400" />
          {demand.city}
        </div>
      </td>
      
      <td className="p-4 align-top w-1/5">
        <div className="flex items-center gap-2">
          <select 
            value={status}
            onChange={handleStatusChange}
            disabled={savingStatus}
            className={cn(
              "text-sm rounded-full px-3 py-1 border outline-none cursor-pointer focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50",
              STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS["Aberto"]
            )}
          >
            <option value="Aberto">Aberto</option>
            <option value="Em progresso">Em progresso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
          {savingStatus && <Loader2 size={14} className="animate-spin text-slate-400" />}
        </div>
        <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
          <Calendar size={14} />
          {formatDate(demand.created_at)}
        </div>
      </td>

      <td className="p-4 align-top w-2/5">
        {demand.demand_text ? (
          <div className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm whitespace-pre-wrap">
            {demand.demand_text}
          </div>
        ) : (
          <span className="text-slate-400 italic text-sm">Sem mensagem do eleitor.</span>
        )}
      </td>

      <td className="p-4 align-top w-1/5">
        <div className="flex flex-col gap-2">
          <textarea
            value={obs}
            onChange={(e) => {
              setObs(e.target.value);
              setObsChanged(true);
            }}
            placeholder="Anotações internas..."
            className="w-full text-xs p-2 rounded border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none resize-y min-h-[80px]"
          />
          <button 
            onClick={handleSaveObs}
            disabled={!obsChanged || savingObs}
            className="self-end px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {savingObs ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Salvar Obs.
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DemandasDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demands, setDemands] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const basicAuth = btoa(`${username}:${password}`);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
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

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-32 max-w-7xl">
        
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
                  Gerencie o status e adicione anotações internas.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar apoiador..."
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Contato & Local</th>
                      <th className="p-4 font-semibold">Status & Data</th>
                      <th className="p-4 font-semibold">Demanda do Eleitor</th>
                      <th className="p-4 font-semibold">Observações (Interno)</th>
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
                        <DemandRow key={demand.id} demand={demand} basicAuth={basicAuth} />
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
