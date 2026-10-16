export const VERDICT = Object.freeze({
  SAFE: "safe",
  SUSPICIOUS: "suspicious",
  DANGEROUS: "dangerous",
});

export const VERDICT_LABEL = Object.freeze({
  [VERDICT.SAFE]: "Säker",
  [VERDICT.SUSPICIOUS]: "Misstänkt",
  [VERDICT.DANGEROUS]: "Farlig",
});
