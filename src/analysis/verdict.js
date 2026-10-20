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
import { InvalidLinkError } from "@/domain/errors";
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
const MAX_REASONS = 3;

// Bedömer en länk utifrån alla varningssignaler. Returnerar bedömningen och de allvarligaste förklaringarna.
export function assessLink(link) {
  const url = parseLink(link);
  const results = HEURISTICS.map((check) => check(url));
  const findings = results.filter((result) => result !== null);
  const score = findings.reduce((total, finding) => total + finding.weight, 0);

  const reasons = findings
    .sort((a, b) => b.weight - a.weight) // Högsta vikten först, så att de allvarligaste förklaringarna visas.
    .slice(0, MAX_REASONS) // Om det bara finns ett fynd, slice tar det som finns, alltså ett fynd.
    .map((finding) => finding.reason);
  return { verdict: scoreToVerdict(score), reasons };
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

function parseLink(link) {
  let text = link.trim();
  if (!text.includes("://")) {
    text = "https://" + text;
  }
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new InvalidLinkError();
  }
  if (!url.hostname.includes(".")) {
    throw new InvalidLinkError();
  }
  return url;
}
