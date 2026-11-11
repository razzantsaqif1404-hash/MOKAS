"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, MessageSquare, PhoneCall, Ticket, User, LogOut } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    name: string;
    roleName: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {});
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-md shadow-sm border-b border-surface-container"
          : "bg-surface/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link
            href="/#hero"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
            aria-label="MOKAS Beranda"
          >
            <div className="h-10 w-auto flex items-center">
              <img
                src={siteConfig.logo}
                alt="Logo MOKAS"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Menu Utama">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Menu Pesanan Anda: Hanya muncul saat user sudah login */}
            {currentUser && (
              <Link
                href="/pesanan"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
              >
                <Ticket className="w-4 h-4 text-primary" />
                <span>Pesanan Anda</span>
              </Link>
            )}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser?.roleName === "admin" ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-all"
              >
                <span>Dashboard Admin</span>
              </Link>
            ) : !currentUser ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container hover:text-primary transition-all"
              >
                <span>Masuk Akun</span>
              </Link>
            ) : (
              <span className="text-xs font-semibold text-on-surface-variant px-2">
                Halo, <strong className="text-on-surface">{currentUser.name}</strong>
              </span>
            )}

            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                siteConfig.contact.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md hover:bg-primary-dark transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-secondary-container" />
              <span>Konsultasi WA</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-on-surface hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-surface-container shadow-xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-on-surface hover:text-primary hover:bg-surface-container-low transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {currentUser && (
              <Link
                href="/pesanan"
                onClick={closeMenu}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-primary bg-primary/10 transition-colors"
              >
                <Ticket className="w-5 h-5 text-primary" />
                <span>Pesanan Anda</span>
              </Link>
            )}

            {currentUser?.roleName === "admin" && (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-xl text-base font-bold text-primary bg-surface-container transition-colors"
              >
                Dashboard Admin
              </Link>
            )}

            {!currentUser && (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block px-4 py-3 rounded-xl text-base font-bold text-on-surface border border-surface-container hover:bg-surface-container transition-colors"
              >
                Masuk / Daftar Akun
              </Link>
            )}

            <div className="pt-4 border-t border-surface-container space-y-2.5">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  siteConfig.contact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-all"
              >
                <MessageSquare className="w-4 h-4 text-secondary-container" />
                <span>Chat WhatsApp Admin (+62 812-8664-0201)</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>Hubungi: {siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
