"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/Providers";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="pointer-events-none sticky top-0 z-40 flex justify-center px-4 pt-4">
      <header className="pointer-events-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-2 rounded-full border border-[--line] bg-[--paper-2]/90 px-2 py-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur">
          <Link href="/" className="flex shrink-0 items-center gap-2 pl-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[--ink-900] text-sm font-bold text-[--paper]">
              ✦
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Fable
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive(l.href)
                    ? "bg-[--ink-900] text-[--paper]"
                    : "text-[--ink-700] hover:text-[--ink-900]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 pr-1 md:flex">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline px-4 py-1.5 text-sm">
                Log out
              </button>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost px-3 py-1.5 text-sm">
                  Log in
                </Link>
                <Link href="/register" className="btn btn-primary px-4 py-1.5 text-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            aria-label="Toggle menu"
            className="rounded-full p-2 text-[--ink-700] md:hidden"
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

        {open ? (
          <div className="mt-2 rounded-2xl border border-[--line] bg-[--paper-2] p-3 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    isActive(l.href) ? "bg-[--ink-900] text-[--paper]" : "text-[--ink-700]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                {user ? (
                  <button onClick={handleLogout} className="btn btn-outline flex-1">
                    Log out
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline flex-1">
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}