// app/api/admin/menu/route.ts
// Protected CRUD API for menu items (admin only)
// GET = list all, POST = add, PUT = update, DELETE = remove

import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { randomUUID } from "crypto";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  available: boolean;
}

/** Middleware — check JWT cookie */
function auth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const menu = readJSON<MenuItem[]>("menu.json", []);
  return NextResponse.json(menu);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const menu = readJSON<MenuItem[]>("menu.json", []);
  const item: MenuItem = {
    id: randomUUID(),
    name: body.name ?? "New Dish",
    category: body.category ?? "Mains",
    description: body.description ?? "",
    price: parseFloat(body.price) || 0,
    image: body.image ?? "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    tags: body.tags ?? [],
    available: body.available ?? true,
  };
  menu.push(item);
  writeJSON("menu.json", menu);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const menu = readJSON<MenuItem[]>("menu.json", []);
  const idx = menu.findIndex((m) => m.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  menu[idx] = { ...menu[idx], ...body };
  writeJSON("menu.json", menu);
  return NextResponse.json(menu[idx]);
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  let menu = readJSON<MenuItem[]>("menu.json", []);
  menu = menu.filter((m) => m.id !== id);
  writeJSON("menu.json", menu);
  return NextResponse.json({ success: true });
}
