"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/Providers";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ebooks", label: "Browse Ebooks" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    setOpen(false);
    signOut({ redirect: false }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  const getDashboard = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  const links = [
    ...NAV_LINKS,
    ...(user ? [{ href: getDashboard(), label: "Dashboard" }] : []),
  ];

  return (
    <div className="pointer-events-none sticky top-0 z-40 flex justify-center px-4 pt-4 pb-2">
      <header className="pointer-events-auto w-full max-w-3xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-2 rounded-full border px-2 py-1.5 backdrop-blur-md transition-all duration-300"
          style={{
            background: "rgba(244, 240, 232, 0.85)",
            borderColor: "var(--line)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: scrolled
              ? "0 8px 32px -8px rgba(28,24,20,0.15)"
              : "0 2px 8px -2px rgba(28,24,20,0.08)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 shrink-0">
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-sm font-bold"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              ✦
            </span>
            <span
              className="text-base font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
            >
              Fable
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: isActive(l.href) ? "var(--ink-900)" : "transparent",
                  color: isActive(l.href) ? "var(--paper)" : "var(--ink-700)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2 pr-1">
            {loading ? (
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--ink-900)" }}
              />
            ) : user ? (
              // ✅ Logged in — show avatar + logout
              <div className="flex items-center gap-2">
                <Link
                  href={getDashboard()}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden border"
                    style={{
                      background: "var(--line)",
                      color: "var(--ink-900)",
                      borderColor: "var(--line)",
                    }}
                  >
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <span
                    className="text-sm font-medium max-w-[100px] truncate"
                    style={{ color: "var(--ink-900)" }}
                  >
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-black/5"
                  style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}
                >
                  Log out
                </button>
              </div>
            ) : (
              // ✅ Not logged in — show Login + Sign up
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-black/5"
                  style={{ color: "var(--ink-700)" }}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors hover:opacity-90"
                  style={{ background: "var(--ink-900)", color: "var(--paper)" }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-full p-2 transition-colors hover:bg-black/5"
            style={{ color: "var(--ink-700)" }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M6 6l12 12M18 6L6 18" : "M3 6h18M3 12h18M3 18h18"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl border p-3 shadow-lg md:hidden"
              style={{
                background: "rgba(244,240,232,0.95)",
                backdropFilter: "blur(12px)",
                borderColor: "var(--line)",
              }}
            >
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-medium"
                    style={{
                      background: isActive(l.href) ? "var(--ink-900)" : "transparent",
                      color: isActive(l.href) ? "var(--paper)" : "var(--ink-700)",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}

                <div
                  className="mt-2 flex gap-2 border-t pt-2"
                  style={{ borderColor: "var(--line)" }}
                >
                  {user ? (
                    <>
                      <Link
                        href={getDashboard()}
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2 rounded-xl text-sm text-center font-medium"
                        style={{ background: "var(--ink-900)", color: "var(--paper)" }}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex-1 py-2 rounded-xl text-sm border text-center"
                        style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2 rounded-xl text-sm border text-center"
                        style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2 rounded-xl text-sm text-center font-medium"
                        style={{ background: "var(--ink-900)", color: "var(--paper)" }}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}