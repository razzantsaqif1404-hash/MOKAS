import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="font-headline font-black text-8xl text-primary/20">404</div>
        <h1 className="font-headline font-bold text-2xl text-on-surface">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          Silakan kembali ke beranda untuk menjelajahi koleksi motor second berkualitas kami.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

