"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormValues = {
  fullName: string;
  whatsapp: string;
  city: string;
  demand: string;
  privacyPolicy: boolean;
};

export function SupportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>();

  const privacyPolicyAccepted = watch("privacyPolicy", false);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/submit-demand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar os dados");
      }

      setIsSubmitted(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Ocorreu um erro ao enviar sua demanda. Tente novamente.");
    }
  };

  // Basic WhatsApp mask formatter (e.g. 11999999999 -> (11) 99999-9999)
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    e.target.value = value;
  };

  return (
    <section id="enviar_demanda" className="py-24 bg-brand-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Info */}
          <div className="md:w-5/12 bg-gradient-to-br from-brand-700 to-brand-900 p-10 md:p-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-4 leading-tight">Traga sua Demanda</h3>
              <p className="text-brand-100 mb-8 leading-relaxed">
                Queremos ouvir você. Compartilhe o que está faltando na sua cidade, aponte problemas ou envie solicitações diretamente para a equipe da Simone. A sua participação é fundamental para construirmos soluções reais.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle className="text-accent-500 w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Aponte melhorias e necessidades locais</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle className="text-accent-500 w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Envie sugestões e solicitações de melhoria</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle className="text-accent-500 w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Fale diretamente com nossa equipe</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-10 md:p-12">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Demanda enviada!</h4>
                <p className="text-slate-600 max-w-sm">
                  Sua solicitação foi recebida com sucesso. A equipe da Simone irá analisar as informações e entrará em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Ex: João da Silva"
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
                      errors.fullName ? "border-red-500" : "border-slate-200"
                    )}
                    {...register("fullName", { required: "O nome é obrigatório" })}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-slate-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
                        errors.whatsapp ? "border-red-500" : "border-slate-200"
                      )}
                      {...register("whatsapp", { 
                        required: "O WhatsApp é obrigatório",
                        onChange: handleWhatsAppChange,
                        minLength: { value: 14, message: "WhatsApp inválido" }
                      })}
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Sua cidade"
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
                        errors.city ? "border-red-500" : "border-slate-200"
                      )}
                      {...register("city", { required: "A cidade é obrigatória" })}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="demand" className="block text-sm font-semibold text-slate-700 mb-2">
                    Sua demanda, queixa ou solicitação *
                  </label>
                  <textarea
                    id="demand"
                    rows={4}
                    placeholder="Descreva aqui o que está faltando na sua cidade ou qual a sua solicitação para a equipe da Simone..."
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y",
                      errors.demand ? "border-red-500" : "border-slate-200"
                    )}
                    {...register("demand", { required: "A descrição da sua demanda é obrigatória" })}
                  ></textarea>
                  {errors.demand && <p className="text-red-500 text-xs mt-1">{errors.demand.message}</p>}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacyPolicy"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-accent-500 focus:ring-accent-500 cursor-pointer"
                    {...register("privacyPolicy", { required: true })}
                  />
                  <label htmlFor="privacyPolicy" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
                    Estou de acordo com a utilização de dados de nossa <a href="/politica-de-privacidade" className="text-accent-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">política de privacidade</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !privacyPolicyAccepted}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-accent-500/20"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Enviar Demanda
                      <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-slate-500">
                  Seus dados estão seguros e não serão compartilhados com terceiros.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
