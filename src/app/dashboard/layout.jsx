"use client";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=" + pathname);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
          <p className="text-sm" style={{ color: "var(--ink-500)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ✅ FIX: AdminDashboard.jsx is a single page that switches tabs via
  // state (read from ?tab=). It previously had nothing to read because
  // these links pointed at separate routes like /dashboard/admin/users
  // that don't exist, which would 404. Now everything routes through
  // /dashboard/admin with a ?tab= query param.
  const getLinks = () => {
    if (user.role === "admin") return [
      { href: "/dashboard/admin", label: "Overview" },
      { href: "/dashboard/admin?tab=users", label: "Users" },
      { href: "/dashboard/admin?tab=ebooks", label: "Ebooks" },
      { href: "/dashboard/admin?tab=transactions", label: "Transactions" },
    ];
    if (user.role === "writer") return [
      { href: "/dashboard/writer", label: "Overview" },
      { href: "/dashboard/writer/manage", label: "My Ebooks" },
      { href: "/dashboard/writer/add", label: "Add Ebook" },
      { href: "/dashboard/writer/sales", label: "Sales" },
      { href: "/dashboard/writer/bookmarks", label: "Bookmarks" },
    ];
    return [
      { href: "/dashboard/user", label: "Overview" },
      { href: "/dashboard/user/purchases", label: "Purchases" },
      { href: "/dashboard/user/bookmarks", label: "Bookmarks" },
      { href: "/dashboard/user/profile", label: "Profile" },
    ];
  };

  const isActive = (href) => {
    if (user.role !== "admin") return pathname === href;
    // For admin tab-links, compare both the base path and the tab param.
    const [base, query] = href.split("?");
    const tabParam = query ? new URLSearchParams(query).get("tab") : null;
    return pathname === base && currentTab === tabParam;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-52 shrink-0">
            <div
              className="rounded-2xl border p-4 md:sticky md:top-24"
              style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{ borderColor: "var(--line)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden shrink-0"
                  style={{ background: "var(--line)", color: "var(--ink-900)" }}
                >
                  {user.photo
                    ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    : user.name?.[0]?.toUpperCase()
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--ink-900)" }}>{user.name}</p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                    style={{ background: "var(--ink-900)", color: "var(--paper)" }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {getLinks().map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: isActive(l.href) ? "var(--ink-900)" : "transparent",
                      color: isActive(l.href) ? "var(--paper)" : "var(--ink-700)",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-5 pt-4 border-t flex flex-col gap-1" style={{ borderColor: "var(--line)" }}>
                <Link href="/ebooks" className="px-3 py-2 rounded-xl text-sm" style={{ color: "var(--ink-500)" }}>
                  ← Library
                </Link>
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="text-left px-3 py-2 rounded-xl text-sm"
                  style={{ color: "var(--ink-500)" }}
                >
                  Log out
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
