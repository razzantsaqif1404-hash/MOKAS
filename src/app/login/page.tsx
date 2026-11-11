"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Home } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "unauthorized_role"
      ? "Akses ditolak: Akun Anda bukan Administrator."
      : errorParam === "session_expired"
      ? "Sesi Anda telah berakhir. Silakan login kembali."
      : ""
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Gagal masuk. Silakan cek email dan sandi.");
        setLoading(false);
        return;
      }

      if (data.user?.role === "admin") {
        router.push(redirectPath);
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Terjadi gangguan koneksi: " + err.message);
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail("admin@gmail.com");
    setPassword("123456");
  };

  return (
    <div className="bg-surface-container-lowest py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-surface-container space-y-6">
      {/* Alert Error */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-error-container/40 border border-error/20 flex items-start gap-3 text-error text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Demo Admin Banner */}
      <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Akun Administrator Awal
          </span>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Isi Otomatis
          </button>
        </div>
        <p className="text-xs text-on-surface-variant">
          Email: <code className="text-on-surface font-semibold">admin@gmail.com</code> | Sandi: <code className="text-on-surface font-semibold">123456</code>
        </p>
        <p className="text-[11px] text-amber-700 font-medium">
          ⚠️ Peringatan: Mohon ganti kata sandi ini di menu Profil sebelum situs dipublikasikan ke umum.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span>Memproses Verifikasi...</span>
          ) : (
            <>
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-surface-container text-center text-xs text-on-surface-variant">
        <span>Belum memiliki akun? </span>
        <Link href="/register" className="font-bold text-primary hover:underline">
          Daftar akun baru di sini
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-1.5 rounded-lg bg-surface-container-low"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <img src={siteConfig.logo} alt="Logo MOKAS" className="h-12 w-auto mx-auto object-contain" />
        </Link>
        <h2 className="mt-4 font-headline font-black text-2xl sm:text-3xl text-on-surface">
          Masuk ke Akun MOKAS
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Akses dashboard manajemen stok, berita, dan layanan motor bekas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="p-8 text-center text-sm text-on-surface-variant">Memuat halaman login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
