// app/api/menu/route.ts
// GET /api/menu — Returns all available menu items from data/menu.json

import { NextResponse } from "next/server";
import { readJSON } from "@/lib/db";

export async function GET() {
  const menu = readJSON("menu.json", []);
  return NextResponse.json(menu);
}
