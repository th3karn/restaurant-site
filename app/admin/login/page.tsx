"use client";
// app/admin/login/page.tsx
// Admin login page — minimal, clean, centered form.
// Submits to POST /api/admin/login; on success redirects to /admin/dashboard.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card p-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl text-gradient font-bold">La Tavola</span>
          <p className="text-xs tracking-widest uppercase text-brand-400/60 mt-1">Admin Portal</p>
        </div>

        <h1 className="font-serif text-2xl font-semibold mb-6 text-center">Sign In</h1>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-brand-400 mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              className="input-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-brand-400 mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="input-base"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-charcoal-900/40 border-t-charcoal-900 rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          Default credentials: admin / restaurant123
        </p>
      </motion.div>
    </div>
  );
}
