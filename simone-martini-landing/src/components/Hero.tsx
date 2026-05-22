"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#0A0112] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/capasite2.jpg')" }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-fuchsia-900/20 rounded-full blur-3xl opacity-40 z-0" />

      {/* Dark overlays to increase text contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0112]/95 via-[#0A0112]/70 to-[#0A0112]/20 lg:to-transparent z-0 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          
          {/* Mobile Image - Shown first on mobile, hidden on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex lg:hidden justify-center items-center w-full relative z-20 mb-2"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[4/5] flex justify-center">
              {/* Subtle background glow behind the portrait */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent-500/40 to-transparent rounded-full blur-3xl -z-10" />
              
              <img
                src="https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/imagem%20principal.png"
                alt="Simone Martini"
                className="h-full w-auto object-contain drop-shadow-[0_15px_30px_rgba(255,107,0,0.25)] select-none pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-accent-400 text-sm font-medium mb-6 backdrop-blur-md border border-white/10 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              Pré-candidata a Deputada Estadual • Paraná 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              A força da <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-amber-400 to-accent-500 drop-shadow-[0_2px_10px_rgba(249,115,22,0.2)]">renovação</span> e do cuidado real no Paraná.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-xl text-justify">
              Advogada, sarandiense e ex-procuradora-geral municipal, que recebeu <strong>12.380 votos</strong> de confiança em sua última campanha para prefeitura de Sarandi. Uma liderança de ficha limpa pelo partido <strong>NOVO</strong> para fiscalizar com firmeza e trabalhar pelo desenvolvimento do nosso estado.
            </p>
            
            {/* Desktop Button - hidden on mobile */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4">
              <a
                href="#support"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-full hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all hover:scale-105 active:scale-95"
              >
                Enviar demanda ou sugestão
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>

          {/* Desktop Image - Hidden on mobile, shown on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center items-center w-full relative z-20"
          >
            <div className="relative w-full lg:h-[550px] aspect-auto flex justify-center">
              {/* Subtle background glow behind the portrait */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent-500/40 to-transparent rounded-full blur-3xl -z-10" />
              
              <img
                src="https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/imagem%20principal.png"
                alt="Simone Martini"
                className="h-full w-auto object-contain drop-shadow-[0_15px_30px_rgba(255,107,0,0.25)] select-none pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Mobile Button - Shown last on mobile, hidden on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex lg:hidden flex-col w-full z-20 mt-4"
          >
            <a
              href="#support"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-full hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all hover:scale-105 active:scale-95 text-center text-sm font-bold"
            >
              Enviar demanda ou sugestão
              <ArrowRight size={18} />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
