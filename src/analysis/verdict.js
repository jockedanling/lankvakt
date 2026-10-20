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

export function assessLink(link) {
  const url = new URL(link);
  const results = HEURISTICS.map((check) => check(url));
  const findings = results.filter((result) => result !== null);
  const score = findings.reduce((total, finding) => total + finding.weight, 0);
}

function scoreToVerdict(score) {}
