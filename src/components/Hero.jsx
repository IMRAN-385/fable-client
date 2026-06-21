"use client";
import { motion } from "framer-motion";

const cards = [
  { color: "#8B2635", top: "8%", left: "10%", rotate: -12, w: 120, h: 160, label: "Mystery" },
  { color: "#3A5A40", top: "5%", left: "70%", rotate: 10, w: 130, h: 170, label: "Sci-Fi" },
  { color: "#C9A227", top: "55%", left: "4%", rotate: 8, w: 110, h: 150, label: "Romance" },
  { color: "#5B4B8A", top: "60%", left: "80%", rotate: -8, w: 125, h: 165, label: "Fantasy" },
  { color: "#2F4858", top: "18%", left: "38%", rotate: -6, w: 100, h: 135, label: "Horror" },
  { color: "#9C5B3C", top: "65%", left: "45%", rotate: 6, w: 115, h: 150, label: "Fiction" },
];

function BookCard({ card, index }) {
  return (
    <motion.div
      className="absolute rounded-md shadow-2xl items-end p-3 hidden md:flex"
      style={{
        top: card.top,
        left: card.left,
        width: card.w,
        height: card.h,
        background: `linear-gradient(160deg, ${card.color}, #00000055)`,
      }}
      initial={{ opacity: 0, y: 40, rotate: card.rotate - 8 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        rotate: [card.rotate, card.rotate + 2, card.rotate],
      }}
      transition={{
        opacity: { duration: 0.8, delay: index * 0.12 },
        y: { duration: 6 + index, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 8 + index, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span className="font-mono text-xs uppercase tracking-wide" style={{ color: "var(--ivory)" }}>
        {card.label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {cards.map((card, i) => (
        <BookCard key={card.label} card={card} index={i} />
      ))}

      <motion.h1
        className="font-display font-black tracking-tight relative z-10"
        style={{ color: "var(--ivory)", fontSize: "clamp(3rem, 10vw, 7rem)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        FABLE
      </motion.h1>

      <motion.div
        className="flex items-center gap-3 mt-6 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
      >
        <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>
          Discover & read original
        </p>
        <span className="px-3 py-1 rounded-full font-mono text-sm border" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
          ebooks
        </span>
      </motion.div>

      <motion.a
        href="/ebooks"
        className="mt-8 px-6 py-3 rounded-full font-mono text-sm uppercase tracking-wide relative z-10"
        style={{ background: "var(--gold)", color: "var(--ink)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        Browse Ebooks
      </motion.a>

      <motion.div
        className="absolute bottom-8 right-8 font-mono text-xs"
        style={{ color: "var(--muted)" }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
}