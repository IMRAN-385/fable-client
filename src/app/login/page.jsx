"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Providers";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const QUICK_USERS = [
  {
    label: "Admin",
    sub: "Full platform control",
    email: "admin@fable.com",
    password: "Admin@123",
  },
  {
    label: "Writer",
    sub: "Publish & sell ebooks",
    email: "writer@fable.com",
    password: "writer123",
  },
  {
    label: "Reader",
    sub: "Browse & read",
    email: "reader@fable.com",
    password: "reader123",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRedirect = searchParams.get("redirect");
  const { user, loading, saveAuth } = useAuth();

  const getDashboardPath = (role) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "writer") return "/dashboard/writer";
    return "/";
  };

  useEffect(() => {
    if (!loading && user) {
      router.push(getDashboardPath(user.role));
    }
  }, [user, loading, router]);

  const next = nextRedirect || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submittingRef = useRef(false);

  const submit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
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
      router.push(nextRedirect || getDashboardPath(data.user.role));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
      submittingRef.current = false;
    }
  };

  const quickLogin = async (u) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
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
      router.push(nextRedirect || getDashboardPath(data.user.role));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
      submittingRef.current = false;
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

        {/* Card */}
        <div
          className="rounded-3xl border p-8"
          style={{
            background: "var(--paper-2)",
            borderColor: "var(--line)",
          }}
        >
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-4"
            style={{
              borderColor: "var(--ink-900)",
              color: "var(--ink-900)",
            }}
          >
            Welcome back
          </span>

          <h1
            className="text-3xl font-semibold mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-900)",
            }}
          >
            Sign in to Fable
          </h1>

          <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
            Keep reading and managing your library.
          </p>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs mb-1 block">Email</label>
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
              <label className="text-xs mb-1 block">Password</label>
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
              <p className="text-sm text-red-600">{err}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full text-sm font-medium disabled:opacity-50"
              style={{
                background: "var(--ink-900)",
                color: "var(--paper)",
              }}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <GoogleLoginButton />
          </form>

      
          <p className="text-center text-sm mt-5">
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

      
        <div className="mt-5">
          <p className="text-center text-xs uppercase tracking-widest mb-3">
            Or quick login as
          </p>

          <div className="grid grid-cols-3 gap-2">
            {QUICK_USERS.map((u) => (
              <button
                key={u.label}
                onClick={() => quickLogin(u)}
                disabled={busy}
                className="p-3 rounded-2xl border text-left disabled:opacity-50"
                style={{
                  background: "var(--paper-2)",
                  borderColor: "var(--line)",
                }}
              >
                <p className="text-sm font-semibold">{u.label}</p>
                <p className="text-xs text-gray-500">{u.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ✅ IMPORTANT: Suspense fallback fix */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}