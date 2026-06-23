"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function EbookCard({ ebook }) {
  return (
    <Link
      href={`/ebooks/${ebook._id}`}
      className="group shrink-0 w-44 rounded-2xl overflow-hidden border hover:shadow-md transition-all duration-200"
      style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(28,24,20,0.75)", color: "#fff" }}
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
  );
}

function SkeletonCard() {
  return (
    <div
      className="shrink-0 w-44 rounded-2xl overflow-hidden border"
      style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
    >
      <div className="aspect-[3/4] animate-pulse" style={{ background: "var(--line)" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "80%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "60%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "40%" }} />
      </div>
    </div>
  );
}

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?limit=8&sort=newest`)
      .then((r) => r.json())
      .then((d) => setEbooks(d.ebooks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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
              Featured ebooks
            </h2>
          </div>
          <Link
            href="/ebooks"
            className="text-sm font-medium hidden md:inline-flex items-center gap-1"
            style={{ color: "var(--ink-700)" }}
          >
            View all →
          </Link>
        </div>

        <div
          className="w-full border-b mb-6"
          style={{ borderColor: "var(--line)" }}
        />

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : ebooks.length === 0
            ? (
              <p className="text-sm" style={{ color: "var(--ink-500)" }}>
                No ebooks yet. Check back soon!
              </p>
            )
            : ebooks.map((e) => <EbookCard key={e._id} ebook={e} />)}
        </div>

        <Link
          href="/ebooks"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium md:hidden"
          style={{ color: "var(--ink-700)" }}
        >
          View all →
        </Link>
      </div>
    </section>
  );
}