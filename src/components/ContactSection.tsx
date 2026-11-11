import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Navigation,
  ExternalLink,
} from "lucide-react";

export function ContactSection() {
  return (
    <section id="kontak" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5" />
            <span>Kunjungi Showroom Kami</span>
          </div>
          <h2 className="font-headline font-black text-3xl sm:text-4xl text-on-surface">
            Lokasi & Layanan Konsultasi
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed">
            Silakan datang langsung untuk melihat unit, cek kelengkapan dokumen, atau lakukan test drive ditemani mekanik kami.
          </p>
        </div>

        {/* 2 Column Layout: Details and Google Maps Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="p-7 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Alamat Showroom
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark mt-2"
                  >
                    <span>Buka Petunjuk Arah di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-surface-container">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Jam Operasional
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {siteConfig.contact.hours}
                  </p>
                  <span className="inline-block mt-1 text-xs font-semibold text-tertiary">
                    Buka setiap hari termasuk hari libur
                  </span>
                </div>
              </div>

              {/* Telephone & Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-surface-container">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Telepon & WhatsApp
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {siteConfig.contact.phone}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Email: {siteConfig.contact.email}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick WhatsApp Action Banner */}
            <div className="p-6 rounded-3xl bg-primary text-white shadow-lg space-y-3">
              <h4 className="font-headline font-bold text-lg">
                Ingin Janjian Cek Unit Hari Ini?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Hubungi kami sebelum berkunjung agar mekanik kami dapat menyiapkan unit dan lembar hasil inspeksi terlebih dahulu.
              </p>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  "Halo MOKAS, saya berencana datang ke showroom untuk melihat unit motor. Tolong info ketersediaan slotnya ya."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-surface-container-low transition-all"
              >
                <MessageSquare className="w-4 h-4 text-tertiary" />
                <span>Janjian via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed Iframe */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[450px] lg:h-full min-h-[420px] rounded-3xl overflow-hidden border border-surface-container shadow-md bg-surface-container">
              {/* Google Maps iframe with accessibility title and lazy loading */}
              <iframe
                title="Peta Lokasi Showroom MOKAS Motor Bekas Berkualitas"
                src={siteConfig.contact.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Floating Maps Overlay Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-surface-container flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <p className="font-headline font-bold text-xs text-on-surface">
                    Showroom MOKAS
                  </p>
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>Buka Rute Navigasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

