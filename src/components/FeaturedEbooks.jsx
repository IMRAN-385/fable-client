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
      className="w-full"
    >
      <Link
        href={`/ebooks/${ebook._id}`}
        className="group block rounded-2xl overflow-hidden border transition-shadow hover:shadow-md"
        style={{
          background: "var(--paper-2)",
          borderColor: "var(--line)",
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {ebook.coverImage ? (
            <img
              loading="lazy"
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: "var(--line)" }}
            >
              📖
            </div>
          )}

          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
            style={{
              background: "rgba(28,24,20,0.8)",
              color: "#fff",
            }}
          >
            {ebook.genre}
          </span>

          {ebook.status === "sold" && (
            <span
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
              style={{
                background: "#dc2626",
                color: "#fff",
              }}
            >
              Sold
            </span>
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-base leading-tight mb-2 line-clamp-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-900)",
            }}
          >
            {ebook.title}
          </h3>

          <p
            className="text-sm mb-2"
            style={{ color: "var(--ink-500)" }}
          >
            by {ebook.writerName}
          </p>

          <p
            className="text-lg font-bold"
            style={{ color: "var(--ink-900)" }}
          >
            ${ebook.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden border"
      style={{
        background: "var(--paper-2)",
        borderColor: "var(--line)",
      }}
    >
      <div
        className="aspect-[3/4] animate-pulse"
        style={{ background: "var(--line)" }}
      />

      <div className="p-4 space-y-3">
        <div
          className="h-4 rounded animate-pulse"
          style={{ background: "var(--line)" }}
        />
        <div
          className="h-4 w-2/3 rounded animate-pulse"
          style={{ background: "var(--line)" }}
        />
        <div
          className="h-4 w-1/3 rounded animate-pulse"
          style={{ background: "var(--line)" }}
        />
      </div>
    </div>
  );
}

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError("NEXT_PUBLIC_API_URL missing");
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/ebooks?limit=6`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server Error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("EBOOKS API:", data);
        setEbooks(data.ebooks || []);
      })
      .catch((err) => {
        console.error("FeaturedEbooks Error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section
      className="px-4 md:px-8 lg:px-12 py-12"
      style={{
        borderTop: "1px solid var(--line)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <span
              className="inline-flex items-center border rounded-full px-3 py-1 text-xs uppercase tracking-widest mb-3"
              style={{
                borderColor: "var(--ink-900)",
                color: "var(--ink-900)",
              }}
            >
              Just Added
            </span>

            <h2
              className="text-3xl md:text-4xl font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink-900)",
              }}
            >
              Featured <span className="italic">ebooks</span>
            </h2>
          </div>

          <Link
            href="/ebooks"
            className="hidden md:block text-sm font-medium"
            style={{ color: "var(--ink-500)" }}
          >
            View all →
          </Link>
        </motion.div>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              Failed to load ebooks
            </p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : ebooks.map((ebook, i) => (
                  <EbookCard
                    key={ebook._id}
                    ebook={ebook}
                    index={i}
                  />
                ))}
          </div>
        )}

        {!loading && ebooks.length === 0 && !error && (
          <div className="text-center py-10">
            No ebooks found
          </div>
        )}
      </div>
    </section>
  );
}