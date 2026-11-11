import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { CatalogSection } from "@/components/CatalogSection";
import { NewsSection } from "@/components/NewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <CatalogSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

