"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

export default function VerifyWriterPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handlePay = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/writer-verification-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not start checkout");
      window.location.href = data.url;
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  if (user?.role === "writer" || user?.role === "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--paper)" }}>
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
            You're already a writer 🎉
          </p>
          <button onClick={() => router.push("/dashboard/writer")} className="btn btn-primary px-6 py-2.5 text-sm mt-3">
            Go to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--paper)" }}>
      <div
        className="w-full max-w-md rounded-3xl border p-8 text-center"
        style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
      >
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
        >
          Become a Verified Writer
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
          A one-time verification fee unlocks writer tools: publishing ebooks,
          tracking sales, and managing your catalog.
        </p>

        {err && <p className="text-sm mb-4" style={{ color: "#dc2626" }}>{err}</p>}

        <button
          onClick={handlePay}
          disabled={busy}
          className="w-full py-3 rounded-full text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--ink-900)", color: "var(--paper)" }}
        >
          {busy ? "Redirecting…" : "Pay verification fee →"}
        </button>
      </div>
    </main>
  );
}
