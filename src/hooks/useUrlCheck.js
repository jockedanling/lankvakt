import { assessLink, parseLink } from "@/analysis/verdict";
import { ApiError } from "@/services/apiErrors";
import { getUrlReport } from "@/services/virusTotal";
import { useEffect, useState } from "react";

export const VT_STATUS = Object.freeze({
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
});

// LänkVakts egna analys visas direkt. VirusTotal hämtas i bakgrunden och kan ta upp till
// 16 sekunder. När svaret kommer räknas bedömningen om med VirusTotal invägt.
export function useUrlCheck(link) {
  const [virusTotal, setVirusTotal] = useState({
    status: VT_STATUS.LOADING,
    report: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getUrlReport(parseLink(link))
      .then((report) => {
        if (isActive) {
          setVirusTotal({ status: VT_STATUS.DONE, report, error: null });
        }
      })
      .catch((error) => {
        if (!isActive) return;
        if (error instanceof ApiError) {
          setVirusTotal({ status: VT_STATUS.ERROR, report: null, error });
          return;
        }
        throw error;
      });

    return () => {
      isActive = false;
    };
  }, [link]);

  const { verdict, reasons } = assessLink(link, virusTotal.report);
  return { verdict, reasons, virusTotal };
}
