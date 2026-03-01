"use client";
// components/Navbar.tsx
// Sticky navigation bar with scroll-aware glass morphism effect.
// Links animate on hover; mobile menu collapses with Framer Motion.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reserve" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle glass background after 50px scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-charcoal-900/80 backdrop-blur-lg border-b border-white/5 shadow-xl"
          : "bg-transparent"
        }`}
    >
      <nav className="section-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-serif text-2xl text-gradient font-bold tracking-tight group-hover:opacity-90 transition-opacity">
            La Tavola
          </span>
          <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-brand-400/70">
            Fine Italian Dining
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${active ? "text-brand-400" : "text-cream-200 hover:text-brand-300"
                    }`}
                >
                  {label}
                  {/* Active pill underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-400"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/admin/login" className="text-xs text-white/30 hover:text-brand-400 transition-colors">
            Admin
          </Link>
          <Link href="/reservations" className="btn-primary text-sm !px-5 !py-2.5">
            Book a Table
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 bg-cream-200 rounded-full transition-all duration-300 ${i === 1 ? "w-5" : "w-6"
                } ${mobileOpen ? (i === 0 ? "rotate-45 translate-y-2" : i === 2 ? "-rotate-45 -translate-y-2" : "opacity-0") : ""}`}
            />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-charcoal-900/95 backdrop-blur-xl border-t border-white/5"
          >
            <ul className="section-container py-6 flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-lg font-serif ${pathname === href ? "text-brand-400" : "text-cream-200"
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/reservations" className="btn-primary w-full justify-center">
                  Book a Table
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
