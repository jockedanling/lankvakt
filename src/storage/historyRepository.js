import { db } from "@/storage/database";

// Sparar en ny kontroll med den egna analysen. VirusTotals svar fylls i
// senare med updateVirusTotal, eftersom det kan dröja upp till 16 sekunder.
export async function saveCheck(link, verdict, reasons) {
  const result = await db.runAsync(
    "INSERT INTO checks(link, verdict, reasons, checked_at) VALUES (?, ?, ?, ?)",
    link,
    verdict,
    JSON.stringify(reasons), // Stringify gör om listan till text
    new Date().toISOString(),
  );
  return result.lastInsertRowId;
}

export async function updateVirusTotal(id, verdict, report) {
  await db.runAsync(
    "UPDATE checks SET verdict = ?, vt_flagged= ?, vt_total = ? WHERE id = ?",
    verdict,
    report === null ? null : report.flagged,
    report === null ? null : report.total,
    id,
  );
}
export async function getAllChecks() {
  const rows = await db.getAllAsync(
    "SELECT * FROM checks ORDER BY checked_at DESC",
  );
  return rows.map(toCheck);
}
export async function getCheck(id) {
  const row = await db.getFirstAsync("SELECT * FROM checks WHERE id = ?", id);
  if (!row) {
    return null;
  }
  return toCheck(row);
}
export async function deleteCheck(id) {
  await db.runAsync("DELETE FROM checks WHERE id = ?", id);
}

// Gör om en databasrad till samma form som resten av appen använder.
function toCheck(row) {
  return {
    id: row.id,
    link: row.link,
    verdict: row.verdict,
    reasons: JSON.parse(row.reasons),
    virusTotalReport:
      row.vt_total === null
        ? null
        : { flagged: row.vt_flagged, total: row.vt_total },
    checkedAt: row.checked_at,
  };
}
