"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from"../../context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ebooks", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
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
    router.push("/");
  };

  const getDashboard = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  const links = NAV_LINKS.map((l) =>
    l.href === "/dashboard" ? { ...l, href: getDashboard() } : l
  );

  return (
    <div className="pointer-events-none sticky top-0 z-40 flex justify-center px-4 pt-4 pb-2">
      <header className="pointer-events-auto w-full max-w-3xl">
        <div
          className="flex items-center justify-between gap-2 rounded-full border px-2 py-1.5 backdrop-blur-md transition-shadow"
          style={{
            background: "rgba(244, 240, 232, 0.92)",
            borderColor: "var(--line)",
            boxShadow: scrolled
              ? "0 8px 32px -8px rgba(28,24,20,0.15)"
              : "0 2px 8px -2px rgba(28,24,20,0.08)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 shrink-0">
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-sm"
              style={{ background: "var(--ink-900)", color: "var(--paper)" }}
            >
              ✦
            </span>
            <span
              className="text-base font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink-900)",
              }}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 pr-1">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline text-sm px-4 py-1.5">
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost text-sm px-3 py-1.5"
                  style={{ color: "var(--ink-700)" }}
                >
                  Log in
                </Link>
                <Link href="/register" className="btn btn-primary text-sm px-4 py-1.5">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle menu"
            className="rounded-full p-2 md:hidden"
            style={{ color: "var(--ink-700)" }}
            onClick={() => setOpen((v) => !v)}
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
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="mt-2 rounded-2xl border p-3 shadow-lg md:hidden"
            style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
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
              <div className="mt-2 flex gap-2 border-t pt-2" style={{ borderColor: "var(--line)" }}>
                {user ? (
                  <button onClick={handleLogout} className="btn btn-outline flex-1 text-sm">
                    Log out
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline flex-1 text-sm">
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1 text-sm">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}