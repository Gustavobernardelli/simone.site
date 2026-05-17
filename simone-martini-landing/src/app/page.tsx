import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Proposals } from "@/components/Proposals";
import { Agenda } from "@/components/Agenda";
import { SupportForm } from "@/components/SupportForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <About />
      {/* <Proposals /> */}
      {/* <Agenda /> */}
      <SupportForm />
      <Footer />
    </main>
  );
}
