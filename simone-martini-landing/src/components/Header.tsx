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
    // { name: "Propostas", href: "#proposals" },
    // { name: "Agenda", href: "#agenda" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xl group-hover:bg-brand-600 transition-colors">
            SM
          </div>
          <span className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">
            Simone <span className="text-brand-700">Martini</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#support"
            className="px-6 py-2.5 bg-brand-700 text-white text-sm font-semibold rounded-full hover:bg-brand-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Enviar demanda
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col gap-4 border-t border-slate-100 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-slate-700 p-2 hover:bg-slate-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#support"
            className="w-full text-center px-6 py-3 bg-brand-700 text-white text-base font-semibold rounded-md hover:bg-brand-600 mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Enviar demanda
          </a>
        </div>
      )}
    </header>
  );
}
