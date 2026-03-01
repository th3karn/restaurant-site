// app/api/reservations/route.ts
// POST /api/reservations — Validates and stores a new reservation

import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db";
import { randomUUID } from "crypto";

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, guests, name, email, phone, notes } = body;

    // Basic validation
    if (!date || !time || !guests || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reservations = readJSON<Reservation[]>("reservations.json", []);
    const newReservation: Reservation = {
      id: randomUUID(),
      date,
      time,
      guests,
      name,
      email,
      phone,
      notes: notes ?? "",
      createdAt: new Date().toISOString(),
    };

    reservations.push(newReservation);
    writeJSON("reservations.json", reservations);

    return NextResponse.json({ success: true, id: newReservation.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
