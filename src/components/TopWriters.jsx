"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch3 = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/top-writers`);
        const data = await res.json();
        setWriters(data.writers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch3();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "W";

  return (
    <section className="px-6 md:px-10 lg:px-16 py-16 md:py-24" style={{ borderTop: "1px solid var(--ink-soft)" }}>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-px" style={{ background: "var(--ink-soft)" }} />
          <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
            Community
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl" style={{ color: "var(--ivory)" }}>
          Top <span className="italic" style={{ color: "var(--gold)" }}>Writers</span>
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl h-48 animate-pulse" style={{ background: "var(--ink-soft)" }} />
          ))}
        </div>
      ) : writers.length === 0 ? (
        <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          No sales data yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {writers.map((writer, i) => (
            <motion.div
              key={writer._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link
                href={`/ebooks?writerId=${writer._id}`}
                className="group flex items-center gap-5 p-6 rounded-3xl border transition-all duration-300"
                style={{
                  background: "var(--ink-soft)",
                  borderColor: "var(--ink-soft)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--ink-soft)";
                }}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display text-lg"
                    style={{
                      background: writer.photo
                        ? "transparent"
                        : "linear-gradient(135deg, var(--gold), var(--spine))",
                      color: "var(--ink)",
                    }}
                  >
                    {writer.photo ? (
                      <img src={writer.photo} alt={writer.writerName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getInitials(writer.writerName)
                    )}
                  </div>
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px]"
                    style={{ background: "var(--gold)", color: "var(--ink)" }}
                  >
                    #{i + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg truncate" style={{ color: "var(--ivory)" }}>
                    {writer.writerName}
                  </p>
                  <p className="font-mono text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {writer.totalSales} {writer.totalSales === 1 ? "sale" : "sales"}
                  </p>
                </div>

                <span className="font-mono text-xs group-hover:translate-x-1 transition-transform" style={{ color: "var(--gold)" }}>
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}