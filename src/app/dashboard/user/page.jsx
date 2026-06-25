"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-purchases`, { headers: h }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, { headers: h }).then(r => r.json()),
    ]).then(([pData, bData]) => {
      setPurchases(pData.purchases || []);
      setBookmarks(bData.bookmarks || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const totalSpent = purchases.reduce((s, p) => s + (p.amount || 0), 0);


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-500)" }}>
          {purchases.length} books · ${totalSpent.toFixed(2)} spent
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Purchased", value: purchases.length },
          { label: "Bookmarked", value: bookmarks.length },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--ink-500)" }}>{s.label}</p>
            <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--ink-900)" }}>My Library</h2>
            <Link href="/dashboard/user/purchases" className="text-sm font-medium" style={{ color: "#6d3df5" }}>
              View all →
            </Link>
          </div>
          {purchases.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
              <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No books yet</p>
              <Link href="/browse" className="btn btn-primary text-sm px-4 py-2">Browse Ebooks</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {purchases.slice(0, 8).map((p) => p.ebookId && (
                <Link key={p._id} href={`/ebooks/${p.ebookId._id}`} className="group block rounded-2xl border overflow-hidden hover:shadow-sm transition-all" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                  <div className="aspect-[3/4] overflow-hidden">
                    {p.ebookId.coverImage
                      ? <img src={p.ebookId.coverImage} alt={p.ebookId.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: "var(--line)" }}>📖</div>
                    }
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--ink-900)" }}>{p.ebookId.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}