import Link from "next/link";
import { db } from "@/lib/db";
import {
  Users,
  Shield,
  Newspaper,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Database,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [users, roles, news] = await Promise.all([
    db.findMany("Users"),
    db.findMany("Roles"),
    db.findMany("News"),
  ]);

  const activeUsersCount = users.filter((u) => u.status === "active").length;
  const adminUsersCount = users.filter((u) => u.role_id === "role-admin").length;
  const publishedNewsCount = news.filter((n) => n.status === "published").length;

  const isAppsScriptConnected = !!(process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_SECRET);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Security Callout Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-amber-900">
              Peringatan Keamanan Kredensial Awal
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5 leading-relaxed">
              Akun <code className="font-bold text-amber-950">admin@gmail.com</code> saat ini menggunakan kata sandi bawaan (<code className="font-bold">123456</code>). Sangat disarankan mengganti kata sandi sebelum website diluncurkan ke production.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/profile"
          className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Ganti Kata Sandi
        </Link>
      </div>

      {/* Database Connection Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Database className={`w-5 h-5 ${isAppsScriptConnected ? "text-tertiary" : "text-primary"}`} />
          <div>
            <p className="text-xs font-bold text-on-surface">
              Status Database:{" "}
              {isAppsScriptConnected ? (
                <span className="text-tertiary">Terhubung ke Google Spreadsheet (Apps Script)</span>
              ) : (
                <span className="text-primary">Mode Lokal Cepat (Siap dihubungkan ke Google Sheets)</span>
              )}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {isAppsScriptConnected
                ? "Data secara otomatis tersinkronisasi dua arah dengan Google Spreadsheet."
                : "Semua operasi CRUD berfungsi penuh. Ikuti panduan di /documentation/SETUP.md untuk menautkan Spreadsheet."}
            </p>
          </div>
        </div>
        {!isAppsScriptConnected && (
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            Development Mode Ready
          </span>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Pengguna
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-headline font-black text-3xl text-on-surface">
              {users.length}
            </div>
            <p className="text-xs text-tertiary font-semibold mt-1">
              {activeUsersCount} Akun Aktif
            </p>
          </div>
        </div>

        {/* Total Admins */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Administrator
            </span>
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-headline font-black text-3xl text-on-surface">
              {adminUsersCount}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Akses Penuh Sistem
            </p>
          </div>
        </div>

        {/* Roles Available */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Peran (Roles)
            </span>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-headline font-black text-3xl text-on-surface">
              {roles.length}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Admin, User, & Kustom
            </p>
          </div>
        </div>

        {/* Total News Articles */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Artikel & Berita
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary-container flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-headline font-black text-3xl text-on-surface">
              {news.length}
            </div>
            <p className="text-xs text-tertiary font-semibold mt-1">
              {publishedNewsCount} Terbit di Landing Page
            </p>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Manage Users Card */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface">
              Manajemen Pengguna
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cari pengguna, ubah hak akses / role, aktifkan atau nonaktifkan akun pengguna, serta kelola keamanan akun.
            </p>
          </div>
          <Link
            href="/dashboard/users"
            className="inline-flex items-center justify-between text-xs font-bold text-primary hover:text-primary-dark pt-3 border-t border-surface-container"
          >
            <span>Buka Daftar Pengguna</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Manage Roles Card */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface">
              Manajemen Peran & Hak Akses
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Kelola peran bawaan sistem (admin & user) serta tambahkan peran kustom baru dengan izin bertingkat.
            </p>
          </div>
          <Link
            href="/dashboard/roles"
            className="inline-flex items-center justify-between text-xs font-bold text-primary hover:text-primary-dark pt-3 border-t border-surface-container"
          >
            <span>Atur Izin & Peran</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News CRUD Card */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
              <Newspaper className="w-5 h-5" />
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface">
              Kelola Berita & Tips Edukasi
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tambah artikel baru dengan upload gambar lokal, simpan draf, edit konten, atau hapus artikel yang sudah tidak relevan.
            </p>
          </div>
          <Link
            href="/dashboard/news"
            className="inline-flex items-center justify-between text-xs font-bold text-primary hover:text-primary-dark pt-3 border-t border-surface-container"
          >
            <span>Kelola Artikel Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

