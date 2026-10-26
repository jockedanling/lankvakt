import { openDatabaseSync } from "expo-sqlite";

export const db = openDatabaseSync("lankvakt.db");

// Skapar tabellen första gången appen startar. IF NOT EXITS gör att det är ofarligt att köra vid varje start.
export function initDatabase() {
  db.execSync(`
        CREATE TABLE IF NOT EXISTS checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link TEXT NOT NULL,
  verdict TEXT NOT NULL,
  reasons TEXT NOT NULL,
  vt_flagged INTEGER,
  vt_total INTEGER,
  checked_at TEXT NOT NULL
    );
    `);
}
