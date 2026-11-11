"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
  Users,
  Shield,
  Newspaper,
  UserCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Bell,
  KeyRound,
  Ticket,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    roleName: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      router.push("/login");
    }
  };

  const navItems = [
    {
      label: "Ringkasan Sistem",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "Manajemen Pengguna",
      href: "/dashboard/users",
      icon: <Users className="w-5 h-5" />,
      exact: false,
    },
    {
      label: "Manajemen Peran (Role)",
      href: "/dashboard/roles",
      icon: <Shield className="w-5 h-5" />,
      exact: false,
    },
    {
      label: "Kelola Pesanan (Booking)",
      href: "/dashboard/orders",
      icon: <Ticket className="w-5 h-5" />,
      exact: false,
    },
    {
      label: "Kelola Berita & Artikel",
      href: "/dashboard/news",
      icon: <Newspaper className="w-5 h-5" />,
      exact: false,
    },
    {
      label: "Profil & Keamanan",
      href: "/dashboard/profile",
      icon: <KeyRound className="w-5 h-5" />,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface-container-lowest border-r border-surface-container justify-between shrink-0">
        <div>
          {/* Logo & Brand Header */}
          <div className="h-20 flex items-center px-6 border-b border-surface-container">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src={siteConfig.logo} alt="Logo MOKAS" className="h-9 w-auto object-contain" />
              <span className="px-2 py-0.5 rounded-md bg-primary-container text-white text-[10px] font-bold uppercase">
                Admin
              </span>
            </Link>
          </div>

          {/* Current Admin Card */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-on-surface truncate">
                  {currentUser?.name || "Administrator"}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {currentUser?.email || "admin@gmail.com"}
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
              <span className="font-semibold text-tertiary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block animate-pulse" />
                Online (Admin)
              </span>
              <Link href="/dashboard/profile" className="text-primary font-bold hover:underline">
                Ganti Sandi
              </Link>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-4 space-y-1.5" aria-label="Menu Dashboard">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-surface-container space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Website Publik</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-mono">
              Live
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-error hover:bg-error-container/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-on-surface hover:bg-surface-container lg:hidden"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-headline font-bold text-lg sm:text-xl text-on-surface">
              Panel Pengelola MOKAS
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span>Pratinjau Landing Page</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-error/30 text-error hover:bg-error-container/30 text-xs font-bold transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-surface-container-lowest h-full p-4 flex flex-col justify-between shadow-2xl z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <img src={siteConfig.logo} alt="MOKAS" className="h-8 w-auto object-contain" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-container"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-on-surface-variant hover:bg-surface-container"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-surface-container space-y-2">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container text-xs font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ke Beranda Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-error-container text-error text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

