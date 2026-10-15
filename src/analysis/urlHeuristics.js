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

const URL_SHORTENER_HOSTS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
];

export function usesUrlShortener(url) {
  if (URL_SHORTENER_HOSTS.includes(url.hostname)) {
    return {
      reason:
        "Länken är förkortad, så du kan inte se vilken sida den egentligen leder till.",
      weight: SIGNAL_WEIGHT.LOW,
    };
  }
  return null;
}

//TLD står för Top-level-domains, t.ex. .com, .se, .top, .ly

const SUSPICIOUS_TLDS = [
  ".top",
  ".xyz",
  ".click",
  ".zip",
  ".loan",
  ".work",
  ".support",
];

export function hasSuspiciousTld(url) {
  if (SUSPICIOUS_TLDS.some((tld) => url.hostname.endsWith(tld))) {
    return {
      reason:
        "Länken innehåller ovanlig ändelse, vilket är vanligt bland bedragare.",
      weight: SIGNAL_WEIGHT.MEDIUM,
    };
  }
  return null;
}

export function hasIpAddressHost(url) {
  const parts = url.hostname.split(".");
  if (
    parts.length === 4 &&
    parts.every((part) => !Number.isNaN(Number(part)))
  ) {
    return {
      reason:
        "Länken består enbart av siffror istället för namn, vilket är vanligt bland bedragare.",
      weight: SIGNAL_WEIGHT.HIGH,
    };
  }
  return null;
}

const MAX_NORMAL_HOST_PARTS = 4;

export function hasManySubdomains(url) {
  if (url.hostname.split(".").length > MAX_NORMAL_HOST_PARTS) {
    return {
      reason:
        "Adressen har ovanligt många delar. Bedragare gör så för att ett känt namn ska synas först, fast sidan egentligen är en annan.",
      weight: SIGNAL_WEIGHT.LOW,
    };
  }
  return null;
}
