import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-lowest border-t border-surface-container mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="#hero" className="inline-block">
              <img
                src={siteConfig.logo}
                alt="Logo MOKAS"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-tertiary">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span>Standar Inspeksi Profesional & Transparansi Dokumen Resmi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm text-on-surface-variant">
              {siteConfig.navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
              Kontak Showroom
            </h4>
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} ({siteConfig.tagline}). Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-tertiary font-semibold">100% Bebas Laka & Banjir</span>
            <span className="text-outline-variant">•</span>
            <span>Vercel Ready Deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

