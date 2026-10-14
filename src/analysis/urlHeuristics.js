export const SIGNAL_WEIGHT = Object.freeze({
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
});

export function usesInsecureHttp(url) {
  if (url.protocol === "http:") {
    return {
      reason:
        "Länken saknar skydd. Det du skriver in på sidan, till exempel lösenord eller kortnummer, kan läsas av obehöriga.",
      weight: SIGNAL_WEIGHT.LOW,
    };
  }
  return null;
}

export function hasPunycodeHost(url) {
  if (url.hostname.includes("xn--")) {
    return {
      reason: "Länken kan innehålla förfalskade bokstäver.",
      weight: SIGNAL_WEIGHT.MEDIUM,
    };
  }
  return null;
}
