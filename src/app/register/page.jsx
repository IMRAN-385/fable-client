"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

export default function RegisterPage() {
  const router = useRouter();
  const { saveAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      saveAuth(data.user, data.token);

      // ✅ FIX: previously choosing "Publish ebooks" instantly made the
      // account a writer for free. Now the backend always creates a
      // "user" and just flags pendingWriter=true if they asked for writer
      // access — so here we route them to pay the one-time verification
      // fee before they actually get writer privileges.
      if (data.user.pendingWriter) {
        router.push("/dashboard/verify-writer");
      } else {
        router.push("/");
      }
    } catch (e) {
      setErr(e.message);
    } finally {
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
        <div
          className="rounded-3xl border p-8"
          style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
        >
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-4"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Join Fable
          </span>

          <h1
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
            Join Fable to{" "}
            <span style={{ color: "#2563eb" }}>read, bookmark</span>, and{" "}
            <span style={{ color: "#d97706" }}>publish original ebooks</span>.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                Full name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handle}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handle}
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handle}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>
                  Confirm password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handle}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="text-xs mb-2 block" style={{ color: "var(--ink-700)" }}>
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "user" })}
                  className="p-3 rounded-2xl border text-left transition-all"
                  style={{
                    background: form.role === "user" ? "var(--paper)" : "transparent",
                    borderColor: form.role === "user" ? "var(--ink-900)" : "var(--line)",
                    boxShadow: form.role === "user" ? "0 2px 8px rgba(28,24,20,0.1)" : "none",
                  }}
                >
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--ink-900)" }}>
                    Read ebooks
                  </p>
                  <p className="text-xs" style={{ color: "#2563eb" }}>
                    I want to browse and read.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "writer" })}
                  className="p-3 rounded-2xl border text-left transition-all"
                  style={{
                    background: form.role === "writer" ? "var(--paper)" : "transparent",
                    borderColor: form.role === "writer" ? "var(--ink-900)" : "var(--line)",
                    boxShadow: form.role === "writer" ? "0 2px 8px rgba(28,24,20,0.1)" : "none",
                  }}
                >
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--ink-900)" }}>
                    Publish ebooks
                  </p>
                  <p className="text-xs" style={{ color: "#d97706" }}>
                    Requires a one-time verification fee.
                  </p>
                </button>
              </div>
            </div>

            {err && (
              <p className="text-sm" style={{ color: "#dc2626" }}>{err}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--ink-500)" }}>
            Already a member?{" "}
            <Link
              href="/login"
              style={{ color: "var(--ink-900)" }}
              className="underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
