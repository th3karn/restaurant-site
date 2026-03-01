"use client";
// app/reservations/page.tsx
// Multi-step reservation booking form with animated step transitions.
// Steps: 1) Date/Time/Guests → 2) Personal Details → 3) Confirmation

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

type FormData = {
  date: string;
  time: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const TIME_SLOTS = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
];

// Slide variants for step transitions
const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};

export default function ReservationsPage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    date: "", time: "", guests: "2", name: "", email: "", phone: "", notes: "",
  });

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const nextStep = () => { setDir(1); setStep((s) => s + 1); };
  const prevStep = () => { setDir(-1); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "input-base";
  const labelCls = "block text-xs font-semibold tracking-wide uppercase text-brand-400 mb-2";

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* ─ Header ────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 text-center bg-charcoal-900 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 section-container">
          <SectionReveal>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-400 mb-4 block">
              La Tavola
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-4">
              Reserve Your <span className="text-gradient">Table</span>
            </h1>
            <p className="text-cream-300/60 max-w-xl mx-auto">
              We look forward to welcoming you. Reservations can be made up to 30 days in advance.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ─ Form ──────────────────────────────────────── */}
      <section className="py-20 bg-charcoal-950">
        <div className="section-container max-w-2xl">

          {/* Success animation */}
          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20
                              flex items-center justify-center text-5xl">
                ✓
              </div>
              <h2 className="font-serif text-3xl font-bold mb-3">Reservation Confirmed!</h2>
              <p className="text-cream-300/60 mb-2">
                Thank you, <strong className="text-cream-100">{form.name}</strong>.
              </p>
              <p className="text-cream-300/60">
                We&apos;ve reserved a table for <strong className="text-cream-100">{form.guests}</strong> guests
                on <strong className="text-cream-100">{form.date}</strong> at{" "}
                <strong className="text-cream-100">{form.time}</strong>.
              </p>
              <p className="text-sm text-cream-300/40 mt-4">
                A confirmation will be sent to {form.email}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {["Date & Time", "Your Details", "Confirm"].map((label, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    transition-all duration-300
                                    ${i <= step
                        ? "bg-brand-500 text-charcoal-900"
                        : "bg-white/10 text-white/30"}`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs hidden sm:block ${i <= step ? "text-brand-300" : "text-white/30"}`}>
                      {label}
                    </span>
                    {i < 2 && <div className={`hidden sm:block w-8 h-px ${i < step ? "bg-brand-500" : "bg-white/10"}`} />}
                  </div>
                ))}
              </div>

              {/* Step card */}
              <div className="glass-card p-8 overflow-hidden">
                <AnimatePresence mode="wait" custom={dir}>
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      custom={dir}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <h2 className="font-serif text-2xl font-semibold mb-6">When would you like to dine?</h2>
                      <div className="space-y-6">
                        <div>
                          <label className={labelCls}>Date</label>
                          <input
                            type="date"
                            min={today}
                            value={form.date}
                            onChange={(e) => set("date", e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Preferred Time</label>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {TIME_SLOTS.map((t) => (
                              <button
                                key={t}
                                onClick={() => set("time", t)}
                                className={`py-2 px-2 text-xs rounded-lg border transition-all duration-200
                                            ${form.time === t
                                    ? "bg-brand-500 border-brand-500 text-charcoal-900 font-bold"
                                    : "border-white/10 text-cream-300/60 hover:border-brand-500/50"}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Guests</label>
                          <select
                            value={form.guests}
                            onChange={(e) => set("guests", e.target.value)}
                            className={inputCls}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        <button
                          onClick={nextStep}
                          disabled={!form.date || !form.time}
                          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          Continue →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={dir}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <h2 className="font-serif text-2xl font-semibold mb-6">Tell us about yourself</h2>
                      <div className="space-y-5">
                        <div>
                          <label className={labelCls}>Full Name *</label>
                          <input
                            type="text"
                            placeholder="Giovanni Rossi"
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Email Address *</label>
                          <input
                            type="email"
                            placeholder="giovanni@email.com"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="+39 055 123 4567"
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Special Requests (optional)</label>
                          <textarea
                            placeholder="High chair needed, birthday celebration, allergies..."
                            value={form.notes}
                            onChange={(e) => set("notes", e.target.value)}
                            rows={3}
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-8">
                        <button onClick={prevStep} className="btn-ghost">← Back</button>
                        <button
                          onClick={nextStep}
                          disabled={!form.name || !form.email || !form.phone}
                          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          Review →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={dir}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <h2 className="font-serif text-2xl font-semibold mb-6">Confirm your reservation</h2>

                      {/* Summary card */}
                      <div className="bg-white/5 rounded-2xl p-6 space-y-3 mb-8 border border-white/10">
                        {[
                          ["Date", form.date],
                          ["Time", form.time],
                          ["Guests", `${form.guests} guest${parseInt(form.guests) > 1 ? "s" : ""}`],
                          ["Name", form.name],
                          ["Email", form.email],
                          ["Phone", form.phone],
                          ...(form.notes ? [["Notes", form.notes]] : []),
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 text-sm">
                            <span className="text-cream-300/40 font-medium">{k}</span>
                            <span className="text-cream-100 text-right">{v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <button onClick={prevStep} className="btn-ghost">← Back</button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="btn-primary min-w-[160px] justify-center"
                        >
                          {loading ? (
                            <span className="w-5 h-5 border-2 border-charcoal-900/30 border-t-charcoal-900
                                             rounded-full animate-spin" />
                          ) : (
                            "Confirm Booking"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
