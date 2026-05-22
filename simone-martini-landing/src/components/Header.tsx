"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Quem Sou", href: "#about" },
    { name: "Bandeiras", href: "#proposals" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-white/5 py-1"
          : "bg-transparent py-2"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <img
            src="https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/logo%20branca.png"
            alt="Simone Martini"
            className="h-[108px] md:h-[130px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 -ml-[26px] md:-ml-[31px] -my-[22px] md:-my-[29px]"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/90 hover:text-accent-400 transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#support"
            className="px-6 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-bold rounded-full hover:from-accent-600 hover:to-accent-700 shadow-md hover:shadow-lg hover:shadow-accent-500/20 transition-all transform hover:-translate-y-0.5 duration-300"
          >
            Enviar demanda
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-md shadow-lg py-4 px-4 flex flex-col gap-4 border-t border-white/5 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-white/90 p-2 hover:bg-white/5 hover:text-accent-400 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#support"
            className="w-full text-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-base font-bold rounded-md hover:from-accent-600 hover:to-accent-700 mt-2 transition-all shadow-md active:scale-95"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Enviar demanda
          </a>
        </div>
      )}
    </header>
  );
}
