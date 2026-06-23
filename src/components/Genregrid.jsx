"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  BookOpen,
  Search,
  Heart,
  Rocket,
  Wand2,
  Skull,
  User,
  Landmark,
} from "lucide-react";

const genres = [
  { name: "Fiction", icon: BookOpen },
  { name: "Mystery", icon: Search },
  { name: "Romance", icon: Heart },
  { name: "Sci-Fi", icon: Rocket },
  { name: "Fantasy", icon: Wand2 },
  { name: "Horror", icon: Skull },
  { name: "Biography", icon: User },
  { name: "History", icon: Landmark },
];

export default function GenreGrid() {
  return (
    <section
      className="px-4 md:px-8 lg:px-12 py-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-3"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Browse by
          </span>

          <h2
            className="text-3xl md:text-4xl font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-900)",
            }}
          >
            Explore <span style={{ fontStyle: "italic" }}>Genres</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {genres.map((genre, i) => {
            const Icon = genre.icon;

            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/ebooks?genre=${genre.name}`}
                  className="group flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm"
                  style={{
                    background: "var(--paper-2)",
                    borderColor: "var(--line)",
                  }}
                >
                  {/* ICON FIXED */}
                  <Icon
                    size={20}
                    className="text-[var(--ink-900)] group-hover:scale-110 transition-transform duration-200"
                  />

                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink-900)" }}
                  >
                    {genre.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}