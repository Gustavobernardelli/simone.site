"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function About() {
  const highlights = [
    "Experiência comprovada em gestão pública.",
    "Defensora do desenvolvimento econômico regional.",
    "Foco na melhoria da saúde e educação básica.",
    "Compromisso inegociável com a transparência.",
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Simone Martini trabalhando"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-3">Quem é Simone Martini</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Uma vida dedicada ao progresso da nossa comunidade.
            </h3>
            
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed mb-8">
              <p>
                Com mais de 15 anos de atuação direta nas demandas sociais e econômicas do nosso estado, Simone Martini entende que a política deve ser um instrumento de transformação real na vida das pessoas.
              </p>
              <p>
                Sua trajetória é marcada por muito trabalho, diálogo transparente com os municípios e a busca incessante por soluções que gerem emprego, melhorem o acesso à saúde e garantam educação de qualidade para nossos jovens.
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
