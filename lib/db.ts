// lib/db.ts
// Simple JSON-file database helpers using Node.js fs module.
// For production, replace these with a real DB (PostgreSQL, MongoDB, etc.)

import fs from "fs";
import path from "path";

/** Reads a JSON file and returns parsed data, or a fallback value on error. */
export function readJSON<T>(fileName: string, fallback: T): T {
  const filePath = path.join(process.cwd(), "data", fileName);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Writes data to a JSON file (pretty-printed). */
export function writeJSON<T>(fileName: string, data: T): void {
  const filePath = path.join(process.cwd(), "data", fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
