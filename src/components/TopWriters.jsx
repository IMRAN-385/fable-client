"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!configuredApiUrl) {
      setError("Missing NEXT_PUBLIC_API_URL. Set the frontend API URL in your environment.");
      setLoading(false);
      return;
    }

    const url = `${configuredApiUrl}/api/users/top-writers`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Server responded with ${r.status}`);
        return r.json();
      })
      .then((d) => setWriters(d.writers || []))
      .catch((err) => {
        console.error("TopWriters fetch failed:", err);
        setError(err.message || "Unable to load top writers at the moment.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "W";

  return (
    <section className="px-4 md:px-8 lg:px-12 py-12" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-3"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Community
          </span>
          <h2
            className="text-3xl md:text-4xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            Top <span style={{ fontStyle: "italic" }}>Writers</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--line)" }} />
            ))}
          </div>
        ) : error ? (
          <div className="card px-6 py-8 text-center border border-red-200 bg-red-50 text-red-700">
            <p className="text-lg font-semibold">Top writers unavailable</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : writers.length === 0 ? (
          <div className="card px-6 py-10 text-center border border-slate-200 bg-slate-50 text-slate-700">
            <p className="text-lg font-semibold">No top writers found</p>
            <p className="mt-2 text-sm">Check back later or ensure the backend has writer data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {writers.map((writer, i) => (
              <motion.div
                key={writer._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={`/ebooks?writerId=${writer._id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm"
                  style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink-700)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden"
                      style={{ background: "var(--line)", color: "var(--ink-900)" }}
                    >
                      {writer.photo
                        ? <img src={writer.photo} alt={writer.writerName} className="w-full h-full object-cover" />
                        : getInitials(writer.writerName)
                      }
                    </div>
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: "var(--ink-900)", color: "var(--paper)" }}
                    >
                      #{i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
                      {writer.writerName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-500)" }}>
                      {writer.totalSales} {writer.totalSales === 1 ? "sale" : "sales"}
                    </p>
                  </div>
                  <span className="text-sm group-hover:translate-x-1 transition-transform" style={{ color: "var(--ink-500)" }}>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}