"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, Search, RefreshCw, Calendar, MapPin, Phone, Eye, X, Check, Loader2 } from "lucide-react";
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

export default function DemandasDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demands, setDemands] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [modalStatus, setModalStatus] = useState("Aberto");
  const [modalObs, setModalObs] = useState("");
  const [savingModal, setSavingModal] = useState(false);

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

  const openModal = (demand: Demand) => {
    setSelectedDemand(demand);
    setModalStatus(demand.status || "Aberto");
    setModalObs(demand.observations || "");
  };

  const closeModal = () => {
    setSelectedDemand(null);
  };

  const saveModal = async () => {
    if (!selectedDemand) return;
    setSavingModal(true);

    try {
      await fetch("https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/update-demand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`
        },
        body: JSON.stringify({ 
          id: selectedDemand.id, 
          status: modalStatus,
          observations: modalObs
        })
      });

      // Update local state to reflect changes immediately
      setDemands(demands.map(d => 
        d.id === selectedDemand.id 
          ? { ...d, status: modalStatus, observations: modalObs } 
          : d
      ));
      
      closeModal();
    } catch (err) {
      console.error("Erro ao atualizar", err);
      alert("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setSavingModal(false);
    }
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

      <div className="flex-1 container mx-auto px-4 md:px-6 py-32 max-w-7xl">
        
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-12">
            {/* ... login form (unchanged) ... */}
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

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Telefone</th>
                      <th className="p-4 font-semibold">Cidade</th>
                      <th className="p-4 font-semibold">Data</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-center">Visualizar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDemands.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          Nenhuma demanda encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredDemands.map((demand) => (
                        <tr key={demand.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{demand.full_name}</td>
                          <td className="p-4 text-slate-600">
                            <a href={`https://wa.me/${demand.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
                              <Phone size={14} />
                              {demand.whatsapp}
                            </a>
                          </td>
                          <td className="p-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" />
                              {demand.city}
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-slate-400" />
                              {formatDate(demand.created_at).split(',')[0]}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "text-xs font-medium rounded-full px-2.5 py-1 border",
                              STATUS_COLORS[demand.status as keyof typeof STATUS_COLORS] || STATUS_COLORS["Aberto"]
                            )}>
                              {demand.status || "Aberto"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => openModal(demand)}
                              className="p-2 bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-700 rounded-lg transition-colors inline-flex"
                              title="Visualizar demanda"
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
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedDemand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[95vw] xl:max-w-[1400px] h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Detalhes da Demanda</h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-slate-600">Status:</label>
                  <select 
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className={cn(
                      "text-sm font-medium rounded-full px-3 py-1.5 border outline-none cursor-pointer focus:ring-2 focus:ring-brand-500/20",
                      STATUS_COLORS[modalStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS["Aberto"]
                    )}
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em progresso">Em progresso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-8 h-full">
                
                {/* Column 1: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-4 border-b border-slate-100 pb-2">Informações</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Nome Completo</p>
                        <p className="font-semibold text-slate-900">{selectedDemand.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">WhatsApp</p>
                        <a href={`https://wa.me/${selectedDemand.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline flex items-center gap-1">
                          <Phone size={14} />
                          {selectedDemand.whatsapp}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Cidade</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {selectedDemand.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Data de Envio</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-1">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(selectedDemand.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Demand Text */}
                <div className="md:border-l md:border-r border-slate-100 md:px-8">
                  <h3 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-4 border-b border-slate-100 pb-2">Demanda do Eleitor</h3>
                  {selectedDemand.demand_text ? (
                    <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedDemand.demand_text}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-sm text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                      O eleitor não enviou nenhuma mensagem escrita.
                    </div>
                  )}
                </div>

                {/* Column 3: Observations (Editable) */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-4 border-b border-slate-100 pb-2">Anotações (Interno)</h3>
                  <textarea
                    value={modalObs}
                    onChange={(e) => setModalObs(e.target.value)}
                    placeholder="Escreva aqui anotações internas da equipe sobre essa demanda..."
                    className="flex-1 w-full p-4 rounded-xl border border-amber-200 bg-amber-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-slate-700 min-h-[200px]"
                  />
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                disabled={savingModal}
              >
                Cancelar
              </button>
              <button 
                onClick={saveModal}
                disabled={savingModal}
                className="px-8 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {savingModal ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
