"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#0A0112] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/Design%20sem%20nome.png')" }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-fuchsia-900/20 rounded-full blur-3xl opacity-40 z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-amber-300 text-sm font-medium mb-6 backdrop-blur-md border border-white/10 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Pré-candidata a Deputada Estadual
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Liderança, renovação e <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">compromisso</span> com você.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-lg">
              É tempo de uma nova visão para o nosso estado. Simone Martini coloca seu nome à disposição para construir um futuro com mais inovação, transparência e oportunidades para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#support"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-full hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105 active:scale-95"
              >
                Enviar demanda
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>

          {/* Spacer Column to keep Simone Martini on the right side of the background image visible */}
          <div className="hidden lg:block lg:h-[700px] w-full" />
        </div>
      </div>
    </section>
  );
}
