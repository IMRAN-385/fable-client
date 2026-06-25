"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [tab, setTab] = useState("overview");
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

  const TABS = ["overview", "purchases", "bookmarks", "profile"];
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

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--line)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 capitalize transition-colors"
            style={{
              borderColor: tab === t ? "var(--ink-900)" : "transparent",
              color: tab === t ? "var(--ink-900)" : "var(--ink-500)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
        </div>
      ) : (
        <>
          {tab === "overview" && (
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ink-900)" }}>My Library</h2>
              {purchases.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                  <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No books yet</p>
                  <Link href="/ebooks" className="btn btn-primary text-sm px-4 py-2">Browse Ebooks</Link>
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

          {tab === "purchases" && (
            purchases.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-500)" }}>No purchases yet.</p>
            ) : (
              <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--paper-2)" }}>
                    <tr>
                      {["Ebook", "Writer", "Amount", "Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: "var(--ink-500)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p, i) => (
                      <tr key={p._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                        <td className="px-4 py-3">
                          <Link href={`/ebooks/${p.ebookId?._id}`} className="font-medium hover:underline" style={{ color: "var(--ink-900)" }}>
                            {p.ebookId?.title || "Deleted"}
                          </Link>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{p.ebookId?.writerName || "—"}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${p.amount?.toFixed(2)}</td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "bookmarks" && (
            bookmarks.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-500)" }}>No bookmarks yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bookmarks.map((ebook) => ebook && (
                  <Link key={ebook._id} href={`/ebooks/${ebook._id}`} className="group block rounded-2xl border overflow-hidden hover:shadow-sm transition-all" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                    <div className="aspect-[3/4] overflow-hidden">
                      {ebook.coverImage
                        ? <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: "var(--line)" }}>📖</div>
                      }
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--ink-900)" }}>{ebook.title}</p>
                      <p className="text-xs" style={{ color: "var(--ink-500)" }}>${ebook.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {tab === "profile" && (
            <div className="p-6 rounded-2xl border max-w-md" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold overflow-hidden" style={{ background: "var(--line)", color: "var(--ink-900)" }}>
                  {user?.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--ink-900)" }}>{user?.name}</p>
                  <p className="text-sm" style={{ color: "var(--ink-500)" }}>{user?.email}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize mt-1 inline-block" style={{ background: "var(--ink-900)", color: "var(--paper)" }}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}