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

export const VERDICT_ADVICE = Object.freeze({
  [VERDICT.SAFE]: "Vi hittade inget som tyder på bedrägeri.",
  [VERDICT.SUSPICIOUS]: "Var försiktig med den här länken.",
  [VERDICT.DANGEROUS]: "Öppna inte den här länken.",
});
