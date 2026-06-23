"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const ToastContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <Providers>");
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      setToken(storedToken);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      const data = await res.json();
      if (data.success) {
        setUser({
          id: data.user._id || data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          photo: data.user.photo || null,
        });
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveAuth = useCallback((userData, tokenData) => {
    localStorage.setItem("token", tokenData);
    setToken(tokenData);
    setUser({
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      photo: userData.photo || null,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  const push = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const authValue = useMemo(
    () => ({ user, token, loading, refresh, saveAuth, logout, isAuthenticated: !!user }),
    [user, token, loading, refresh, saveAuth, logout]
  );

  const toastValue = useMemo(() => ({ push, toast: push }), [push]);

  const toastBg = (type) => {
    if (type === "error") return "#dc2626";
    if (type === "success") return "#16a34a";
    return "#1c1814";
  };

  return (
    <AuthContext.Provider value={authValue}>
      <ToastContext.Provider value={toastValue}>
        {children}
        <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="px-4 py-2 rounded-xl text-sm font-medium shadow-lg text-white"
              style={{ background: toastBg(t.type) }}
            >
              {t.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}