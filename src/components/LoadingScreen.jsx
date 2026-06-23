"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Discover", "Read", "Imagine"];

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(onComplete, 300);
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between p-8" style={{ background: "var(--paper)" }}>
      <motion.span
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--ink-500)" }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Fable
      </motion.span>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            style={{
              color: "var(--ink-900)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontStyle: "italic",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-end">
        <div className="w-2/3 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
          <div
            style={{
              height: "100%",
              width: `${count}%`,
              background: "var(--ink-900)",
              transition: "width 0.08s linear",
            }}
          />
        </div>
        <span
          style={{
            color: "var(--ink-900)",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 4rem)",
          }}
        >
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}