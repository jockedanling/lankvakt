// Visar tiden i historikskärmen.
// Om kontrollen var idag = visa klockslag.
// Om kontrollen var igår = visa igår
// Om kontrollen var inom en vecka = visa veckodag
// om kontrollen var längre tillbaka = visa datum
export function formatCheckedAt(isoString) {
  const checkedAt = new Date(isoString);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  if (checkedAt >= startOfToday) {
    return checkedAt.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (checkedAt >= startOfYesterday) {
    return "Igår";
  }
  if (checkedAt >= startOfWeek) {
    return checkedAt.toLocaleDateString("sv-SE", { weekday: "long" });
  }
  return checkedAt.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}
