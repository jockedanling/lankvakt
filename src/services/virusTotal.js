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
const MAX_ANALYSIS_POLLS = 2;
const POLL_INTERVAL_MS = 8000;

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

// Väntar millisekunder. setTimeout har inget Promise och fungerar med en callback.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Uträkning av flagged och total.
function summarizeStats(stats) {
  return {
    flagged: stats.malicious + stats.suspicious, // Tar ut två siffror ur stats, farliga och misstänksamma punkter.
    total: Object.values(stats).reduce((sum, count) => sum + count, 0), // gör om objektet till en lista och listan läggs ihop med reduce.
  };
}

// Skickar in länken för analys och returnerar analysens id.
// VirusTotal vill ha länken som formulärdata, på samma sätt som HTML-formulär skickas.
async function submitUrl(url) {
  const response = await request("/urls", {
    method: "POST", // Skickar data
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: "url=" + encodeURIComponent(url.href),
  });
  return response.data.id;
}

// Gratiskvoten är 4 anrop per minut. GET + POST + 2 försök här = 4.
// Blir analysen inte klar i tid returneras null och appen litar på den egna analysen.
// Använda en for-loop som körs högst MAX_ANALYSIS_POLLS gånger.
async function waitForAnalysis(analysisId) {
  for (let attempt = 0; attempt < MAX_ANALYSIS_POLLS; attempt++) {
    await wait(POLL_INTERVAL_MS); // vänta i 8 sekunder.
    const analysis = await request("/analyses/" + analysisId);
    if (analysis.data.attributes.status === "completed") {
      // om status är "completed" returnerar statistiken.
      return analysis.data.attributes.stats;
    }
  }
  return null; // Om inte klar returneras null.
}

// Hämtar VirusTotals senaste rapport för länken.
// Returnerar null om VirusTotal aldrig har sett länken.
export async function getUrlReport(url) {
  const report = await request("/urls/" + toUrlId(url));
  if (report !== null) {
    return summarizeStats(report.data.attributes.last_analysis_stats);
  }

  const analysisId = await submitUrl(url);
  const stats = await waitForAnalysis(analysisId);
  return stats === null ? null : summarizeStats(stats); // om stats är null, ge null, annars sammanfatta.
}

// VirusTotal identifierar en länk med länken själv, kodad som base64url utan "=".
// Länken kan inte skickas som den är, eftersom tecken som / och = skulle förstöra API-adressen.
function toUrlId(url) {
  return btoa(url.href) // Koda hela länken till base64. Varje tecken blir bokstäver och siffror. Går att avkoda tillbaka
    .replace(/\+/g, "-") // byter alla + mot - . Betyder något annat i webbadresser.
    .replace(/\//g, "_") // Byter alla / mot _ . / ser ut som en ny del av en adress.
    .replace(/=+$/, ""); //Tar bort utfyllnaden = i slutet för VirusTotal vill inte ha det i sin version.
}
