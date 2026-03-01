"use client";
// app/admin/dashboard/page.tsx
// Protected admin dashboard — renders only if the admin_token cookie is valid.
// Provides:
//  - Tab: Menu Management (add / edit / delete items)
//  - Tab: Reservations viewer

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type MenuItem = {
  id: string; name: string; category: string;
  description: string; price: number; image: string;
  tags: string[]; available: boolean;
};

type Reservation = {
  id: string; date: string; time: string; guests: string;
  name: string; email: string; phone: string;
  notes: string; createdAt: string;
};

const BLANK_ITEM: Partial<MenuItem> = {
  name: "", category: "Mains", description: "", price: 0,
  image: "", tags: [], available: true,
};
const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"menu" | "reservations">("menu");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/menu"),
      fetch("/api/admin/reservations"),
    ]).then(async ([mRes, rRes]) => {
      if (mRes.status === 401 || rRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      setMenu(await mRes.json());
      setReservations(await rRes.json());
      setLoading(false);
    }).catch(() => router.push("/admin/login"));
  }, [router]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch("/api/admin/menu", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        tags: typeof editing.tags === "string"
          ? (editing.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
          : editing.tags,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMenu((prev) =>
        isNew ? [...prev, updated] : prev.map((m) => m.id === updated.id ? updated : m)
      );
      setEditing(null);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
      </div>
    );
  }

  const inputCls = "input-base text-sm";
  const labelCls = "block text-xs text-brand-400 font-semibold tracking-widest uppercase mb-1.5";

  return (
    <div className="min-h-screen bg-charcoal-950 pb-20">
      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-charcoal-900/90 backdrop-blur-lg border-b border-white/5">
        <div className="section-container flex justify-between items-center h-16">
          <div>
            <span className="font-serif text-xl text-gradient font-bold">La Tavola</span>
            <span className="ml-3 text-xs text-white/30 uppercase tracking-widest">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-white/30 hover:text-red-400 transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="section-container pt-10">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Menu Items", value: menu.length, icon: "🍽️" },
            { label: "Reservations", value: reservations.length, icon: "📅" },
            { label: "Available Now", value: menu.filter((m) => m.available).length, icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-bold font-serif">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["menu", "reservations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-300
                          ${tab === t ? "text-charcoal-900" : "text-cream-300/50 hover:text-cream-100"}`}
            >
              {tab === t && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Menu Tab ─────────────────────────────────── */}
          {tab === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold">Menu Items</h2>
                <button onClick={() => setEditing({ ...BLANK_ITEM })} className="btn-primary text-sm !px-5 !py-2">
                  + Add Item
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <tr>
                      {["Image", "Name", "Category", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menu.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=60"}
                              alt={item.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-cream-100 max-w-[200px] truncate">{item.name}</td>
                        <td className="px-4 py-3 text-white/50">{item.category}</td>
                        <td className="px-4 py-3 text-brand-400 font-semibold">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`tag-badge ${item.available ? "!bg-green-500/20 !text-green-300 !border-green-500/30" : "!bg-red-500/20 !text-red-300 !border-red-500/30"}`}>
                            {item.available ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setEditing({ ...item, tags: item.tags as unknown as string[] })}
                              className="text-xs text-brand-400 hover:text-brand-200 transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)}
                              className="text-xs text-red-400 hover:text-red-200 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── Reservations Tab ──────────────────────────── */}
          {tab === "reservations" && (
            <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-serif text-2xl font-bold mb-6">Reservations ({reservations.length})</h2>
              {reservations.length === 0 ? (
                <div className="glass-card p-12 text-center text-white/30">
                  No reservations yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                      <tr>
                        {["Date", "Time", "Guests", "Name", "Email", "Phone", "Notes"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reservations.slice().reverse().map((r) => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-brand-300 font-medium">{r.date}</td>
                          <td className="px-4 py-3 text-cream-100">{r.time}</td>
                          <td className="px-4 py-3 text-center">{r.guests}</td>
                          <td className="px-4 py-3 text-cream-100">{r.name}</td>
                          <td className="px-4 py-3 text-white/50">{r.email}</td>
                          <td className="px-4 py-3 text-white/50">{r.phone}</td>
                          <td className="px-4 py-3 text-white/30 max-w-[200px] truncate">{r.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Edit / Add Modal ─────────────────────────── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="glass-card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-serif text-xl font-bold mb-6">
                {editing.id ? "Edit Menu Item" : "Add New Item"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Category</label>
                    <select className={inputCls} value={editing.category ?? "Mains"} onChange={(e) => setEditing((s) => ({ ...s, category: e.target.value }))}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Price ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={editing.price ?? 0}
                      onChange={(e) => setEditing((s) => ({ ...s, price: parseFloat(e.target.value) || 0 }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={3} className={`${inputCls} resize-none`} value={editing.description ?? ""}
                    onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Image URL</label>
                  <input className={inputCls} value={editing.image ?? ""}
                    onChange={(e) => setEditing((s) => ({ ...s, image: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Tags (comma-separated)</label>
                  <input className={inputCls}
                    value={Array.isArray(editing.tags) ? (editing.tags as string[]).join(", ") : editing.tags ?? ""}
                    onChange={(e) => setEditing((s) => ({ ...s, tags: e.target.value as unknown as string[] }))} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="avail" checked={editing.available ?? true}
                    onChange={(e) => setEditing((s) => ({ ...s, available: e.target.checked }))}
                    className="w-4 h-4 accent-brand-500" />
                  <label htmlFor="avail" className="text-sm text-cream-300">Available on menu</label>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving
                    ? <span className="w-5 h-5 border-2 border-charcoal-900/40 border-t-charcoal-900 rounded-full animate-spin" />
                    : editing.id ? "Save Changes" : "Add Item"
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
