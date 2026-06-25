"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function EbookCard({ ebook, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="shrink-0 w-44"
    >
      <Link
        href={`/ebooks/${ebook._id}`}
        className="group block rounded-2xl overflow-hidden border transition-shadow hover:shadow-md"
        style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {ebook.coverImage ? (
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: "var(--line)" }}>
              📖
            </div>
          )}
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
            style={{ background: "rgba(28,24,20,0.8)", color: "#fff" }}
          >
            {ebook.genre}
          </span>
          {ebook.status === "sold" && (
            <span
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
              style={{ background: "#dc2626", color: "#fff" }}
            >
              Sold
            </span>
          )}
        </div>
        <div className="p-3">
          <h3
            className="font-semibold text-sm leading-tight mb-1 line-clamp-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            {ebook.title}
          </h3>
          <p className="text-xs mb-1" style={{ color: "var(--ink-500)" }}>
            by {ebook.writerName}
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
            ${ebook.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="shrink-0 w-44 rounded-2xl overflow-hidden border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
      <div className="aspect-[3/4] animate-pulse" style={{ background: "var(--line)" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "80%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "55%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "35%" }} />
      </div>
    </div>
  );
}

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) { setError(true); setLoading(false); return; }

    fetch(`${apiUrl}/api/ebooks?limit=6`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setEbooks(d.ebooks?.slice(0, 6) || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-12" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <span
              className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-3"
              style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
            >
              Just Added
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
            >
              Featured <span style={{ fontStyle: "italic" }}>ebooks</span>
            </h2>
          </div>
          <Link
            href="/ebooks"
            className="text-sm font-medium hidden md:flex items-center gap-1 transition-colors"
            style={{ color: "var(--ink-500)" }}
          >
            View all →
          </Link>
        </motion.div>

        <div className="w-full border-b mb-6" style={{ borderColor: "var(--line)" }} />

        {error ? (
          <div className="text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>
              Could not load ebooks. Make sure <code className="px-1 rounded" style={{ background: "var(--line)" }}>NEXT_PUBLIC_API_URL</code> is set.
            </p>
            <Link href="/ebooks" className="text-sm underline" style={{ color: "var(--ink-700)" }}>Browse Library</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : ebooks.length === 0
              ? (
                <div className="col-span-full text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                  <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No ebooks yet.</p>
                  <Link href="/ebooks" className="text-sm underline" style={{ color: "var(--ink-700)" }}>Browse Library</Link>
                </div>
              )
              : ebooks.map((e, i) => <EbookCard key={e._id} ebook={e} index={i} />)
            }
          </div>
        )}

        <Link href="/ebooks" className="mt-4 inline-flex items-center gap-1 text-sm font-medium md:hidden" style={{ color: "var(--ink-500)" }}>
          View all →
        </Link>
      </div>
    </section>
  );
}