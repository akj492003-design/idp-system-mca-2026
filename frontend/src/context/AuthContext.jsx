import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentUser,
  loginWithGoogleCode,
  loginWithPassword,
  logoutFromServer,
} from "../services/authService";

const AuthContext = createContext(null);

// Demo mode must be explicitly requested. Normal development and production now use the Flask API.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_USER = {
  id: "docupilot-demo-user",
  name: "Demo User",
  full_name: "Demo User",
  email: "demo@docupilot.local",
  initials: "DU",
  role: "demo",
  isDemo: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const initialSessionCheckStarted = useRef(false);

  const refreshUser = useCallback(async () => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      setCheckingSession(false);
      return DEMO_USER;
    }

    try {
      const currentUser = await getCurrentUser();
      const authenticatedUser = currentUser?.authenticated === false ? null : currentUser?.user ?? currentUser;
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    // React Strict Mode replays effects in development; avoid duplicate /auth/me calls.
    if (initialSessionCheckStarted.current) return;
    initialSessionCheckStarted.current = true;
    refreshUser();
  }, [refreshUser]);

  const signIn = useCallback(async (credentials) => {
    if (DEMO_MODE) {
      const demoUser = {
        ...DEMO_USER,
        email: credentials?.email || DEMO_USER.email,
      };
      setUser(demoUser);
      return demoUser;
    }

    const result = await loginWithPassword(credentials);
    const nextUser = result?.user ?? result?.profile ?? null;
    if (!nextUser) throw new Error("The server did not return an authenticated user.");
    setUser(nextUser);
    return nextUser;
  }, []);

  const signInWithGoogle = useCallback(async (code) => {
    if (DEMO_MODE) {
      throw new Error("Google sign-in is unavailable in demo mode. Configure the Flask backend and Google OAuth first.");
    }
    const result = await loginWithGoogleCode(code);
    const nextUser = result?.user ?? result?.profile ?? null;
    if (!nextUser) throw new Error("Google sign-in succeeded but the server did not return a user profile.");
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(async () => {
    if (!DEMO_MODE) await logoutFromServer();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    checkingSession,
    refreshUser,
    signIn,
    signInWithGoogle,
    signOut,
    demoMode: DEMO_MODE,
  }), [user, checkingSession, refreshUser, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
