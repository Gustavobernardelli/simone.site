"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  MapPin, 
  HeartHandshake, 
  Briefcase, 
  GraduationCap, 
  Activity, 
  ShieldAlert, 
  Sprout, 
  Road,
  ArrowRight
} from "lucide-react";

const frentes = [
  {
    icon: Sparkles,
    title: "Renovação Política",
    description: "Gestão pública eficiente, com rigor técnico e transparência fiscal, sob a bandeira de integridade do partido NOVO.",
  },
  {
    icon: UserCheck,
    title: "Representatividade Feminina",
    description: "Mulheres qualificadas e com propósito ocupando a política. Única pré-candidata a deputada estadual saindo de Sarandi.",
  },
  {
    icon: ShieldCheck,
    title: "Combate à Corrupção",
    description: "Foco absoluto na ética e na transparência de recursos, com apoio e forte alinhamento com Sergio Moro e Deltan Dallagnol.",
  },
  {
    icon: MapPin,
    title: "A Voz de Sarandi na ALEP",
    description: "Uma reparação histórica: eleger pela primeira vez uma deputada de Sarandi para lutar diretamente por nossa região na Assembleia.",
  },
];

const bandeiras = [
  {
    icon: Activity,
    title: "Saúde da Mulher & Endometriose",
    description: "Apoio e conscientização sobre a endometriose (que afeta 1 em cada 10 mulheres), facilitando o diagnóstico e o acesso ao tratamento adequado."
  },
  {
    icon: HeartHandshake,
    title: "Apoio e Empreendedorismo Feminino",
    description: "Programas de incentivo ao mercado de trabalho, suporte à maternidade e redes de acolhimento contra a violência doméstica."
  },
  {
    icon: GraduationCap,
    title: "Educação & Ensino Estadual",
    description: "Modernização das escolas estaduais, valorização profissional dos professores e incentivo à formação técnica dos jovens."
  },
  {
    icon: ShieldAlert,
    title: "Segurança Pública Integrada",
    description: "Integração estratégica entre forças estaduais e a Guarda Municipal, garantindo mais policiamento nos bairros."
  },
  {
    icon: Sprout,
    title: "Desenvolvimento e Agronegócio",
    description: "Geração de empregos no interior do estado e apoio direto ao agronegócio como motor do crescimento econômico regional."
  },
  {
    icon: Road,
    title: "Infraestrutura de Sarandi e Região",
    description: "Articulação de investimentos estaduais para pavimentação, saneamento e mobilidade urbana para o desenvolvimento local."
  }
];

export function Proposals() {
  return (
    <>
      <section id="proposals" className="py-24 bg-[#0B0214] relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 -translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl opacity-30 z-0 pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-3xl opacity-30 z-0 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Section 1: Frentes de Atuação */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-accent-400 uppercase px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              Pilares do Projeto
            </span>
            <h3 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
              As 4 Frentes de Atuação
            </h3>
            <p className="text-lg text-slate-300">
              Valores sólidos e compromisso inegociável com a renovação ética no Paraná.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {frentes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 rounded-3xl p-8 hover:bg-white/[0.08] hover:-translate-y-2 transition-all duration-300 border border-white/5 hover:border-accent-500/30 hover:shadow-2xl hover:shadow-accent-500/5 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent-400 mb-6 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="flags" className="py-24 bg-brand-50/50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section 2: Bandeiras */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-accent-500 uppercase px-3 py-1 bg-accent-50 rounded-full border border-accent-100">
              Nossas Bandeiras
            </span>
            <h3 className="text-3xl md:text-5xl font-bold text-brand-800 mt-4 mb-6">
              O que Simone Martini Defende
            </h3>
            <p className="text-lg text-slate-600">
              Ações práticas voltadas para a saúde, segurança, educação e o desenvolvimento econômico do nosso povo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bandeiras.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-accent-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-500 shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
