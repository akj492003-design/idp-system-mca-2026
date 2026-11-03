import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";

let googleScriptPromise;

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    const script = existingScript || document.createElement("script");

    const onLoad = () => {
      if (window.google?.accounts?.oauth2) resolve();
      else reject(new Error("Google sign-in could not be initialized."));
    };
    const onError = () => reject(new Error("Could not load Google's sign-in service. Check your internet connection."));

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existingScript) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    googleScriptPromise = null;
    throw error;
  });

  return googleScriptPromise;
}

export default function GoogleAuthButton({ children = "Continue with Google", className = "", onError }) {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGoogleIdentityServices()
      .then(() => setGoogleReady(true))
      .catch((loadError) => setError(loadError.message));
  }, []);

  const handleGoogleClick = () => {
    setError("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      const message = "Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to your frontend .env file.";
      setError(message);
      onError?.(message);
      return;
    }

    if (!googleReady || !window.google?.accounts?.oauth2) {
      setError("Google sign-in is still loading. Please try again in a moment.");
      return;
    }

    try {
      setLoading(true);
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: "openid email profile",
        ux_mode: "popup",
        select_account: true,
        callback: async (response) => {
          if (response.error || !response.code) {
            setLoading(false);
            setError(response.error_description || "Google sign-in was cancelled. Please try again.");
            return;
          }
          try {
            await signInWithGoogle(response.code);
            navigate("/home", { replace: true });
          } catch (requestError) {
            setError(getApiErrorMessage(requestError, requestError.message || "Google sign-in failed."));
          } finally {
            setLoading(false);
          }
        },
        error_callback: (popupError) => {
          setLoading(false);
          setError(popupError?.type === "popup_closed" ? "Google sign-in was cancelled." : "The Google sign-in popup could not be opened.");
        },
      });
      client.requestCode();
    } catch (requestError) {
      setLoading(false);
      setError(requestError.message || "Unable to start Google sign-in.");
    }
  };

  return (
    <div className="w-full">
      <button type="button" onClick={handleGoogleClick} disabled={loading || !googleReady} className={`${className} disabled:cursor-wait disabled:opacity-60`}>
        {loading ? "Connecting to Google…" : !googleReady ? "Loading Google…" : children}
      </button>
      {error && <p className="mt-2 text-left text-xs text-rose-300" role="alert">{error}</p>}
    </div>
  );
}
