// VirusTotal identifierar en länk med länken själv, kodad som base64url utan "=".
// Länken kan inte skickas som den är, eftersom tecken som / och = skulle förstöra API-adressen.
function toUrlId(url) {
  return btoa(url.href) // Koda hela länken till base64. Varje tecken blir bokstäver och siffror. Går att avkoda tillbaka
    .replace(/\+/g, "-") // byter alla + mot - . Betyder något annat i webbadresser.
    .replace(/\//g, "_") // Byter alla / mot _ . / ser ut som en ny del av en adress.
    .replace(/=+$/, ""); //Tar bort utfyllnaden = i slutet för VirusTotal vill inte ha det i sin version.
}
