"use client";
// components/ContactForm.tsx
// Animated contact form for the Contact page.

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to an email API (e.g. Resend, SendGrid)
    setSent(true);
  };

  const inputCls = "input-base";
  const labelCls = "block text-xs font-semibold tracking-wide uppercase text-brand-400 mb-2";

  return (
    <div className="glass-card p-8">
      <h2 className="font-serif text-2xl font-bold mb-6">
        Send Us a <span className="text-gradient">Message</span>
      </h2>

      {sent ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-10"
        >
          <div className="text-5xl mb-4">✉️</div>
          <h3 className="font-serif text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-cream-300/60 text-sm">
            Thanks {form.name}! We&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Name</label>
              <input
                type="text" required placeholder="Your name"
                value={form.name} onChange={(e) => set("name", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email" required placeholder="your@email.com"
                value={form.email} onChange={(e) => set("email", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subject</label>
            <input
              type="text" placeholder="Private event inquiry"
              value={form.subject} onChange={(e) => set("subject", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Message</label>
            <textarea
              required rows={5} placeholder="How can we help you?"
              value={form.message} onChange={(e) => set("message", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
