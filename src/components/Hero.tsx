import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles, MessageCircle, Search } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-tertiary/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/60 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
                Bursa Motor Bekas Terpercaya #1
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Garansi Resmi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-on-surface leading-[1.12]">
              Beli Motor Second{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">
                Berkualitas & Bergaransi
              </span>{" "}
              Tanpa Was-was.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {siteConfig.description}
            </p>

            {/* Value Checkmarks */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-y-2 gap-x-6 text-sm font-semibold text-on-surface">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tertiary flex-shrink-0" />
                <span>Inspeksi 100+ Titik Mesin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tertiary flex-shrink-0" />
                <span>STNK & BPKB 100% Sah</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tertiary flex-shrink-0" />
                <span>Bebas Banjir & Bebas Laka</span>
              </div>
            </div>

            {/* Main CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Search className="w-5 h-5 text-secondary-container" />
                <span>Eksplor Stok Motor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  "Halo MOKAS, saya mau tanya stok motor bekas berkualitas dan simulasi tukar tambah."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-on-surface font-semibold text-base transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-tertiary" />
                <span>Tukar Tambah / Jual Cepat</span>
              </a>
            </div>

            {/* Stats Bar */}
            <div className="pt-6 border-t border-surface-container grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
              {siteConfig.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-headline font-black text-2xl sm:text-3xl text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-on-surface-variant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Bike Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card Container */}
              <div className="rounded-3xl bg-surface-container-lowest p-4 sm:p-5 shadow-xl border border-surface-container">
                {/* Floating Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/15 text-tertiary font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>UNIT PILIHAN MINGGU INI</span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Inspeksi Grade A
                  </span>
                </div>

                {/* Bike Image Container */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container">
                  <img
                    src="/images/motor-mt07.svg"
                    alt="Yamaha MT-07 ABS Motor Bekas Berkualitas MOKAS"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-tertiary font-bold text-[11px] shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-tertiary" /> MOKAS Certified
                    </span>
                  </div>
                </div>

                {/* Unit Details */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-headline font-bold text-xl text-on-surface">
                        2022 Yamaha MT-07 ABS
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Odometer: 8.400 km • Rawatan Bengkel Resmi
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-headline font-extrabold text-xl text-primary">
                        Rp 98.500.000
                      </div>
                      <span className="text-[11px] font-semibold text-tertiary">
                        Nego Tipis
                      </span>
                    </div>
                  </div>

                  {/* Benchmark & Verification Ribbon */}
                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant font-medium">
                      Harga Pasaran Wajar MOKAS:
                    </span>
                    <span className="font-bold text-on-surface">
                      Rp 95jt – 105jt (Akurat 97%)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/booking?bike=mokas-001"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md transition-all active:scale-95"
                    >
                      <span>Booking & Kunci Unit (Rp 200rb)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                        "Halo MOKAS, saya mau janjian cek fisik dan test drive unit 2022 Yamaha MT-07 ABS."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-tertiary" />
                      <span>Chat WhatsApp Admin (+62 812-8664-0201)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

