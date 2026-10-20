import {
    hasIpAddressHost,
    hasManySubdomains,
    hasPunycodeHost,
    hasSuspiciousTld,
    hasSuspiciousWords,
    impersonatesKnownBrand,
    usesInsecureHttp,
    usesUrlShortener,
} from "@/analysis/urlHeuristics";
import { VERDICT } from "@/domain/verdicts";

const HEURISTICS = [
  usesInsecureHttp,
  hasPunycodeHost,
  usesUrlShortener,
  hasIpAddressHost,
  hasManySubdomains,
  hasSuspiciousTld,
  hasSuspiciousWords,
  impersonatesKnownBrand,
];

const DANGEROUS_MIN_SCORE = 4;
const SUSPICIOUS_MIN_SCORE = 2;

export function assessLink(link) {
  const url = new URL(link);
  const results = HEURISTICS.map((check) => check(url));
  const findings = results.filter((result) => result !== null);
  const score = findings.reduce((total, finding) => total + finding.weight, 0);
}

function scoreToVerdict(score) {
  if (score >= DANGEROUS_MIN_SCORE) {
    return VERDICT.DANGEROUS;
  }
  if (score >= SUSPICIOUS_MIN_SCORE) {
    return VERDICT.SUSPICIOUS;
  }
  return VERDICT.SAFE;
}
