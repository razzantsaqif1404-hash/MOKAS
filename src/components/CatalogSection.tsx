"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Gauge,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Ticket,
} from "lucide-react";

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "Semua Motor" },
    { id: "Yamaha", label: "Yamaha" },
    { id: "Honda", label: "Honda" },
    { id: "Vespa", label: "Vespa" },
    { id: "Kawasaki", label: "Kawasaki" },
  ];

  const filteredBikes = siteConfig.featuredMotorcycles.filter((bike) => {
    const matchesCategory =
      selectedCategory === "all" || bike.brand.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="katalog" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-surface-container">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Showroom Ready Stock</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-4xl text-on-surface">
              Koleksi Unit Motor Second Pilihan
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
              Unit terinspeksi siap pakai, dokumen lengkap, dan siap antar langsung ke depan pintu rumah Anda.
            </p>
          </div>

          {/* Direct Valuation Banner */}
          <div className="flex-shrink-0 p-4 rounded-2xl bg-surface-container-low border border-surface-container flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">
                Mau Jual Motor Lama Anda?
              </p>
              <p className="text-xs text-on-surface-variant">
                Taksiran harga instan & cair cepat hari ini.
              </p>
            </div>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                "Halo Admin MOKAS, saya mau minta taksiran harga untuk jual/tukar tambah motor lama saya."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1"
            >
              <span>Jual Cepat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Brand Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari Yamaha, Honda, Vespa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Grid of Motorcycle Cards */}
        {filteredBikes.length === 0 ? (
          <div className="mt-16 text-center py-12 bg-surface-container-low rounded-3xl border border-surface-container">
            <p className="font-headline font-bold text-lg text-on-surface">
              Tidak ada unit yang cocok dengan pencarian &quot;{searchQuery}&quot;
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              Silakan reset filter atau hubungi kami via WhatsApp untuk mencari motor pesanan khusus.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredBikes.map((bike) => (
              <article
                key={bike.id}
                className="group flex flex-col rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden hover:shadow-xl hover:border-primary-fixed-dim transition-all duration-300"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                  <img
                    src={bike.image}
                    alt={`${bike.model} - Motor Bekas Berkualitas MOKAS`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-tertiary font-bold text-[11px] shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" /> MOKAS Certified
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-primary/90 text-white font-bold text-[11px] shadow-sm">
                      {bike.cc}
                    </span>
                  </div>

                  {/* Location Tag */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-secondary-container" />
                    <span>{bike.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header: Title & Brand */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {bike.brand}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                        Tahun {bike.year}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-xl text-on-surface group-hover:text-primary transition-colors">
                      {bike.model}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">
                      {bike.description}
                    </p>

                    {/* Spec Highlights Grid */}
                    <div className="mt-4 pt-4 border-t border-surface-container grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-primary" />
                        <span>Odo: <strong className="text-on-surface">{bike.odometer}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Transmisi: <strong className="text-on-surface">{bike.transmission}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-headline font-black text-xl text-primary">
                        {bike.priceDisplay}
                      </div>
                      <div className="text-[11px] font-semibold text-tertiary">
                        {bike.priceNote}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/booking?bike=${bike.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Booking Rp 200rb</span>
                      </Link>

                      <a
                        href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                          `Halo MOKAS, saya mau tanya ketersediaan dan negosiasi unit ${bike.model} (${bike.priceDisplay}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2.5 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all"
                        title="Tanya Unit via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-tertiary" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

