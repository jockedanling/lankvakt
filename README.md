# LänkVakt

LänkVakt låter dig kontrollera en länk innan du öppnar den. Skanna en QR-kod
eller klistra in en länk, så får du en bedömning – **Säker**, **Misstänkt** eller
**Farlig** – och en förklaring på enkel svenska.

Slutprojekt i SUM200 – Systemutveckling för mobila applikationer II, Högskolan Väst.

## Krav

- Node.js (LTS)
- Expo Go för **SDK 58** på telefonen
- Byggd och testad för iOS. Android fungerar men är mindre testat.

## Kom igång

1. Installera beroenden:
   ```bash
   npm install
   ```
2. Skapa en `.env`-fil från mallen:
   ```bash
   cp .env.example .env
   ```
3. Skaffa en gratis API-nyckel på [virustotal.com](https://www.virustotal.com)
   (skapa konto → API key) och klistra in den:
   ```
   EXPO_PUBLIC_VT_API_KEY=din-nyckel
   ```
   Alternativ få API-nyckel av ägaren.
   ```

   ```
4. Starta appen och skanna QR-koden med kameran (iOS) eller Expo Go (Android):
   ```bash
   npx expo start
   ```

## Utan API-nyckel

Appens egen analys fungerar ändå. VirusTotal-raden visar då "Appen saknar en
giltig nyckel till säkerhetstjänsterna" – det är inget fel i appen.

## Testa appen

| Skriv in                           | Förväntat resultat                                     |
| ---------------------------------- | ------------------------------------------------------ |
| `postnord-sverige.paket-spara.top` | Farlig (vibration och bekräftelse innan länken öppnas) |
| `http://bit.ly/test`               | Misstänkt                                              |
| `https://www.hv.se`                | Säker                                                  |
| `hej`                              | Felmeddelande: ingen webbadress                        |

## Mappstruktur

```
src/
├── app/         Skärmar och navigering (Expo Router)
├── analysis/    Den egna bedömningen: heuristiker och poängsättning
├── components/  Återanvändbara UI-komponenter
├── domain/      Gemensamma konstanter och feltyper
├── hooks/       Kopplar ihop skärmar med data (useUrlCheck)
├── services/    Anrop till VirusTotal
├── storage/     SQLite-databasen för historiken
├── theme/       Färger, avstånd och typsnitt
└── utils/       Hjälpfunktioner, t.ex. datumformat
```

Skärmarna i `app/` pratar med `hooks/`, som i sin tur använder `services/` och
`storage/`. `analysis/` är ren JavaScript utan React och kan testas för sig.

## Kända begränsningar

- VirusTotals gratiskvot är 4 anrop per minut.
- Förkortare med `www.`-prefix och IPv6-adresser flaggas inte.
- Reglerna för bedömningen (varumärken, toppdomäner, förkortare, misstänkta ord
  och vikter) kan bara ändras i koden. Ett administrationsgränssnitt där de kan
  uppdateras utan ny version av appen är en möjlig vidareutveckling.
