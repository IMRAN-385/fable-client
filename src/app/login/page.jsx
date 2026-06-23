"use client";
import { useState, Suspense } from "react";
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
  const searchParams = useSearchParams();
  const next = searchParams.get("redirect") || "/";
  const { saveAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      saveAuth(data.user, data.token);
      router.push(next);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  const quickLogin = async (u) => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: u.email, password: u.password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      saveAuth(data.user, data.token);
      router.push(next);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  const inputStyle = {
    background: "var(--paper)",
    borderColor: "var(--line)",
    color: "var(--ink-900)",
    outline: "none",
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--paper)" }}
    >
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div
          className="rounded-3xl border p-8"
          style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
        >
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-4"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Welcome back
          </span>

          <h1
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            Sign in to Fable
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
            Keep reading and managing your library.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            {err && (
              <p className="text-sm" style={{ color: "#dc2626" }}>{err}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full text-sm font-medium disabled:opacity-50 transition-opacity"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-full text-sm border transition-colors"
              style={{
                background: "transparent",
                color: "var(--ink-700)",
                borderColor: "var(--line)",
              }}
              onClick={() => alert("Google login coming soon.")}
            >
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--ink-500)" }}>
            New here?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4"
              style={{ color: "var(--ink-900)" }}
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Quick Login */}
        <div className="mt-5">
          <p
            className="text-center text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--ink-500)" }}
          >
            Or quick login as
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_USERS.map((u) => (
              <button
                key={u.label}
                onClick={() => quickLogin(u)}
                disabled={busy}
                className="p-3 text-left rounded-2xl border transition-all hover:shadow-sm disabled:opacity-50"
                style={{
                  background: "var(--paper-2)",
                  borderColor: "var(--line)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#eab308";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line)";
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--ink-900)" }}
                >
                  {u.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>
                  {u.sub}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}