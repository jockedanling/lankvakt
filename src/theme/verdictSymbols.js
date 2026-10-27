import { VERDICT } from "@/domain/verdicts";

// Formerna liknar vägskyltar som de flesta känner igen: okej, varning, stopp.
export const VERDICT_SYMBOL = Object.freeze({
  [VERDICT.SAFE]: "checkmark.circle.fill", // En bock som visar okej
  [VERDICT.SUSPICIOUS]: "exclamationmark.triangle.fill", // Varningstriangel
  [VERDICT.DANGEROUS]: "xmark.octagon.fill", // Som en stoppskylt
});
