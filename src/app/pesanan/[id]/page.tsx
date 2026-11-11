"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface OrderDetail {
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

export default function OrderTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || "Tiket pesanan tidak ditemukan.");
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const copyTicket = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.ticket_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-on-surface-variant">Memuat rincian tiket pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-headline font-bold text-xl text-on-surface">Tiket Tidak Ditemukan</h2>
        <p className="text-xs text-on-surface-variant">{error || "Data pesanan tidak dapat diakses."}</p>
        <Link
          href="/pesanan"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
      </div>
    );
  }

  const waConfirmMessage = `Halo Admin MOKAS, saya sudah melakukan pembayaran tanda jadi booking unit:
- Nomor Tiket: ${order.ticket_number}
- Nama Pemesan: ${order.user_name}
- Unit Motor: ${order.motorcycle_name}
- Nominal: Rp 200.000 (Tanda Jadi Cek Fisik)

Berikut saya lampirkan bukti transfer QRIS-nya. Mohon dikonfirmasi ya, terima kasih.`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/pesanan"
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pesanan Saya</span>
        </Link>

        <span className="text-xs text-on-surface-variant">
          Waktu Pemesanan: {new Date(order.created_at).toLocaleString("id-ID")}
        </span>
      </div>

      {/* Status Banners */}
      {order.status === "dikonfirmasi" && (
        <div className="p-6 rounded-3xl bg-tertiary-container/25 border-2 border-tertiary/40 shadow-sm space-y-2">
          <div className="flex items-center gap-2.5 text-tertiary font-black text-lg sm:text-xl">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <span>Selamat, pembayaran Anda telah dikonfirmasi!</span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
            Silakan tunggu informasi selanjutnya dari admin melalui WhatsApp/Email. Anda dapat langsung datang ke showroom untuk melakukan cek fisik dan test drive unit motor impian Anda.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <a
              href={siteConfig.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tertiary text-white font-bold text-xs hover:bg-tertiary/90 transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Buka Petunjuk Arah Showroom (Google Maps)</span>
            </a>
          </div>
        </div>
      )}

      {order.status === "menunggu_konfirmasi" && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-sm space-y-2">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base sm:text-lg">
            <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 animate-pulse" />
            <span>Menunggu Pembayaran Tanda Jadi (Booking Fee)</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
            Silakan selesaikan pembayaran sebesar <strong>Rp 200.000</strong> melalui QRIS resmi MOKAS di bawah ini, kemudian kirimkan tangkapan layar bukti bayar ke WhatsApp Admin untuk mengaktifkan status tiket Anda.
          </p>
        </div>
      )}

      {order.status === "dibatalkan" && (
        <div className="p-6 rounded-3xl bg-error-container/40 border border-error/30 text-error space-y-1">
          <div className="flex items-center gap-2 font-bold text-base">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Pesanan Telah Dibatalkan</span>
          </div>
          <p className="text-xs text-error/90">
            Alasan pembatalan: {order.cancel_reason || "Dibatalkan oleh sistem atau permintaan pemohon."}
          </p>
        </div>
      )}

      {/* Main Ticket Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Ticket Details */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container shadow-sm space-y-6">
          
          {/* Header Tiket */}
          <div className="flex items-start justify-between pb-4 border-b border-surface-container">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Nomor Tiket Pemesanan
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-black text-xl sm:text-2xl text-primary">
                  {order.ticket_number}
                </span>
                <button
                  onClick={copyTicket}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                  title="Salin Nomor Tiket"
                >
                  {copied ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "dikonfirmasi"
                  ? "bg-tertiary-container/20 text-tertiary"
                  : order.status === "dibatalkan"
                  ? "bg-error-container/30 text-error"
                  : "bg-amber-500/15 text-amber-700"
              }`}
            >
              {order.status === "dikonfirmasi"
                ? "DIKONFIRMASI"
                : order.status === "dibatalkan"
                ? "DIBATALKAN"
                : "MENUNGGU PEMBAYARAN"}
            </span>
          </div>

          {/* Rincian Pesanan */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-surface-container/60">
              <span className="text-on-surface-variant">Unit Motor:</span>
              <span className="font-bold text-on-surface text-right">{order.motorcycle_name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-container/60">
              <span className="text-on-surface-variant">Nama Pemesan:</span>
              <span className="font-semibold text-on-surface">{order.user_name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-container/60">
              <span className="text-on-surface-variant">WhatsApp Pemesan:</span>
              <span className="font-semibold text-on-surface">{order.user_whatsapp}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-container/60">
              <span className="text-on-surface-variant">Alamat Domisili:</span>
              <span className="font-semibold text-on-surface text-right max-w-xs">{order.user_address || "-"}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-container/60">
              <span className="text-on-surface-variant">Jenis Layanan:</span>
              <span className="font-bold text-primary">{order.order_type || "Cek Fisik di Showroom"}</span>
            </div>

            {order.notes && (
              <div className="flex justify-between py-1 border-b border-surface-container/60">
                <span className="text-on-surface-variant">Catatan Tambahan:</span>
                <span className="text-on-surface text-right max-w-xs">{order.notes}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-on-surface">Total Tanda Jadi (Booking Fee):</span>
              <span className="font-headline font-black text-2xl text-primary">
                Rp 200.000
              </span>
            </div>
          </div>

          {/* Lokasi Showroom Google Maps */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1 text-xs">
            <p className="font-bold text-on-surface flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Lokasi Cek Fisik Showroom MOKAS:</span>
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              {siteConfig.contact.address}
            </p>
            <a
              href={siteConfig.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary font-bold hover:underline pt-1"
            >
              <span>Buka Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quick WA Action Button */}
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(waConfirmMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-secondary-container" />
            <span>Kirim Bukti via WhatsApp Admin (+62 812-8664-0201)</span>
          </a>

        </div>

        {/* Right Column: QRIS Barcode Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-headline font-bold text-base text-on-surface">
              QRIS Resmi MOKAS Motor Bekas
            </h3>
            <p className="text-xs text-on-surface-variant">
              Scan barcode untuk pembayaran tanda jadi Rp 200.000
            </p>
          </div>

          {/* QRIS SVG Image */}
          <div className="rounded-2xl overflow-hidden border border-surface-container bg-white p-2 shadow-inner">
            <img
              src="/images/qris-mokas.svg"
              alt="QRIS Pembayaran MOKAS"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>

          {/* Instruksi Singkat */}
          <div className="space-y-2 text-xs text-on-surface-variant">
            <p className="font-bold text-on-surface">Cara Bayar:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Buka M-Banking atau E-Wallet apa saja (BCA, Mandiri, GoPay, OVO, DANA).</li>
              <li>Pilih menu <strong>Scan QRIS</strong>.</li>
              <li>Arahkan kamera ke barcode di atas dengan nominal <strong>Rp 200.000</strong>.</li>
              <li>Simpan bukti transfer dan kirim ke WhatsApp Admin MOKAS.</li>
            </ol>
          </div>

          <a
            href="/images/qris-mokas.svg"
            download="QRIS-MOKAS.svg"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-surface-container hover:bg-surface-container text-xs font-bold text-on-surface transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Gambar QRIS</span>
          </a>
        </div>

      </div>

    </div>
  );
}

