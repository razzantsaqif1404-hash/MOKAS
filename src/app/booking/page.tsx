"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Calendar,
  CheckCircle2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  QrCode,
  User,
  Phone,
  Home,
  Check,
} from "lucide-react";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bikeIdParam = searchParams.get("bike") || siteConfig.featuredMotorcycles[0]?.id;

  const [selectedBikeId, setSelectedBikeId] = useState(bikeIdParam);
  const [userName, setUserName] = useState("");
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedBike =
    siteConfig.featuredMotorcycles.find((b) => b.id === selectedBikeId) ||
    siteConfig.featuredMotorcycles[0];

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setUserName(data.user.name || "");
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn) {
      router.push(`/login?redirect=/booking?bike=${selectedBikeId}`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          user_whatsapp: userWhatsapp,
          user_address: userAddress,
          motorcycle_id: selectedBike.id,
          motorcycle_name: `${selectedBike.brand} ${selectedBike.model} (${selectedBike.year})`,
          notes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Gagal membuat pemesanan booking tiket.");
        setLoading(false);
        return;
      }

      // Redirect ke halaman tiket invoice pembayaran QRIS
      router.push(`/pesanan/${data.data.id}`);
    } catch (err: any) {
      setErrorMessage("Terjadi gangguan koneksi: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <span>/</span>
        <Link href="/#katalog" className="hover:text-primary transition-colors">
          Katalog Motor
        </Link>
        <span>/</span>
        <span className="font-bold text-on-surface">Booking Unit & Cek Fisik</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Pemesanan */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>Reservasi Tanda Jadi Unit</span>
            </div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
              Formulir Booking Unit Motor
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Kunci unit pilihan Anda dengan tanda jadi (booking fee) resmi sebesar <strong>Rp 200.000</strong>. Unit tidak akan dilepas ke calon pembeli lain saat Anda datang cek fisik.
            </p>
          </div>

          {/* Not Logged In Callout */}
          {isLoggedIn === false && (
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Anda belum masuk ke akun MOKAS. Masuk terlebih dahulu agar tiket tersimpan di akun Anda.</span>
              </div>
              <Link
                href={`/login?redirect=/booking?bike=${selectedBikeId}`}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold text-xs"
              >
                Masuk / Daftar
              </Link>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-error-container/40 border border-error/20 flex items-center gap-2.5 text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitBooking} className="space-y-4">
            
            {/* Pilihan Motor */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Unit Motor yang Dipilih
              </label>
              <select
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {siteConfig.featuredMotorcycles.map((bike) => (
                  <option key={bike.id} value={bike.id}>
                    {bike.brand} {bike.model} ({bike.year}) — {bike.priceDisplay}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Lengkap Pemesan */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Nama Lengkap Pemesan
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* No WhatsApp / Telepon */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Nomor WhatsApp Aktif Pemesan
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx (untuk koordinasi jadwal cek fisik)"
                  value={userWhatsapp}
                  onChange={(e) => setUserWhatsapp(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Alamat Lengkap Pembeli */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Alamat Domisili Pembeli
              </label>
              <textarea
                rows={2}
                required
                placeholder="Alamat domisili / tempat tinggal (Kecamatan, Kota/Kabupaten)"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            {/* Layanan Booking: Cek Fisik di Showroom */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Metode Layanan Pemesanan
              </label>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Cek Fisik di Showroom MOKAS</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Kunjungi showroom untuk test drive & verifikasi STNK/BPKB langsung.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-primary px-2.5 py-1 rounded-lg bg-white border border-primary/20">
                  Rekomendasi
                </span>
              </div>
            </div>

            {/* Catatan / Tanggal Rencana Datang */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Rencana Tanggal Kunjungan / Catatan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Rencana cek fisik hari Sabtu jam 14.00 WIB"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            {/* Total Pembayaran Tanda Jadi */}
            <div className="pt-2 p-4 rounded-2xl bg-tertiary-container/15 border border-tertiary/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-tertiary font-bold uppercase tracking-wider">
                  Nominal Tanda Jadi (Booking Fee):
                </p>
                <p className="text-xs text-on-surface-variant">
                  Mengunci unit agar tidak dilepas ke pembeli lain
                </p>
              </div>
              <div className="font-headline font-black text-2xl text-tertiary">
                Rp 200.000
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm sm:text-base shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Membuat Tiket Pesanan...</span>
              ) : (
                <>
                  <span>Lanjutkan ke Pembayaran QRIS</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Ringkasan Motor & Lokasi Showroom */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card Motor Terpilih */}
          <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant">
              Ringkasan Unit Terpilih
            </h3>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container">
              <img
                src={selectedBike.image}
                alt={selectedBike.model}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase">{selectedBike.brand}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-container">
                  Tahun {selectedBike.year}
                </span>
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface mt-1">
                {selectedBike.model}
              </h2>
              <div className="mt-2 font-headline font-black text-2xl text-primary">
                {selectedBike.priceDisplay}
              </div>
              <p className="text-xs text-tertiary font-semibold mt-0.5">
                {selectedBike.priceNote}
              </p>
            </div>

            <div className="pt-3 border-t border-surface-container grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
              <div>Odometer: <strong className="text-on-surface">{selectedBike.odometer}</strong></div>
              <div>Transmisi: <strong className="text-on-surface">{selectedBike.transmission}</strong></div>
              <div>Kapasitas: <strong className="text-on-surface">{selectedBike.cc}</strong></div>
              <div>Warna: <strong className="text-on-surface">{selectedBike.color}</strong></div>
            </div>
          </div>

          {/* Card Lokasi Showroom Google Maps */}
          <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">
                  Lokasi Cek Fisik Showroom MOKAS
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  {siteConfig.contact.address}
                </p>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2"
                >
                  <span>Buka Peta Petunjuk Arah Google Maps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Jaminan MOKAS */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface-variant space-y-2">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span>Garansi Uang Tanda Jadi:</span>
            </div>
            <p>
              Tanda jadi Rp 200.000 memotong harga beli unit saat transaksi. Apabila kondisi fisik unit saat dicek tidak sesuai dengan lembar inspeksi MOKAS, uang tanda jadi dikembalikan penuh 100%.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-on-surface-variant">Memuat halaman pemesanan...</div>}>
      <BookingForm />
    </Suspense>
  );
}

