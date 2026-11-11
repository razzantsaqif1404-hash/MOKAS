"use client";

import { useState, useEffect } from "react";
import {
  Ticket,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  X,
  MapPin,
  ExternalLink,
  Filter,
} from "lucide-react";

interface OrderItem {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_whatsapp: string;
  user_address?: string;
  motorcycle_id: string;
  motorcycle_name: string;
  total_price: number | string;
  order_type?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  notes?: string;
  cancel_reason?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal Detail / Konfirmasi
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Modal Batalkan
  const [orderToCancel, setOrderToCancel] = useState<OrderItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal memuat data pesanan: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: "dikonfirmasi" | "dibatalkan", reason?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          cancel_reason: reason || "",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal mengubah status tiket." });
        setSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        message: `Tiket pesanan berhasil diubah menjadi ${nextStatus.toUpperCase()}!`,
      });

      setSelectedOrder(null);
      setOrderToCancel(null);
      setCancelReason("");
      fetchOrders();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      o.user_name.toLowerCase().includes(search.toLowerCase()) ||
      o.user_whatsapp.toLowerCase().includes(search.toLowerCase()) ||
      o.motorcycle_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCleanWaLink = (phone: string, ticket: string, name: string, motor: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    const text = `Halo Kak ${name}, kami dari Admin Showroom MOKAS menindaklanjuti tiket booking unit:
- Nomor Tiket: ${ticket}
- Unit Motor: ${motor}
- Nominal Tanda Jadi: Rp 200.000

Apakah ada yang bisa kami bantu terkait jadwal kunjungan cek fisik unit di showroom kami?`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
            Kelola Tiket Pesanan & Booking Unit
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Verifikasi transfer tanda jadi QRIS Rp 200.000 dan jadwalkan cek fisik calon pembeli
          </p>
        </div>
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
          <button onClick={() => setFeedback(null)} className="p-1 hover:bg-black/10 rounded-lg text-xs">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["all", "menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {st === "all"
                ? "Semua Tiket"
                : st === "menunggu_konfirmasi"
                ? "Menunggu Konfirmasi"
                : st === "dikonfirmasi"
                ? "Dikonfirmasi"
                : "Dibatalkan"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari no tiket, pemesan, motor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-3.5 px-6">Tiket & Tanggal</th>
                <th className="py-3.5 px-6">Pemesan & Kontak</th>
                <th className="py-3.5 px-6">Unit Motor</th>
                <th className="py-3.5 px-6">Tanda Jadi</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    Memuat daftar tiket masuk...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    Tidak ada pesanan tiket yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                    {/* Tiket */}
                    <td className="py-4 px-6">
                      <p className="font-mono font-bold text-primary">{order.ticket_number}</p>
                      <p className="text-[11px] text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Pemesan */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-on-surface">{order.user_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-on-surface-variant">{order.user_whatsapp}</span>
                        <a
                          href={getCleanWaLink(order.user_whatsapp, order.ticket_number, order.user_name, order.motorcycle_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat via WhatsApp"
                          className="p-1 rounded-md bg-tertiary-container/15 text-tertiary hover:bg-tertiary-container/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Unit Motor */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-on-surface">{order.motorcycle_name}</p>
                      <p className="text-[11px] text-primary">{order.order_type || "Cek Fisik di Showroom"}</p>
                    </td>

                    {/* Nominal */}
                    <td className="py-4 px-6 font-headline font-bold text-on-surface whitespace-nowrap">
                      Rp 200.000
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "dikonfirmasi"
                            ? "bg-tertiary-container/20 text-tertiary"
                            : order.status === "dibatalkan"
                            ? "bg-error-container/30 text-error"
                            : "bg-amber-500/15 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "dikonfirmasi"
                              ? "bg-tertiary"
                              : order.status === "dibatalkan"
                              ? "bg-error"
                              : "bg-amber-600 animate-pulse"
                          }`}
                        />
                        <span>
                          {order.status === "dikonfirmasi"
                            ? "Dikonfirmasi"
                            : order.status === "dibatalkan"
                            ? "Dibatalkan"
                            : "Menunggu"}
                        </span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === "menunggu_konfirmasi" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, "dikonfirmasi")}
                              className="px-3 py-1.5 rounded-xl bg-tertiary hover:bg-tertiary-container text-white font-bold text-xs shadow-sm transition-all"
                              title="Konfirmasi Pembayaran QRIS"
                            >
                              Konfirmasi
                            </button>
                            <button
                              onClick={() => setOrderToCancel(order)}
                              className="px-3 py-1.5 rounded-xl border border-error/30 text-error hover:bg-error-container/30 font-bold text-xs transition-colors"
                              title="Tolak / Batalkan Pesanan"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        <a
                          href={getCleanWaLink(order.user_whatsapp, order.ticket_number, order.user_name, order.motorcycle_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-tertiary" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Batalkan / Tolak Pesanan */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-container space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline font-bold text-lg text-on-surface text-error flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Batalkan Tiket Pesanan</span>
              </h3>
              <button onClick={() => setOrderToCancel(null)} className="p-1.5 rounded-lg hover:bg-surface-container">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Anda akan membatalkan tiket <strong>{orderToCancel.ticket_number}</strong> ({orderToCancel.user_name} - {orderToCancel.motorcycle_name}).
            </p>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Alasan Pembatalan (Akan tampil pada pembeli)
              </label>
              <textarea
                rows={3}
                required
                placeholder="Contoh: Bukti transfer QRIS tidak sesuai / unit sudah laku terjual sebelumnya..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2.5 rounded-xl border border-surface-container text-xs font-bold hover:bg-surface-container"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleUpdateStatus(orderToCancel.id, "dibatalkan", cancelReason)}
                className="px-5 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Ya, Batalkan Pesanan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

