"use client";

import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, ShieldCheck, Users } from "lucide-react";

const proposals = [
  {
    icon: TrendingUp,
    title: "Desenvolvimento Regional",
    description: "Atração de novos investimentos e incentivos fiscais para fortalecer o comércio local e gerar empregos diretos em nossa região.",
  },
  {
    icon: Lightbulb,
    title: "Inovação na Educação",
    description: "Programas de modernização das escolas estaduais, capacitação de professores e inclusão digital para todos os alunos.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência Total",
    description: "Mandato aberto com prestação de contas mensal e ferramentas digitais para que o cidadão acompanhe cada projeto e votação.",
  },
  {
    icon: Users,
    title: "Comunidade Fortalecida",
    description: "Apoio a projetos sociais, saúde preventiva e infraestrutura básica, garantindo qualidade de vida desde os bairros até os centros.",
  },
];

export function Proposals() {
  return (
    <section id="proposals" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-3">Nossos Pilares</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Projetos reais para problemas reais
          </h3>
          <p className="text-lg text-slate-600">
            Acreditamos que a política deve apresentar soluções concretas. Estes são os eixos centrais do nosso compromisso com o estado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {proposals.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 group"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
