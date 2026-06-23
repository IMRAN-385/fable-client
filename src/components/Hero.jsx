"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto text-center">
        <motion.span
          className="inline-flex items-center border rounded-full px-3 py-1 text-xs uppercase tracking-widest mb-6"
          style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Still Life
        </motion.span>

        <motion.h1
          className="text-5xl md:text-7xl font-semibold leading-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink-900)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Discover & Read
          <br />
          <span style={{ fontStyle: "italic" }}>Original Ebooks</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg max-w-xl mx-auto mb-10"
          style={{ color: "var(--ink-500)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Connect with talented writers. Browse, bookmark, and read original ebooks from emerging authors around the world.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link href="/ebooks" className="btn btn-primary px-6 py-3 text-sm">
            Browse Ebooks
          </Link>
          <Link href="/register" className="btn btn-outline px-6 py-3 text-sm">
            Start Writing →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}