"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Globe2, Landmark, GraduationCap, Heart, CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-accent-500 uppercase px-3 py-1 bg-accent-50 rounded-full border border-accent-100">
            Quem é Simone Martini
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-800 mt-4 mb-6 leading-tight">
            Trajetória, preparo técnico e compromisso com o futuro.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Simone Martini é advogada e sarandiense de 36 anos, formada pela Escola da Magistratura do Paraná e ex-procuradora-geral de Marialva. Após uma expressiva votação de 12.380 votos (2º lugar) para a prefeitura de Sarandi em 2024, consolidou-se como a única mulher pré-candidata a deputada estadual na cidade, representando a renovação, integridade e o cuidado real com a nossa gente.
          </p>
        </div>

        {/* Tab-like Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Image and Personal Traits */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-brand-50 rounded-3xl p-8 border border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-brand-800 mb-4">Além da Política</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Fora do cenário público e jurídico, a disciplina, a arte e a empatia guiam a jornada de vida de Simone Martini:
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent-500 shrink-0 shadow-sm">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Conexão e Família</h4>
                    <p className="text-sm text-slate-500">Nascida e criada em Sarandi, traz a vivência e o amor pela história e pelo desenvolvimento de sua terra natal.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent-500 shrink-0 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Piano e Arte</h4>
                    <p className="text-sm text-slate-500">Formação em piano clássico e formação profissional de atriz (Actor Studio), expressando sua sensibilidade e desenvoltura de comunicação.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent-500 shrink-0 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Disciplina no Esporte</h4>
                    <p className="text-sm text-slate-500">Praticante de Kickboxing, onde treina diariamente a resiliência, o foco e a determinação que leva para a vida pública.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-accent-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">Partido NOVO • Ficha Limpa</span>
            </div>
          </div>

          {/* Right Column: Pillars of Her Trajectory */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
            
            {/* Pillar 1: Trajetória */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-accent-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
                  <Award size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Trajetória Eleitoral</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Conquistou expressivos <strong>12.380 votos</strong> para prefeita em 2024 (2º lugar).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Construiu uma base militante ativa e engajada na cidade.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Hoje é a <strong>única mulher pré-candidata</strong> a deputada estadual por Sarandi.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: Formação Jurídica */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-accent-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
                  <GraduationCap size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Técnica & Justiça</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Graduada em Direito pela Unicesumar (OAB/PR nº 69.580).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Formada pela renomada <strong>Escola da Magistratura do PR (EMAP)</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Ex-procuradora-geral do município de Marialva (2022).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 3: Gestão Pública */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-accent-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
                  <Landmark size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Gestão de Recursos</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Atuou no Setor de Licitações da Prefeitura de Sarandi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Foi <strong>Chefe de Contratos</strong> na Secretaria de Administração (2021).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Experiência prática no combate ao desperdício e fiscalização.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 4: Vivência Global */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-accent-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6">
                  <Globe2 size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">Vivência & Liderança</h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Estudos e trabalho em Sydney, Austrália (2018–2019).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Possui <strong>diploma em Liderança e Gestão</strong> e certificação internacional.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-accent-500 shrink-0 mt-0.5" />
                    <span>Voluntariado social da AIESEC no Egito e Croácia.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
