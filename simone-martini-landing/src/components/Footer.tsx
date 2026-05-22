"use client";

import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold text-sm">
                SM
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Simone Martini
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              A força da renovação e do cuidado real no Paraná. Trabalho, ética e desenvolvimento regional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Acesso Rápido</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#about" className="hover:text-accent-400 transition-colors">Quem Sou</a></li>
              <li><a href="/#proposals" className="hover:text-accent-400 transition-colors">Bandeiras</a></li>
              <li><a href="/#support" className="hover:text-accent-400 transition-colors">Enviar Demanda</a></li>
              <li><a href="/politica-de-privacidade" className="hover:text-accent-400 transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Acompanhe nas Redes</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          
        </div>

        {/* Legal / Bottom */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p>Simone Martini - Pré-candidata a Deputada Estadual.</p>
            <p>CNPJ: 00.000.000/0000-00 | Coligação Exemplo / Partido Exemplo</p>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido com excelência por sua equipe.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
