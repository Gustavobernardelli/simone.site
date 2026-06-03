"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const EDGE_URL = "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/reuniao-garbo";
const HEADER_IMG = "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/capa%20apoio.png";

type ContadorData = { inscritos: number; total: number; percentual: number };
type FormState = "idle" | "loading" | "success" | "error";

export default function ReuniaoLideres() {
  const [contador, setContador] = useState<ContadorData | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchContador() {
    try {
      const res = await fetch(EDGE_URL);
      const data = await res.json();
      setContador(data);
    } catch {}
  }

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");
    try {
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao realizar inscrição.");
      await fetchContador();
      setFormState("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado.");
      setFormState("error");
    }
  }

  const percentual = contador?.percentual ?? 0;

  return (
    <main
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 45%, #111827 75%, #0a1628 100%)",
      }}
    >
      {/* Luzes laranja de fundo */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 45% at 8% 15%, rgba(255,107,0,0.20) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 40% at 92% 85%, rgba(255,107,0,0.15) 0%, transparent 65%)",
            "radial-gradient(ellipse 35% 25% at 55% 55%, rgba(255,107,0,0.07) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10">
        {/* Imagem de cabeçalho */}
        <div className="container mx-auto px-6 pt-10 max-w-2xl">
          <img
            src={HEADER_IMG}
            alt="Reunião de Líderes"
            className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* Hero */}
        <div className="container mx-auto px-6 py-14 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-4 py-1.5 text-accent-300 text-sm font-semibold mb-8 tracking-wide uppercase">
            Convite Exclusivo
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Reunião de{" "}
            <span className="text-accent-400">Líderes</span>
          </h1>
          <p className="text-lg text-white/60 mb-2 font-medium">
            com Simone Martini · Partido NOVO Sarandi PR
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-5 py-3">
              <Calendar size={20} className="text-accent-400" />
              <span className="font-semibold text-white">16 de junho de 2026</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-5 py-3">
              <Clock size={20} className="text-accent-400" />
              <span className="font-semibold text-white">19h00</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-5 py-3">
              <MapPin size={20} className="text-accent-400" />
              <span className="font-semibold text-white">Garbo Eventos</span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="container mx-auto px-6 pb-16 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-slate-900">
            {formState === "success" ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Inscrição confirmada!
                </h2>
                <p className="text-slate-500 mb-8">
                  Sua presença foi registrada. Até lá, {nome.split(" ")[0]}!
                </p>

                {/* Contador — só aparece após inscrição */}
                <div
                  className="rounded-2xl p-6 text-white mb-6"
                  style={{
                    background: "linear-gradient(135deg, #0d1f3c 0%, #111827 100%)",
                    boxShadow: "inset 0 0 60px rgba(255,107,0,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={18} className="text-accent-400" />
                    <span className="font-semibold text-white/70 text-sm uppercase tracking-wide">
                      Vagas preenchidas
                    </span>
                  </div>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full transition-all duration-700"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-accent-400">{percentual}%</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-100">
                  <p className="font-semibold mb-1">Detalhes do evento</p>
                  <p>16 de junho de 2026 · 19h00</p>
                  <p>Garbo Eventos</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Confirme sua presença
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                  Preencha o formulário abaixo para garantir sua vaga neste encontro exclusivo.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome completo <span className="text-accent-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Telefone / WhatsApp <span className="text-accent-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      E-mail <span className="text-accent-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all text-slate-900"
                    />
                  </div>

                  {formState === "error" && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full py-4 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70 text-base text-white"
                    style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)" }}
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      "Confirmar Presença"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <footer className="text-center pb-10 text-white/30 text-xs">
          Simone Martini · Partido NOVO Sarandi PR
        </footer>
      </div>
    </main>
  );
}
