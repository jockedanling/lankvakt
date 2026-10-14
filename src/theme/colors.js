export const colors = {
  background: "#EEF3FA",
  surface: "#FFFFFF",
  text: "#10233F",
  secondaryText: "#5A6478",
  accent: "#1F4FD1",
  separator: "#D3DEEE",

  // Komponenter kan leta upp färg t.ex. colors.verdict["dangerous"].text
  // Färgerna får bara användas för bedömningen
  // Nycklarna måste matcha värdena i VERDICT, annars kraschar uppslagningen.
  verdict: {
    dangerous: { text: "#B3261E", background: "#FCE8E6" },
    suspicious: { text: "#B26A00", background: "#FFF1D6" },
    safe: { text: "#1E7A3A", background: "#E3F4E8" },
  },
};
