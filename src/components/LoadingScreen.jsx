"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Discover", "Read", "Imagine"];

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(onComplete, 400);
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between p-8" style={{ background: "var(--ink)" }}>
      <motion.span
        className="font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--muted)" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Fable
      </motion.span>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="font-display italic"
            style={{ color: "var(--ivory)", fontSize: "clamp(2rem, 6vw, 4.5rem)", opacity: 0.85 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.85 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-end">
        <div className="w-2/3 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(243,234,216,0.1)" }}>
          <div
            style={{
              height: "100%",
              width: `${count}%`,
              background: "linear-gradient(90deg, var(--gold), var(--spine))",
              boxShadow: "0 0 8px rgba(201,162,39,0.5)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <span className="font-display tabular-nums" style={{ color: "var(--ivory)", fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}