"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Search,
  PlusCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  ticket_number: string;
  motorcycle_name: string;
  total_price: number | string;
  order_type?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  created_at: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.authenticated) {
          setIsLoggedIn(false);
          router.push("/login?redirect=/pesanan");
          return;
        }
        setIsLoggedIn(true);

        return fetch("/api/orders")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setOrders(data.data || []);
            }
          });
      })
      .catch(() => {
        router.push("/login?redirect=/pesanan");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-on-surface-variant">Memuat daftar pesanan Anda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
            Pesanan & Tiket Booking Anda
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Pantau status verifikasi tanda jadi dan jadwal cek fisik unit motor pilihan Anda
          </p>
        </div>

        <Link
          href="/#katalog"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Booking Motor Lain</span>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-surface-container p-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto text-primary">
            <Ticket className="w-7 h-7" />
          </div>
          <h2 className="font-headline font-bold text-lg text-on-surface">
            Belum Ada Tiket Booking
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
            Anda belum melakukan pemesanan booking unit motor. Silakan jelajahi katalog motor second berkualitas kami.
          </p>
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md"
          >
            <span>Lihat Katalog Motor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container hover:border-primary-fixed-dim hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Nomor Tiket
                  </span>
                  <p className="font-mono font-black text-lg text-primary">
                    {order.ticket_number}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "dikonfirmasi"
                        ? "bg-tertiary-container/20 text-tertiary"
                        : order.status === "dibatalkan"
                        ? "bg-error-container/30 text-error"
                        : "bg-amber-500/15 text-amber-700"
                    }`}
                  >
                    {order.status === "dikonfirmasi" && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {order.status === "menunggu_konfirmasi" && <Clock className="w-3.5 h-3.5" />}
                    {order.status === "dibatalkan" && <AlertCircle className="w-3.5 h-3.5" />}
                    <span>
                      {order.status === "dikonfirmasi"
                        ? "Dikonfirmasi"
                        : order.status === "dibatalkan"
                        ? "Dibatalkan"
                        : "Menunggu Konfirmasi"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Rincian Motor & Harga */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Unit Motor:</span>
                  <p className="font-bold text-on-surface mt-0.5">{order.motorcycle_name}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Layanan:</span>
                  <p className="font-semibold text-on-surface mt-0.5">{order.order_type || "Cek Fisik di Showroom"}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Tanda Jadi:</span>
                  <p className="font-headline font-bold text-primary text-base mt-0.5">Rp 200.000</p>
                </div>
              </div>

              {/* Status Alert Khusus jika dikonfirmasi */}
              {order.status === "dikonfirmasi" && (
                <div className="p-3.5 rounded-2xl bg-tertiary-container/15 border border-tertiary/30 text-xs text-tertiary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    🎉 <strong>Selamat, pembayaran Anda telah dikonfirmasi!</strong> Silakan datang ke showroom untuk cek fisik & test drive unit.
                  </span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <span className="text-on-surface-variant">
                  Dipesan pada: {new Date(order.created_at).toLocaleString("id-ID")}
                </span>

                <Link
                  href={`/pesanan/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold transition-colors"
                >
                  <span>Lihat Detail & QRIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

