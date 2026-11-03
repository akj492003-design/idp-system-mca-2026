import { useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getSettings } from "../services/idpService.js";

function applyTheme(theme) {
  const normalized = theme === "light" ? "light" : "navy";
  document.documentElement.classList.toggle("light", normalized === "light");
  document.documentElement.classList.toggle("dark", normalized !== "light");
  document.documentElement.dataset.idpTheme = normalized;
  document.documentElement.style.colorScheme = normalized === "light" ? "light" : "dark";
}

export default function GlobalSettingsSync() {
  const { user, demoMode } = useAuth();

  useEffect(() => {
    if (!user) {
      applyTheme("navy");
      return undefined;
    }
    let active = true;
    const apply = (detail) => applyTheme(detail?.theme ?? detail?.settings?.theme ?? "navy");
    if (!demoMode) {
      getSettings().then((settings) => { if (active) apply(settings); }).catch(() => { if (active) applyTheme("navy"); });
    }
    const onChange = (event) => apply(event.detail);
    window.addEventListener("idp:settings-changed", onChange);
    return () => {
      active = false;
      window.removeEventListener("idp:settings-changed", onChange);
    };
  }, [user, demoMode]);

  return null;
}
