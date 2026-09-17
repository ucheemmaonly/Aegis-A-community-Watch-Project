import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, apiFetch } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until the initial /auth/me check resolves
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiFetch(
        "/auth/me",
        { method: "GET" },
        { on401: false },
      );
      setUser(me?.user ?? me ?? null);
      return me?.user ?? me ?? null;
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        return null;
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshUser();
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(
    async ({ email, password }) => {
      setError(null);
      await api.post("/auth/login", { email, password });

      const me = await refreshUser();
      return me;
    },
    [refreshUser],
  );

  const register = useCallback(
    async (payload) => {
      setError(null);
      await api.post("/auth/register", payload);
      const me = await refreshUser();
      return me;
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await api.patch("/auth/me", payload);
    const nextUser = updated?.user ?? updated;
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
