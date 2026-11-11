import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  FileCheck2,
  Wrench,
  BadgePercent,
  RefreshCw,
  Truck,
  Award,
  CheckCircle,
} from "lucide-react";

export function About() {
  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-primary" />,
    FileCheck2: <FileCheck2 className="w-6 h-6 text-primary" />,
    Wrench: <Wrench className="w-6 h-6 text-primary" />,
    BadgePercent: <BadgePercent className="w-6 h-6 text-primary" />,
    RefreshCw: <RefreshCw className="w-6 h-6 text-primary" />,
    Truck: <Truck className="w-6 h-6 text-primary" />,
  };

  return (
    <section id="about" className="py-20 bg-surface-low border-y border-surface-container/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Standar Baru Pasar Motor Second</span>
          </div>
          <h2 className="font-headline font-black text-3xl sm:text-4xl text-on-surface">
            Kenapa Memilih Motor Bekas di <span className="text-primary">{siteConfig.name}</span>?
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed">
            Membeli motor second sering kali membuat cemas soal riwayat mesin atau keaslian surat.
            Di MOKAS, kami mengeliminasi semua risiko tersebut lewat proses kurasi profesional,
            transparansi tanpa rahasia, serta jaminan purna jual terpercaya.
          </p>
        </div>

        {/* 6 Core Value Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {siteConfig.values.map((item, idx) => (
            <div
              key={idx}
              className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-primary-fixed-dim hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-5 group-hover:bg-primary-container/15 transition-colors">
                {iconMap[item.icon] || <ShieldCheck className="w-6 h-6 text-primary" />}
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary-container">
              <CheckCircle className="w-4 h-4" />
              <span>GARANSI UANG KEMBALI</span>
            </div>
            <h4 className="font-headline font-black text-xl sm:text-2xl">
              100% Bebas Riwayat Tabrakan Parah & Terendam Banjir
            </h4>
            <p className="text-sm text-white/80 max-w-xl">
              Jika terbukti unit pernah bekas laka berat rangka atau eks rendaman banjir, unit dapat dikembalikan penuh tanpa potongan.
            </p>
          </div>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
              "Halo Admin MOKAS, saya ingin tahu lebih lanjut mengenai prosedur garansi dan inspeksi unit motor."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm shadow-md hover:bg-surface-container-low transition-all active:scale-95"
          >
            Pelajari Prosedur Garansi
          </a>
        </div>

      </div>
    </section>
  );
}

