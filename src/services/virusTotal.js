import {
    ApiError,
    InvalidApiKeyError,
    NetworkError,
    QuotaExceededError,
    TimeoutError,
} from "@/services/apiErrors";

const VT_BASE_URL = "https://www.virustotal.com/api/v3";
const VT_API_KEY = process.env.EXPO_PUBLIC_VT_API_KEY; // Expo läser .env-fil.
const REQUEST_TIMEOUT_MS = 10000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(VT_BASE_URL + path, {
      ...options,
      headers: { "x-apikey": VT_API_KEY, ...options.headers },
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new TimeoutError();
    }
    throw new NetworkError();
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401) throw new InvalidApiKeyError();
  if (response.status === 429) throw new QuotaExceededError();
  if (response.status === 404) return null;
  if (!response.ok)
    throw new ApiError("VirusTotal responded with HTTP " + response.status);

  return response.json();
}

// Hämtar VirusTotals senaste rapport för länken.
// Returnerar null om VirusTotal aldrig har sett länken.
export async function getUrlReport(url) {
  const report = await request("/urls/" + toUrlId(url));
  if (report === null) {
    return null;
  }
  const stats = report.data.attributes.last_analysis_stats;
  return {
    flagged: stats.malicious + stats.suspicious, // Tar ut två siffror ur stats, farliga och misstänksamma punkter.
    total: Object.values(stats).reduce((sum, count) => sum + count, 0), // gör om objektet till en lista och listan läggs ihop med reduce.
  };
}

// VirusTotal identifierar en länk med länken själv, kodad som base64url utan "=".
// Länken kan inte skickas som den är, eftersom tecken som / och = skulle förstöra API-adressen.
function toUrlId(url) {
  return btoa(url.href) // Koda hela länken till base64. Varje tecken blir bokstäver och siffror. Går att avkoda tillbaka
    .replace(/\+/g, "-") // byter alla + mot - . Betyder något annat i webbadresser.
    .replace(/\//g, "_") // Byter alla / mot _ . / ser ut som en ny del av en adress.
    .replace(/=+$/, ""); //Tar bort utfyllnaden = i slutet för VirusTotal vill inte ha det i sin version.
}
