"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

function SkeletonDetail() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-3xl aspect-[3/4] animate-pulse" style={{ background: "var(--ink-soft)" }} />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-full h-6 animate-pulse" style={{ background: "var(--ink-soft)", width: `${80 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setEbook(data.ebook);
        setIsOwner(data.isOwner || false);
        setIsPurchased(data.isPurchasedByUser || false);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEbook();
  }, [id, token]);

  const handleBuy = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setBuyLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/purchase/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      router.push("/login");
      return;
    }

    try {
      setBookmarkLoading(true);
      const method = isBookmarked ? "DELETE" : "POST";
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmark/${ebook._id}`,
        {
          method,
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

  if (loading) return <SkeletonDetail />;

  if (notFound) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6">
        <p className="font-display text-4xl" style={{ color: "var(--ivory)" }}>
          Ebook not found
        </p>
        <Link
          href="/ebooks"
          className="px-6 py-3 rounded-full font-mono text-sm"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16"
      style={{ background: "var(--ink)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-2 font-mono text-sm mb-10"
          style={{ color: "var(--muted)" }}
        >
          ← Back to Library
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl"
          >
            <div
              className="absolute inset-y-0 left-0 w-2"
              style={{
                background:
                  "linear-gradient(180deg, var(--gold), var(--spine))",
              }}
            />
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-display text-6xl"
                style={{ background: "var(--ink-soft)", color: "var(--muted)" }}
              >
                📖
              </div>
            )}
            <span
              className="absolute top-4 right-4 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wide rotate-2"
              style={{ background: "var(--spine)", color: "var(--ivory)" }}
            >
              {ebook.genre}
            </span>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <h1
                className="font-display text-3xl md:text-4xl leading-tight mb-3"
                style={{ color: "var(--ivory)" }}
              >
                {ebook.title}
              </h1>
              <Link
                href={`/ebooks?writerId=${ebook.writerId}`}
                className="font-mono text-sm hover:underline"
                style={{ color: "var(--gold)" }}
              >
                by {ebook.writerName}
              </Link>
            </div>

            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {ebook.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <div
                className="px-4 py-2 rounded-2xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-wide mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  Price
                </p>
                <p
                  className="font-display text-xl"
                  style={{ color: "var(--gold)" }}
                >
                  ${ebook.price}
                </p>
              </div>

              <div
                className="px-4 py-2 rounded-2xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-wide mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  Status
                </p>
                <p
                  className="font-display text-xl"
                  style={{
                    color:
                      ebook.status === "sold"
                        ? "var(--spine)"
                        : "var(--ivory)",
                  }}
                >
                  {ebook.status === "sold" ? "Sold Out" : "Available"}
                </p>
              </div>

              <div
                className="px-4 py-2 rounded-2xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-wide mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  Added
                </p>
                <p
                  className="font-display text-xl"
                  style={{ color: "var(--ivory)" }}
                >
                  {new Date(ebook.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {isOwner ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-full font-mono text-sm opacity-40 cursor-not-allowed"
                  style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
                >
                  Your own ebook
                </button>
              ) : isPurchased ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-full font-mono text-sm opacity-60 cursor-not-allowed"
                  style={{ background: "var(--ink-soft)", color: "var(--gold)" }}
                >
                  ✓ Already Purchased
                </button>
              ) : ebook.status === "sold" ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-full font-mono text-sm opacity-40 cursor-not-allowed"
                  style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="px-6 py-3 rounded-full font-mono text-sm transition-transform hover:scale-105"
                  style={{ background: "var(--gold)", color: "var(--ink)" }}
                >
                  {buyLoading ? "Redirecting..." : "Buy Now →"}
                </button>
              )}

              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className="px-6 py-3 rounded-full font-mono text-sm border transition-all"
                style={{
                  borderColor: isBookmarked ? "var(--gold)" : "var(--ink-soft)",
                  color: isBookmarked ? "var(--gold)" : "var(--muted)",
                  background: "transparent",
                }}
              >
                {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
            </div>

            {/* Full content after purchase */}
            {isPurchased && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-6 rounded-2xl"
                style={{
                  background: "var(--ink-soft)",
                  border: "1px solid var(--gold)",
                }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-wide mb-3"
                  style={{ color: "var(--gold)" }}
                >
                  Full Content
                </p>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "var(--ivory)" }}
                >
                  {ebook.description}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}