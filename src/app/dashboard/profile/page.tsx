"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Lock,
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function ProfileSecurityPage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    roleName: string;
  } | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmNewPassword) {
      setFeedback({ type: "error", message: "Konfirmasi kata sandi baru tidak cocok." });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: "error", message: "Kata sandi baru minimal harus 6 karakter." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({ type: "error", message: data.message || "Gagal mengubah kata sandi." });
        setLoading(false);
        return;
      }

      setFeedback({
        type: "success",
        message: "Kata sandi berhasil diperbarui! Silakan simpan kata sandi baru Anda dengan aman.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-headline font-black text-2xl sm:text-3xl text-on-surface">
          Profil & Keamanan Akun
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Kelola informasi identitas administrator dan perbarui kata sandi akun Anda
        </p>
      </div>

      {/* Security Warning Notice */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-900">
            Langkah Wajib Sebelum Go-Live:
          </p>
          <p className="text-xs text-amber-800/90 leading-relaxed">
            Jika akun Anda masih menggunakan kata sandi awal (<code>123456</code>), segera ubah dengan kombinasi unik demi mencegah akses tidak sah ke dashboard showroom MOKAS.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
        <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <span>Informasi Akun Anda</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">Nama</span>
            <p className="text-sm font-bold text-on-surface mt-1">{user?.name || "Administrator"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">Email</span>
            <p className="text-sm font-bold text-on-surface mt-1">{user?.email || "admin@gmail.com"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">Tingkat Akses</span>
            <p className="text-sm font-bold text-tertiary mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="uppercase">{user?.roleName || "ADMIN"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <span>Perbarui Kata Sandi</span>
          </h3>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm ${
              feedback.type === "success"
                ? "bg-tertiary-container/20 text-tertiary border border-tertiary/30"
                : "bg-error-container/40 text-error border border-error/30"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Kata Sandi Lama
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi lama Anda"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter kombinasi"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Ulangi Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Menyimpan Kata Sandi..." : "Simpan Perubahan Kata Sandi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

