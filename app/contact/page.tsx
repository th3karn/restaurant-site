// app/contact/page.tsx
// Contact & Location page with staggered motion reveal effects.

import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Location",
  description: "Find La Tavola restaurant in Florence. Get in touch for reservations, events, or inquiries.",
};

const INFO_CARDS = [
  {
    icon: "📍",
    title: "Address",
    lines: ["12 Via Roma, Florence", "Tuscany, Italy 50100"],
  },
  {
    icon: "📞",
    title: "Phone",
    lines: ["+39 055 123 4567", "Mon – Sun  12:00 – 23:00"],
  },
  {
    icon: "✉️",
    title: "Email",
    lines: ["hello@latavola.it", "events@latavola.it"],
  },
  {
    icon: "🕐",
    title: "Hours",
    lines: ["Lunch: 12:00 – 15:00", "Dinner: 18:00 – 23:00"],
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ─ Header ──────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 text-center bg-charcoal-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 section-container">
          <SectionReveal>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4 block">
              Find Us
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-4">
              Come <span className="text-gradient">Visit</span> Us
            </h1>
            <p className="text-cream-300/60 max-w-xl mx-auto">
              We&apos;re nestled in the heart of Florence. Whether for a romantic dinner or a
              private celebration, we&apos;d love to hear from you.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ─ Info Cards ──────────────────────────────────── */}
      <section className="py-20 bg-charcoal-950">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {INFO_CARDS.map((card, i) => (
              <SectionReveal key={card.title} delay={i * 0.1} direction="up">
                <div className="glass-card p-6 text-center h-full">
                  <span className="text-4xl block mb-4">{card.icon}</span>
                  <h3 className="font-serif text-lg font-semibold text-brand-300 mb-3">{card.title}</h3>
                  {card.lines.map((l) => (
                    <p key={l} className="text-sm text-cream-300/60">{l}</p>
                  ))}
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* ─ Map + Contact Form ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <SectionReveal direction="left">
              <div className="rounded-2xl overflow-hidden h-[420px] border border-white/10">
                {/* Google Maps embed — replace with real coordinates for production */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.9978936879553!2d11.2549823!3d43.7695604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a5c77d3f2e4c7%3A0x96e4b3e03d1e4e4!2sVia%20Roma%2C%20Florence%2C%20Metropolitan%20City%20of%20Florence%2C%20Italy!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(30%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="La Tavola Location Map"
                />
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.1}>
              <ContactForm />
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
