"use client";

import { useState, useEffect, useRef } from "react";
import {
  Newspaper,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Image as ImageIcon,
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export default function NewsManagementPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("/images/news-cek-mesin.svg");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal Preview
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  // Modal Delete
  const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success) {
        setNewsList(data.data);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal memuat artikel: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setThumbnailPath("/images/news-cek-mesin.svg");
    setStatus("published");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setThumbnailPath(item.thumbnail_path);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal mengunggah gambar." });
        return;
      }

      setThumbnailPath(data.url);
      setFeedback({ type: "success", message: "Gambar berhasil diunggah ke folder lokal!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal mengunggah gambar: " + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/news/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt,
            content,
            thumbnail_path: thumbnailPath,
            status,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFeedback({ type: "error", message: data.message || "Gagal memperbarui artikel." });
          setSubmitting(false);
          return;
        }
        setFeedback({ type: "success", message: "Artikel berhasil diperbarui!" });
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt,
            content,
            thumbnail_path: thumbnailPath,
            status,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setFeedback({ type: "error", message: data.message || "Gagal membuat artikel." });
          setSubmitting(false);
          return;
        }
        setFeedback({ type: "success", message: "Artikel baru berhasil diterbitkan!" });
      }

      setIsModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNews = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/news/${itemToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal menghapus artikel." });
        setItemToDelete(null);
        return;
      }
      setFeedback({ type: "success", message: "Artikel berhasil dihapus." });
      setItemToDelete(null);
      fetchNews();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      setItemToDelete(null);
    }
  };

  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
            Kelola Berita & Artikel Edukasi
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Publikasikan tips memilih motor second, panduan dokumen, dan update showroom ke landing page
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm ${
            feedback.type === "success"
              ? "bg-tertiary-container/20 text-tertiary border border-tertiary/30"
              : "bg-error-container/40 text-error border border-error/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-black/10 rounded-lg text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["all", "published", "draft"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {st === "all" ? "Semua Status" : st === "published" ? "Terbit (Published)" : "Draf (Draft)"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-3.5 px-6">Artikel</th>
                <th className="py-3.5 px-6">Ringkasan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Tanggal Rilis</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Memuat daftar berita...
                  </td>
                </tr>
              ) : filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Tidak ada artikel yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 border border-surface-container">
                          <img
                            src={item.thumbnail_path || "/images/news-cek-mesin.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-on-surface line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-primary truncate font-mono">/{item.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Excerpt */}
                    <td className="py-4 px-6 text-xs text-on-surface-variant max-w-sm line-clamp-2">
                      {item.excerpt}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === "published" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                          Terbit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                          Draf
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-on-surface-variant whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container"
                          title="Pratinjau Artikel"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10"
                          title="Edit Artikel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container/30"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit News */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                <span>{editingItem ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 5 Tips Mengecek BPKB dan STNK Asli Sebelum Beli Motor Bekas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              {/* Thumbnail Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Thumbnail Artikel
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-surface-container overflow-hidden border border-surface-container flex-shrink-0">
                    <img
                      src={thumbnailPath}
                      alt="Pratinjau Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors"
                    >
                      <Upload className="w-4 h-4 text-primary" />
                      <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar Baru"}</span>
                    </button>
                    <p className="text-[11px] text-on-surface-variant">
                      File tersimpan lokal di <code>public/uploads/</code> (Maks. 5 MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ulasan 1-2 kalimat pengantar artikel yang akan tampil di kartu depan..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Isi Lengkap Artikel
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi artikel edukasi motor second secara mendalam..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Status Publikasi
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={status === "published"}
                      onChange={() => setStatus("published")}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Terbitkan Langsung (Published)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Simpan Sebagai Draf (Draft)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan & Terapkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                Pratinjau Artikel: {previewItem.status.toUpperCase()}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-surface-container border border-surface-container">
              <img
                src={previewItem.thumbnail_path}
                alt={previewItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-headline font-black text-2xl text-on-surface">
              {previewItem.title}
            </h3>

            <p className="text-xs text-on-surface-variant font-medium">
              Rilis: {new Date(previewItem.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            <div className="p-4 rounded-2xl bg-surface-container-low text-xs sm:text-sm text-on-surface italic">
              {previewItem.excerpt}
            </div>

            <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line pt-2">
              {previewItem.content}
            </div>

            <div className="pt-4 border-t border-surface-container flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface rounded-3xl p-6 shadow-2xl border border-surface-container space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Hapus Artikel Ini?
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus artikel <strong>&quot;{itemToDelete.title}&quot;</strong>? Artikel tidak akan lagi tampil di landing page.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteNews}
                className="px-5 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

