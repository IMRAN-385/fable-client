"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

function SkeletonDetail() {
  return (
    <main className="min-h-screen pt-6 pb-16 px-4 md:px-8 lg:px-12" style={{ background: "var(--paper)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-2xl aspect-[3/4] animate-pulse" style={{ background: "var(--line)" }} />
        <div className="flex flex-col gap-4 pt-4">
          {[80, 60, 40, 90, 50].map((w, i) => (
            <div key={i} className="h-4 rounded-full animate-pulse" style={{ background: "var(--line)", width: `${w}%` }} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, loading } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setEbook(data.ebook);
        setIsOwner(data.isOwner || false);
        setIsPurchased(data.isPurchasedByUser || false);
      } catch {
        setNotFound(true);
      } finally {
        setPageLoading(false);
      }
    };
    fetchEbook();
  }, [id, token]);

  const handleBuy = async () => {
    if (!user) {
      if (loading) return;
      router.push(`/login?redirect=/ebooks/${id}`);
      return;
    }
    if (!token) {
      router.push(`/login?redirect=/ebooks/${id}`);
      return;
    }
    try {
      setBuyLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ebookId: ebook._id }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    } finally {
      setBuyLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      if (loading) return;
      router.push(`/login?redirect=/ebooks/${id}`);
      return;
    }
    try {
      setBookmarkLoading(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmark/${ebook._id}`,
        {
          method: isBookmarked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (pageLoading) return <SkeletonDetail />;

  if (notFound) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4" style={{ background: "var(--paper)" }}>
        <p className="text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--line)" }}>404</p>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Ebook not found
        </h1>
        <Link href="/ebooks" className="btn btn-primary px-6 py-2.5 text-sm">
          Back to Library
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-6 pb-16 px-4 md:px-8 lg:px-12" style={{ background: "var(--paper)" }}>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-1 text-sm mb-8"
          style={{ color: "var(--ink-500)" }}
        >
          ← Back to Library
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg"
            style={{ background: "var(--line)" }}
          >
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📖</div>
            )}
            <span
              className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: "rgba(28,24,20,0.75)", color: "#fff" }}
            >
              {ebook.genre}
            </span>
            {ebook.status === "sold" && !isPurchased && (
              <span
                className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase"
                style={{ background: "#dc2626", color: "#fff" }}
              >
                Sold Out
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5 justify-center"
          >
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold leading-tight mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
              >
                {ebook.title}
              </h1>
              <Link
                href={`/ebooks?writerId=${ebook.writerId}`}
                className="text-sm hover:underline"
                style={{ color: "var(--ink-500)" }}
              >
                by {ebook.writerName}
              </Link>
            </div>

            {/* This is always just the public preview/blurb */}
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-700)" }}>
              {ebook.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Price", value: `$${ebook.price}` },
                { label: "Genre", value: ebook.genre },
                { label: "Status", value: ebook.status === "sold" ? "Sold Out" : "Available" },
                { label: "Added", value: new Date(ebook.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
              ].map((m) => (
                <div
                  key={m.label}
                  className="px-4 py-2.5 rounded-2xl border"
                  style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
                >
                  <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "var(--ink-500)" }}>
                    {m.label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {isOwner ? (
                <button
                  disabled
                  className="btn btn-outline px-6 py-2.5 text-sm opacity-40 cursor-not-allowed"
                >
                  Your own ebook
                </button>
              ) : isPurchased ? (
                <button
                  disabled
                  className="px-6 py-2.5 rounded-full text-sm font-medium opacity-70 cursor-not-allowed border"
                  style={{ borderColor: "#16a34a", color: "#16a34a" }}
                >
                  ✓ Already Purchased
                </button>
              ) : ebook.status === "sold" ? (
                <button
                  disabled
                  className="btn btn-outline px-6 py-2.5 text-sm opacity-40 cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
                >
                  {buyLoading ? "Redirecting…" : "Buy Now →"}
                </button>
              )}

              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className="px-6 py-2.5 rounded-full text-sm font-medium border transition-all"
                style={{
                  borderColor: isBookmarked ? "var(--ink-900)" : "var(--line)",
                  color: isBookmarked ? "var(--ink-900)" : "var(--ink-500)",
                  background: isBookmarked ? "var(--paper-2)" : "transparent",
                }}
              >
                {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
            </div>

            {/* Full content after purchase — ✅ FIX: uses ebook.fullContent
                (only present in the API response once you actually own
                or purchased the book) instead of repeating `description`. */}
            {isPurchased || isOwner ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border"
                style={{ background: "var(--paper-2)", borderColor: "#86efac" }}
              >
                <p
                  className="text-xs uppercase tracking-wide mb-2 font-semibold"
                  style={{ color: "#16a34a" }}
                >
                  ✓ Full Content Unlocked
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--ink-700)" }}>
                  {ebook.fullContent || "No content available."}
                </p>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
