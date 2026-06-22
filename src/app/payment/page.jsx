"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [status, setStatus] = useState("verifying");

  const sessionId = searchParams.get("session_id");
  const ebookId = searchParams.get("ebookId");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    const confirm = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/confirm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    confirm();
  }, [sessionId, token]);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--ink)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-10 rounded-3xl max-w-md w-full"
        style={{ background: "var(--ink-soft)" }}
      >
        {status === "verifying" && (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-6" style={{ borderColor: "var(--gold)" }} />
            <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Verifying payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-5xl mb-6">🎉</p>
            <h2 className="font-display text-3xl mb-3" style={{ color: "var(--ivory)" }}>Payment Successful</h2>
            <p className="font-mono text-sm mb-8" style={{ color: "var(--muted)" }}>Your ebook has been unlocked.</p>
            <button
              onClick={() => router.push(`/ebooks/${ebookId}`)}
              className="px-6 py-3 rounded-full font-mono text-sm"
              style={{ background: "var(--gold)", color: "var(--ink)" }}
            >
              Read Now →
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-5xl mb-6">⚠️</p>
            <h2 className="font-display text-3xl mb-3" style={{ color: "var(--ivory)" }}>Something went wrong</h2>
            <p className="font-mono text-sm mb-8" style={{ color: "var(--muted)" }}>Payment could not be verified.</p>
            <button
              onClick={() => router.push("/ebooks")}
              className="px-6 py-3 rounded-full font-mono text-sm"
              style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
            >
              Back to Library
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}