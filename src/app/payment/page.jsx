"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, loading } = useAuth();
  const [status, setStatus] = useState("verifying");

  const sessionId = searchParams.get("session_id");
  const ebookId = searchParams.get("ebookId");
  // ✅ FIX: this page previously only handled ebook purchases. Now it
  // also understands the writer-verification-fee flow (?type=publishing_fee).
  const type = searchParams.get("type") || "purchase";

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    if (loading) return;
    if (!token) {
      router.push(`/login?redirect=/payment?session_id=${sessionId}&ebookId=${ebookId}&type=${type}`);
      return;
    }

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
  }, [sessionId, token, loading, router, ebookId, type]);

  const handleContinue = () => {
    if (type === "publishing_fee") {
      // Full reload so the auth provider re-fetches /api/auth/profile
      // and picks up the new "writer" role server-side.
      window.location.href = "/dashboard/writer";
    } else {
      router.push(`/ebooks/${ebookId}`);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--paper)" }}
    >
      <div
        className="w-full max-w-md text-center p-10 rounded-3xl border"
        style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
      >
        {status === "verifying" && (
          <>
            <div
              className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--ink-900)" }}
            />
            <p className="text-sm" style={{ color: "var(--ink-500)" }}>
              Verifying payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
            >
              {type === "publishing_fee" ? "You're verified!" : "Payment Successful"}
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
              {type === "publishing_fee"
                ? "Your writer account is now active."
                : "Your ebook has been unlocked."}
            </p>
            <button onClick={handleContinue} className="btn btn-primary px-6 py-3 text-sm">
              {type === "publishing_fee" ? "Go to writer dashboard →" : "Read Now →"}
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-5xl mb-4">⚠️</p>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
            >
              Something went wrong
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-500)" }}>
              Payment could not be verified.
            </p>
            <button
              onClick={() => router.push(type === "publishing_fee" ? "/dashboard/verify-writer" : "/ebooks")}
              className="btn btn-outline px-6 py-3 text-sm"
            >
              {type === "publishing_fee" ? "Try again" : "Back to Library"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
