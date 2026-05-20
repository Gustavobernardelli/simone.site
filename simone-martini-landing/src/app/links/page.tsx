"use client";

const links = [
  {
    image: "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/link1.png",
    href: "/#support",
    alt: "Enviar Demanda",
  },
  {
    image: "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/link1.png",
    href: "/",
    alt: "Site Oficial",
  },
  {
    image: "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/link3.png",
    href: "/#agenda",
    alt: "Agenda de Eventos",
  },
  {
    image: "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/link4.png",
    href: "https://wa.me/5500000000000",
    alt: "Fale Conosco",
  },
  {
    image: "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/link4.png",
    href: "#",
    alt: "Link 5",
  },
];

export default function LinksPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #3E4A5B 0%, #1C1B1F 100%)" }}
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
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#F8F9FA" }}>
              Simone Martini
            </h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: "#E5D3C5" }}>
              Pré-candidata a Deputada Estadual PR
            </p>
            <p className="text-sm font-extrabold mt-1 tracking-widest uppercase" style={{ color: "#F97316" }}>
              Partido NOVO
            </p>
          </div>
        </div>

        {/* Image links */}
        <div className="w-full flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="w-full block rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <img
                src={link.image}
                alt={link.alt}
                className="w-full h-auto block"
                draggable={false}
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
