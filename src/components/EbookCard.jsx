"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function EbookCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
    >
      <div
        className="aspect-[3/4] animate-pulse"
        style={{ background: "var(--line)" }}
      />
      <div className="p-3 space-y-2">
        <div
          className="h-3 rounded-full animate-pulse"
          
          style={{ background: "var(--line)", width: "80%" }}
        />
        <div
          className="h-3 rounded-full animate-pulse"
          style={{ background: "var(--line)", width: "60%" }}
        />
        <div
          className="h-3 rounded-full animate-pulse"
          style={{ background: "var(--line)", width: "40%" }}
        />
      </div>
    </div>
  );
}

export function EbookCard({ ebook, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/ebooks/${ebook._id}`}
        className="group block rounded-2xl overflow-hidden border hover:shadow-md transition-all duration-200"
        style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {ebook.coverImage ? (
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            style={{ color: "var(--ink-900)" }}
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