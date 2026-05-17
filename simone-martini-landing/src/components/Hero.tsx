"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-brand-50 to-white">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-brand-100 rounded-full blur-3xl opacity-50 z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl opacity-50 z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 text-brand-700 text-sm font-medium mb-6 backdrop-blur-sm border border-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              Pré-candidata a Deputada Estadual
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
              Liderança, renovação e <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">compromisso</span> com você.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              É tempo de uma nova visão para o nosso estado. Simone Martini coloca seu nome à disposição para construir um futuro com mais inovação, transparência e oportunidades para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#support"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 shadow-lg shadow-brand-700/30 transition-all hover:scale-105 active:scale-95"
              >
                Enviar demanda
                <ArrowRight size={20} />
              </a>

            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[700px] flex items-center justify-center lg:justify-end"
          >
            {/* Main Photo Frame */}
            <div className="relative w-full max-w-[500px] aspect-[4/5] lg:aspect-auto lg:h-full bg-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border-8 border-white">
              {/* Replace with actual high quality photo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/80 to-transparent mix-blend-multiply z-10 opacity-60"></div>
              <img
                src="https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/DSC08269.JPG"
                alt="Simone Martini"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <p className="font-semibold text-lg">Simone Martini</p>
                <p className="text-white/80 text-sm">Sempre ao seu lado.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
