import { assessLink, parseLink } from "@/analysis/verdict";
import { ApiError } from "@/services/apiErrors";
import { getUrlReport } from "@/services/virusTotal";
import { getCheck, updateVirusTotal } from "@/storage/historyRepository";
import { useEffect, useState } from "react";

export const VT_STATUS = Object.freeze({
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
});

// Hämtar den sparade kontrollen. Om VirusTotal inte har svarat tidigare frågas det nu,
// och svaret sparas i databasen så att historiken visar samma sak nästa gång.
export function useUrlCheck(id) {
  const [check, setCheck] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [virusTotal, setVirusTotal] = useState({
    status: VT_STATUS.LOADING,
    report: null,
    error: null,
  });
  const [notFound, setNotFound] = useState(false);

  // Ökar räknaren, som finns i effektens beroendelista, så att VirusTotal frågas på nytt.
  const retry = () => {
    setVirusTotal({
      status: VT_STATUS.LOADING,
      report: null,
      error: null,
    });
    setRetryCount((count) => count + 1);
  };

  useEffect(() => {
    let isActive = true; // Säkerställa att inte flera anrops gör i onödan.

    async function load() {
      const saved = await getCheck(Number(id)); // Route-parameteter är alltid text.
      if (!isActive) return;
      if (saved === null) {
        setNotFound(true);
        return;
      }
      setCheck(saved);

      // Redan sparat svar: visa det direkt, utan nytt anrop och det ska spara kvot på API-kvoteringen
      if (saved.virusTotalReport !== null) {
        setVirusTotal({
          status: VT_STATUS.DONE,
          report: saved.virusTotalReport,
          error: null,
        });
        return;
      }

      try {
        const report = await getUrlReport(parseLink(saved.link));
        const { verdict } = assessLink(saved.link, report);
        //Sparas även om skärmen har stängts, så att historiken blir komplett
        await updateVirusTotal(saved.id, verdict, report);
        if (!isActive) return;
        setCheck({ ...saved, verdict, virusTotalReport: report });
        setVirusTotal({ status: VT_STATUS.DONE, report, error: null });
      } catch (error) {
        if (!isActive) return;
        if (error instanceof ApiError) {
          setVirusTotal({ status: VT_STATUS.ERROR, report: null, error });
          return;
        }
        throw error;
      }
    }
    load();
    return () => {
      isActive = false;
    };
  }, [id, retryCount]);

  return { check, virusTotal, retry, notFound };
}
