"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/ebooks", label: "Browse Ebooks" },
  ];
  if (user) links.push({ href: getDashboardPath(), label: "Dashboard" });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className="inline-flex items-center rounded-full backdrop-blur-md px-2 py-2 border"
        style={{
          background: "rgba(28,19,32,0.7)",
          borderColor: "var(--ink-soft)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <Link href="/" className="relative w-9 h-9 rounded-full flex items-center justify-center mr-1">
          <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, var(--gold), var(--spine))" }} />
          <span
            className="absolute inset-[2px] rounded-full flex items-center justify-center font-display italic text-sm"
            style={{ background: "var(--ink)", color: "var(--gold)" }}
          >
            F
          </span>
        </Link>

        <div className="w-px h-5 mx-1 hidden md:block" style={{ background: "var(--ink-soft)" }} />

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm rounded-full px-4 py-2 font-mono"
              style={{
                color: pathname === link.href ? "var(--ivory)" : "var(--muted)",
                background: pathname === link.href ? "var(--ink-soft)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="w-px h-5 mx-1 hidden md:block" style={{ background: "var(--ink-soft)" }} />

        {user ? (
          <button onClick={handleLogout} className="text-sm rounded-full px-4 py-2 font-mono hidden md:block" style={{ color: "var(--muted)" }}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-sm rounded-full px-4 py-2 font-mono hidden md:block" style={{ color: "var(--ivory)", background: "var(--gold)" }}>
            Login
          </Link>
        )}

        <button className="md:hidden px-3" style={{ color: "var(--ivory)" }} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full mt-2 flex flex-col gap-3 p-4 rounded-2xl md:hidden" style={{ background: "var(--ink-soft)" }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ color: "var(--ivory)" }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-left" style={{ color: "var(--ivory)" }}>
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "var(--ivory)" }}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}