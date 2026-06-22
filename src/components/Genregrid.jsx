"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const genres = [
  { name: "Fiction", icon: "📖", color: "#2F4858" },
  { name: "Mystery", icon: "🔍", color: "#8B2635" },
  { name: "Romance", icon: "🌹", color: "#7B3F5E" },
  { name: "Sci-Fi", icon: "🚀", color: "#3A5A40" },
  { name: "Fantasy", icon: "🧙", color: "#5B4B8A" },
  { name: "Horror", icon: "🌑", color: "#1a1a2e" },
  { name: "Biography", icon: "👤", color: "#4A4A2F" },
  { name: "History", icon: "🏛️", color: "#5C3D2E" },
];

export default function GenreGrid() {
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
            Browse by
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl" style={{ color: "var(--ivory)" }}>
          Explore <span className="italic" style={{ color: "var(--gold)" }}>Genres</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {genres.map((genre, i) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <Link
              href={`/ebooks?genre=${genre.name}`}
              className="group flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border text-center transition-all duration-300 h-full"
              style={{
                background: genre.color + "33",
                borderColor: genre.color + "55",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = genre.color + "66";
                e.currentTarget.style.borderColor = genre.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = genre.color + "33";
                e.currentTarget.style.borderColor = genre.color + "55";
              }}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {genre.icon}
              </span>
              <span className="font-mono text-sm uppercase tracking-wide" style={{ color: "var(--ivory)" }}>
                {genre.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}