"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const events = [
  {
    date: "15 de Outubro",
    time: "19:00",
    title: "Plenária Regional do Centro",
    location: "Sindicato dos Trabalhadores, Centro",
    type: "Reunião Pública"
  },
  {
    date: "18 de Outubro",
    time: "09:00",
    title: "Caminhada da Renovação",
    location: "Praça da Matriz, Bairro Alto",
    type: "Ação de Rua"
  },
  {
    date: "22 de Outubro",
    time: "14:30",
    title: "Encontro com Mulheres Empreendedoras",
    location: "Associação Comercial (ACIC)",
    type: "Diálogo Setorial"
  },
];

export function Agenda() {
  return (
    <section id="agenda" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-brand-700 uppercase mb-3">Agenda</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
              Próximos passos da nossa jornada
            </h3>
          </div>

        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-brand-100 pl-6 md:pl-8 space-y-12">
            
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] md:-left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-brand-500 shadow-sm"></div>
                
                <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h4 className="text-xl font-bold text-slate-900">{event.title}</h4>
                    <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full uppercase tracking-wider w-fit">
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-brand-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-brand-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-brand-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
        
      </div>
    </section>
  );
}
