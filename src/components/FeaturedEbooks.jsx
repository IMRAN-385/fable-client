"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?limit=6`);
        const data = await res.json();
        setEbooks(data.ebooks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];

  return (
    <section className="px-6 md:px-10 lg:px-16 py-16 md:py-24" style={{ background: "var(--ink)" }}>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-px" style={{ background: "var(--ink-soft)" }} />
          <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
            Just Added
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl" style={{ color: "var(--ivory)" }}>
          Featured <span className="italic" style={{ color: "var(--gold)" }}>ebooks</span>
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`rounded-3xl aspect-[4/5] animate-pulse ${spans[i - 1]}`} style={{ background: "var(--ink-soft)" }} />
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          No ebooks available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {ebooks.map((ebook, i) => (
            <motion.div
              key={ebook._id}
              className={spans[i % spans.length]}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: "easeOut" }}
            >
              <Link
                href={`/ebooks/${ebook._id}`}
                className="group block relative rounded-3xl overflow-hidden aspect-[4/5]"
                style={{ background: "var(--parchment)" }}
              >
                <div className="absolute inset-y-0 left-0 w-2" style={{ background: "linear-gradient(180deg, var(--gold), var(--spine))" }} />

                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span
                  className="absolute top-4 right-4 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wide rotate-3"
                  style={{ background: "var(--spine)", color: "var(--ivory)" }}
                >
                  {ebook.genre}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl mb-1" style={{ color: "var(--ivory)" }}>
                    {ebook.title}
                  </h3>
                  <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                    by {ebook.writerName} · ${ebook.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}