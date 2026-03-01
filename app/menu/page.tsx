"use client";
// app/menu/page.tsx
// Menu listing with animated category tab transitions.
// Data is fetched from /api/menu on mount.

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  available: boolean;
};

const CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Drinks"];

// Color map for tag badges
const TAG_COLORS: Record<string, string> = {
  "Vegetarian": "bg-green-500/20 text-green-300 border-green-500/30",
  "Gluten-Free": "bg-blue-500/20  text-blue-300  border-blue-500/30",
  "Popular": "bg-pink-500/20  text-pink-300  border-pink-500/30",
  "Chef's Pick": "bg-brand-500/20 text-brand-300 border-brand-500/30",
  "Signature": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Cocktail": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  const filtered = active === "All"
    ? items.filter((i) => i.available)
    : items.filter((i) => i.category === active && i.available);

  return (
    <>
      {/* ─ Page Header ─────────────────────────────────── */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 to-charcoal-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 section-container">
          <SectionReveal>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4 block">
              La Tavola
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-4">
              Our <span className="text-gradient">Menu</span>
            </h1>
            <p className="text-cream-300/60 max-w-xl mx-auto">
              A celebration of Italian culinary tradition, crafted with seasonal ingredients
              and served with warmth.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ─ Category Tabs ───────────────────────────────── */}
      <section className="sticky top-20 z-30 bg-charcoal-900/90 backdrop-blur-lg
                          border-b border-white/5 py-4">
        <div className="section-container flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
                          transition-all duration-300 flex-shrink-0
                          ${active === cat
                  ? "text-charcoal-900"
                  : "text-cream-300/50 hover:text-cream-100"
                }`}
            >
              {/* Animated pill background */}
              {active === cat && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─ Menu Grid ───────────────────────────────────── */}
      <section className="py-16 bg-charcoal-950 min-h-[60vh]">
        <div className="section-container">
          {loading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="h-52 bg-white/5" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((item, i) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="glass-card overflow-hidden group hover:-translate-y-1.5
                               transition-transform duration-400"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16
                                      bg-gradient-to-t from-charcoal-950/90 to-transparent" />
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h2 className="font-serif text-lg font-semibold leading-tight">
                          {item.name}
                        </h2>
                        <span className="text-brand-400 font-semibold text-base whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-cream-300/50 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                                        ${TAG_COLORS[tag] ?? "bg-white/10 text-white/50 border-white/10"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
