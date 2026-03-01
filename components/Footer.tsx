// components/Footer.tsx
// Site footer with social links, nav columns, and contact info.

import Link from "next/link";

const QUICK_LINKS = [
  { href: "/menu", label: "Our Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-charcoal-950 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]
                      bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div>
            <span className="block font-serif text-3xl text-gradient font-bold mb-2">La Tavola</span>
            <span className="block text-[10px] tracking-[0.35em] uppercase text-brand-400/60 mb-4">
              Fine Italian Dining
            </span>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Crafting unforgettable Italian dining experiences since 1992. Where tradition meets modern elegance.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-brand-500 mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/50 hover:text-brand-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-brand-500 mb-5">
              Visit Us
            </h3>
            <address className="not-italic space-y-2 text-sm text-white/50">
              <p>12 Via Roma, Florence</p>
              <p>Tuscany, Italy 50100</p>
              <p className="pt-2">
                <a href="tel:+390551234567" className="hover:text-brand-300 transition-colors">
                  +39 055 123 4567
                </a>
              </p>
              <p>
                <a href="mailto:hello@latavola.it" className="hover:text-brand-300 transition-colors">
                  hello@latavola.it
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} La Tavola. All rights reserved.</p>
          <p>Crafted with passion in Florence</p>
        </div>
      </div>
    </footer>
  );
}
