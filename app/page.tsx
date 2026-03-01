// app/page.tsx
// Home page: hero 3D section, about teaser, featured dishes, CTA.
// Sections use SectionReveal for scroll-triggered entrance animations.

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import SectionReveal from "@/components/SectionReveal";

export const metadata: Metadata = {
  title: "La Tavola — Fine Italian Dining",
  description:
    "Experience authentic Italian cuisine crafted with passion. Reserve your table at La Tavola — where every meal is a memory.",
};

// Dynamically import the 3D canvas — SSR disabled because Three.js needs a browser
const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-transparent flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
    </div>
  ),
});

/* ─── Featured dishes (subset of menu) ─────────────────────────────── */
const FEATURED = [
  {
    name: "Filetto di Manzo",
    desc: "Prime beef tenderloin with truffle mash",
    price: "$52",
    img: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
    tag: "Signature",
  },
  {
    name: "Branzino al Limone",
    desc: "Whole roasted Mediterranean sea bass",
    price: "$44",
    img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    tag: "Popular",
  },
  {
    name: "Tiramisù Classico",
    desc: "Our timeless house tiramisu",
    price: "$14",
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    tag: "Chef's Pick",
  },
];

/* ─── About pillars ─────────────────────────────────────────────────── */
const PILLARS = [
  { icon: "🍷", title: "Curated Cellar", desc: "Over 300 Italian labels hand-selected by our sommelier." },
  { icon: "👨‍🍳", title: "Master Chefs", desc: "Culinary artisans trained in the heart of Tuscany." },
  { icon: "🌿", title: "Garden Fresh", desc: "Ingredients sourced daily from our local farm partners." },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO SECTION — full viewport with 3D canvas
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* 3D canvas — absolute fill */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Radial gradient vignette so text stays readable */}
        <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-charcoal-900/40 to-charcoal-900/90" />

        {/* Hero text — layered above 3D */}
        <div className="relative z-20 section-container pt-24">
          <div className="max-w-2xl">
            {/* Eyebrow label */}
            <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase
                             text-brand-400 border border-brand-500/40 rounded-full px-4 py-1.5 mb-6
                             backdrop-blur-sm bg-brand-500/10">
              Est. 1992 · Florence, Italy
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6">
              Where Every{" "}
              <span className="text-gradient">Meal</span>{" "}
              Becomes a{" "}
              <span className="text-gradient">Memory</span>
            </h1>

            <p className="text-lg text-cream-300/70 mb-10 max-w-xl leading-relaxed">
              Authentic Italian flavours, reimagined for the modern table.
              Join us for an experience that transcends dining.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/reservations" className="btn-primary">
                Reserve a Table
              </Link>
              <Link href="/menu" className="btn-ghost">
                Explore Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade out to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-10
                        bg-gradient-to-t from-charcoal-900 to-transparent pointer-events-none" />

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-400/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT TEASER — stitch-style overlapping cards
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 bg-charcoal-900 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <SectionReveal direction="left">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4 block">
                Our Philosophy
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6">
                Passion Plated,{" "}
                <span className="text-gradient">Tradition</span> Honoured
              </h2>
              <p className="text-cream-300/60 text-base leading-relaxed mb-6">
                La Tavola was born from a love of true Italian cooking — not the
                shortcuts, but the slow, attentive craft that transforms simple
                ingredients into extraordinary meals.
              </p>
              <p className="text-cream-300/60 text-base leading-relaxed mb-10">
                Every dish on our menu tells a story of a region, a season, a
                grandmother's recipe preserved through generations.
              </p>
              <Link href="/menu" className="btn-ghost">
                View The Menu
              </Link>
            </SectionReveal>

            {/* Right — stitch-style overlapping cards */}
            <SectionReveal direction="right">
              <div className="relative flex flex-col gap-5">
                {PILLARS.map((p, i) => (
                  <div
                    key={p.title}
                    className={`glass-card p-6 flex gap-5 items-start
                                ${i === 1 ? "ml-8" : ""} ${i === 2 ? "ml-4" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <span className="text-3xl">{p.icon}</span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-cream-100 mb-1">{p.title}</h3>
                      <p className="text-sm text-cream-300/50">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED DISHES
      ══════════════════════════════════════════════════ */}
      <section className="py-28 bg-charcoal-950">
        <div className="section-container">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-3 block">
                From The Kitchen
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold">
                Chef&apos;s <span className="text-gradient">Selections</span>
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED.map((dish, i) => (
              <SectionReveal key={dish.name} delay={i * 0.12}>
                {/* Dish card with hover lift + image zoom */}
                <article className="glass-card overflow-hidden group cursor-pointer hover:-translate-y-2
                                    transition-transform duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={dish.img}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Tag badge overlay */}
                    <span className="absolute top-3 left-3 tag-badge">{dish.tag}</span>
                    {/* Dark overlay on bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal-950/90 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg font-semibold">{dish.name}</h3>
                      <span className="text-brand-400 font-semibold">{dish.price}</span>
                    </div>
                    <p className="text-sm text-cream-300/50">{dish.desc}</p>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.4} className="text-center mt-12">
            <Link href="/menu" className="btn-primary">
              See Full Menu
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-charcoal-900 to-charcoal-900" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }} />

        <div className="relative z-10 section-container text-center">
          <SectionReveal>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6">
              Ready for an <span className="text-gradient">Unforgettable</span> Evening?
            </h2>
            <p className="text-cream-300/60 text-lg mb-10 max-w-xl mx-auto">
              Reserve your table now and let us take care of the rest.
              Private dining and events available.
            </p>
            <Link href="/reservations" className="btn-primary text-lg px-10 py-4">
              Make a Reservation
            </Link>
          </SectionReveal>
        </div>

        {/* Bottom fade into footer */}
        <div className="absolute bottom-0 left-0 right-0 h-20
                        bg-gradient-to-t from-charcoal-950 to-transparent pointer-events-none" />
      </section>
    </>
  );
}
