//
// Denna js-fil innehåller funktioner som gör egen analys och ger en siffra utifrån en skala om hur
// misstänksam man borde vara gentemot denna länk
//

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

// En lista av ord som bedragare använder i länkar.
const SUSPICIOUS_WORDS = [
  "login",
  "logga-in",
  "verify",
  "verifiera",
  "konto",
  "account",
  "secure",
  "security",
  "sakerhet",
  "update",
  "uppdatera",
  "bankid",
  "betalning",
  "payment",
  "betala",
  "delivery",
  "track",
  "spara",
  "gratis",
  "free",
  "vinst",
  "vunnit",
];

export function hasSuspiciousWords(url) {
  const hostAndPath = (url.hostname + url.pathname).toLowerCase();
  if (SUSPICIOUS_WORDS.some((word) => hostAndPath.includes(word))) {
    return {
      reason:
        "Denna länk innehåller ord som 'logga in' eller 'verifiera'. Bedragare använder sådana ord för att få dig att lämna ut dina uppgifter.",
      weight: SIGNAL_WEIGHT.LOW,
    };
  }
  return null;
}

// Varumärken som bedragare ofta utger sig för att vara, med deras riktiga domäner.
// Om adressen nämner namnet men inte hör till någon av domänerna är det troligen en förfalskning.
const KNOWN_BRANDS = [
  { name: "postnord", domains: ["postnord.se", "postnord.com"] },
  { name: "dhl", domains: ["dhl.com"] },
  { name: "swedbank", domains: ["swedbank.se"] },
  { name: "handelsbanken", domains: ["handelsbanken.se"] },
  { name: "nordea", domains: ["nordea.se", "nordea.com"] },
  { name: "microsoft", domains: ["microsoft.com", "microsoftonline.com"] },
  { name: "skatteverket", domains: ["skatteverket.se"] },
];

function isOnDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith("." + domain);
}
function isOfficialBrandSite(hostname, brand) {
  return brand.domains.some((domain) => isOnDomain(hostname, domain));
}

export function impersonatesKnownBrand(url) {
  const hostname = url.hostname;
  const isImpersonated = KNOWN_BRANDS.some(
    (brand) =>
      hostname.includes(brand.name) && !isOfficialBrandSite(hostname, brand),
  );
  if (isImpersonated) {
    return {
      reason:
        "Adressen använder namnet på ett känt företag eller en myndighet, men leder inte till deras riktiga webbplats.",
      weight: SIGNAL_WEIGHT.HIGH,
    };
  }
  return null;
}
