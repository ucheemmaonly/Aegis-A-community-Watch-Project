import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, apiFetch, getToken, setToken, clearToken } from "../lib/api.js";

const AuthContext = createContext(null);

function extractToken(res) {
  if (!res || typeof res !== "object") return null;
  return res.token || res.accessToken || res.jwt || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = useCallback(async () => {
    try {
      if (!getToken()) {
        setUser(null);
        return null;
      }
      const me = await apiFetch(
        "/auth/me",
        { method: "GET" },
        { on401: false },
      );
      setUser(me?.user ?? me ?? null);
      return me?.user ?? me ?? null;
    } catch (err) {
      if (err.status === 401) {
        clearToken();
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
      const res = await api.post("/auth/login", { email, password });
      const token = extractToken(res);
      if (token) setToken(token);
      const me = await refreshUser();
      return me;
    },
    [refreshUser],
  );

  const register = useCallback(
    async (payload) => {
      setError(null);
      const res = await api.post("/auth/register", payload);
      const token = extractToken(res);
      if (token) setToken(token);
      const me = await refreshUser();
      return me;
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearToken();
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
