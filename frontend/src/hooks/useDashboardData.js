import { useEffect, useState } from "react";
import { getDashboard } from "../services/idpService.js";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const apiOrigin = new URL(apiBase, window.location.origin).origin;

export default function useDashboardData(refreshKey = null) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getDashboard(controller.signal)
      .then((payload) => {
        if (controller.signal.aborted) return;

        if (payload?.latest_document?.preview_url?.startsWith("/")) {
          payload.latest_document.preview_url =
            `${apiOrigin}${payload.latest_document.preview_url}`;
        }

        setData(payload ?? null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setData(null);
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

  return data;
}