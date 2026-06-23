"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Providers";

const QUICK_USERS = [
  { label: "Admin", sub: "Full platform control", email: "admin@fable.com", password: "Admin@123" },
  { label: "Writer", sub: "Publish & sell ebooks", email: "writer@fable.com", password: "writer123" },
  { label: "Reader", sub: "Browse & read", email: "reader@fable.com", password: "reader123" },
];

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("redirect") || "/";

  const { saveAuth, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.push(next);
  }, [isAuthenticated, router, next]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setErr("Please fill in all fields"); return; }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || "Login failed"); setBusy(false); return; }
      saveAuth(data.user, data.token);
      router.push(next);
    } catch {
      setErr("Network error");
      setBusy(false);
    }
  };

  const handleQuickLogin = async (u) => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: u.email, password: u.password }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || "Quick login failed"); setBusy(false); return; }
      saveAuth(data.user, data.token);
      router.push(next);
    } catch {
      setErr("Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--ink)" }}
    >
      <div className="w-full max-w-md">

        
        <div
          className="w-full p-8 rounded-2xl border"
          style={{ background: "var(--ink-soft)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span
            className="inline-flex items-center border rounded-full px-3 py-1 text-xs font-mono uppercase tracking-widest"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Welcome back
          </span>

          <h1
            className="mt-4 font-display text-3xl font-semibold"
            style={{ color: "var(--ivory)" }}
          >
            Sign in to Fable
          </h1>
          <p className="mt-1 text-sm font-mono" style={{ color: "var(--muted)" }}>
            Keep reading and managing your library.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1  block text-xs font-mono" style={{ color: "var(--muted)" }}>
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-xl font-mono text-sm outline-none border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--ivory)",
                  borderColor: "rgba(1,1,1,1)",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-mono" style={{ color: "var(--muted)" }}>
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-xl font-mono text-sm outline-none border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--ivory)",
                  borderColor: "rgba(1,1,1,1)",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {err && <p className="text-sm font-mono" style={{ color: "var(--spine)" }}>{err}</p>}

            <button
              disabled={busy}
              className="w-full py-3 rounded-full font-mono text-sm uppercase tracking-wide transition-transform hover:scale-[1.02] disabled:opacity-50 "
              style={{ background: "var(--gold)", color: "var(--ink)" }}
              type="submit"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-full font-mono text-sm border transition-all hover:border-white/30"
              style={{ background: "transparent", color: "var(--ivory)", borderColor: "rgba(1,1,1,1)" }}
              onClick={() => alert("Google login coming soon.")}
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-mono" style={{ color: "var(--muted)" }}>
            New here?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4"
              style={{ color: "var(--ivory)" }}
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Quick Login */}
        <div className="mt-5">
          <p
            className="mb-3 text-center text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Or quick login as
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_USERS.map((u) => (
              <button
                key={u.label}
                onClick={() => handleQuickLogin(u)}
                disabled={busy}
                className="p-3 text-left rounded-xl border transition-all hover:border-yellow-500/50 disabled:opacity-50"
                style={{
                  background: "var(--ink-soft)",
                  borderColor: "rgba(1,1,1,1)",
                }}
              >
                <p className="text-sm font-semibold font-mono" style={{ color: "var(--ivory)" }}>
                  {u.label}
                </p>
                <p className="mt-0.5 text-xs font-mono" style={{ color: "var(--muted)" }}>
                  {u.sub}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}