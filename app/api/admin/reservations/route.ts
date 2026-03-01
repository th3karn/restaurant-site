// app/api/admin/reservations/route.ts
// GET /api/admin/reservations — Returns all reservations (admin only)

import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reservations = readJSON("reservations.json", []);
  return NextResponse.json(reservations);
}
