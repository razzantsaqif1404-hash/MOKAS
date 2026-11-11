"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles } from "lucide-react";

interface DisplayArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  thumbnail: string;
  date: string;
  category: string;
}

export function NewsSection() {
  const [articles, setArticles] = useState<DisplayArticle[]>(
    siteConfig.articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      thumbnail: a.thumbnail,
      date: a.date,
      category: a.category,
    }))
  );

  const [selectedArticle, setSelectedArticle] = useState<DisplayArticle | null>(null);

  useEffect(() => {
    // Ambil berita langsung dari database
    fetch("/api/news?status=published")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: DisplayArticle[] = data.data.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            thumbnail: item.thumbnail_path || "/images/news-cek-mesin.svg",
            date: new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            category: "Tips & Edukasi",
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {
        // Fallback tetap menggunakan data dummy bawaan
      });
  }, []);

  return (
    <section id="berita" className="py-20 bg-surface-low border-t border-surface-container/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edukasi & Wawasan Otomotif</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-4xl text-on-surface">
              Berita, Panduan, & Tips Seputar Motor Second
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl">
              Pelajari tips inspeksi mandiri, cara mengecek legalitas dokumen kendaraan, dan tren harga pasar wajar sebelum membeli.
            </p>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden hover:shadow-xl hover:border-primary-fixed-dim transition-all duration-300"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-primary font-bold text-[11px] shadow-sm">
                  {article.category}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      4 mnt baca
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-container">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Article Preview Modal */}
        {selectedArticle && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          >
            <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-surface-container overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-surface-container flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs uppercase">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Tutup preview artikel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-surface-container">
                  <img
                    src={selectedArticle.thumbnail}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {selectedArticle.date}
                  </span>
                </div>

                <h3 className="font-headline font-black text-2xl text-on-surface">
                  {selectedArticle.title}
                </h3>

                <p className="text-base text-on-surface leading-relaxed">
                  {selectedArticle.excerpt}
                </p>

                {selectedArticle.content && (
                  <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line pt-2">
                    {selectedArticle.content}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container text-sm text-on-surface-variant space-y-2">
                  <p className="font-semibold text-on-surface flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Catatan Kurasi Mekanik MOKAS:</span>
                  </p>
                  <p>
                    Setiap unit di showroom MOKAS telah melalui verifikasi titik krusial ini sebelum ditampilkan ke pembeli. Pastikan Anda selalu meminta lembar inspeksi fisik saat datang ke lokasi kami.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-surface-container bg-surface-container-low flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
