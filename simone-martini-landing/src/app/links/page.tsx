"use client";

import { ExternalLink, FileText, Calendar, MessageCircle, Globe } from "lucide-react";

const links = [
  {
    icon: <FileText size={28} strokeWidth={1.8} />,
    label: "Enviar Demanda",
    description: "Envie sua solicitação diretamente para nossa equipe",
    href: "/#support",
    bg: "#E5D3C5",
    color: "#1C1B1F",
    accent: "#821E53",
  },
  {
    icon: <Globe size={28} strokeWidth={1.8} />,
    label: "Site Oficial",
    description: "Conheça nossa campanha e nossas propostas",
    href: "/",
    bg: "#3E4A5B",
    color: "#F8F9FA",
    accent: "#E5D3C5",
  },
  {
    icon: <Calendar size={28} strokeWidth={1.8} />,
    label: "Agenda de Eventos",
    description: "Veja os próximos eventos e encontros presenciais",
    href: "/#agenda",
    bg: "#821E53",
    color: "#F8F9FA",
    accent: "#E5D3C5",
  },
  {
    icon: <MessageCircle size={28} strokeWidth={1.8} />,
    label: "Fale Conosco",
    description: "Entre em contato direto via WhatsApp",
    href: "https://wa.me/5500000000000",
    bg: "#1C1B1F",
    color: "#F8F9FA",
    accent: "#E5D3C5",
  },
];

export default function LinksPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(160deg, #3E4A5B 0%, #1C1B1F 100%)",
      }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-5">

        {/* Profile */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div
            className="w-24 h-24 rounded-full border-4 shadow-xl"
            style={{
              borderColor: "#821E53",
              backgroundImage: "url('https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/foto%20links.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#F8F9FA" }}
            >
              Simone Martini
            </h1>
            <p
              className="text-sm font-medium mt-0.5"
              style={{ color: "#E5D3C5" }}
            >
              Pré-candidata a Deputada Estadual PR
            </p>
            <p
              className="text-sm font-extrabold mt-1 tracking-widest uppercase"
              style={{ color: "#F97316" }}
            >
              Partido NOVO
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              style={{ backgroundColor: link.bg }}
            >
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: link.accent, color: link.bg }}
              >
                {link.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-base leading-tight"
                  style={{ color: link.color }}
                >
                  {link.label}
                </p>
                <p
                  className="text-xs mt-0.5 leading-snug opacity-75 truncate"
                  style={{ color: link.color }}
                >
                  {link.description}
                </p>
              </div>

              {/* Arrow */}
              <ExternalLink
                size={16}
                className="flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ color: link.color }}
              />
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs mt-4" style={{ color: "#E5D3C5", opacity: 0.45 }}>
          © 2026 Simone Martini · Todos os direitos reservados
        </p>
      </div>
    </main>
  );
}
