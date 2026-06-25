"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function WriterDashboard() {
  const { user, token } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/my-ebooks`, { headers: h }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-sales`, { headers: h }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, { headers: h }).then(r => r.json()),
    ]).then(([eData, sData, bData]) => {
      setEbooks(eData.ebooks || []);
      setSales(sData.purchases || []);
      setBookmarks(bData.bookmarks || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const totalEarnings = sales.reduce((s, p) => s + (p.amount || 0), 0);
  const publishedCount = ebooks.filter(e => e.status === "published").length;


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-500)" }}>
          {ebooks.length} ebooks · {publishedCount} published · ${totalEarnings.toFixed(2)} earned
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Ebooks", value: ebooks.length },
          { label: "Total Sales", value: sales.length },
          { label: "Total Earnings", value: `$${totalEarnings.toFixed(2)}` },
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
        <>
          {/* Recent Ebooks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: "var(--ink-900)" }}>My Ebooks</h2>
              <Link href="/dashboard/writer/manage" className="text-sm font-medium" style={{ color: "#6d3df5" }}>
                View all →
              </Link>
            </div>
            {ebooks.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No ebooks yet</p>
                <Link href="/dashboard/writer/add" className="btn btn-primary text-sm px-4 py-2">Create First Ebook</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ebooks.slice(0, 8).map((e) => (
                  <Link key={e._id} href={`/ebooks/${e._id}`} className="group block rounded-2xl border overflow-hidden hover:shadow-sm transition-all" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                    <div className="aspect-[3/4] overflow-hidden">
                      {e.coverImage
                        ? <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: "var(--line)" }}>📖</div>
                      }
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--ink-900)" }}>{e.title}</p>
                      <span className="text-[10px] px-1 py-0.5 rounded-full capitalize mt-1 inline-block" style={{ background: e.status === "published" ? "#dcfce7" : "#f3f4f6", color: e.status === "published" ? "#166534" : "var(--ink-500)" }}>
                        {e.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sales */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: "var(--ink-900)" }}>Recent Sales</h2>
              <Link href="/dashboard/writer/sales" className="text-sm font-medium" style={{ color: "#6d3df5" }}>
                View all →
              </Link>
            </div>
            {sales.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm" style={{ color: "var(--ink-500)" }}>No sales yet</p>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--paper-2)" }}>
                    <tr>
                      {["Ebook", "Buyer", "Amount", "Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 5).map((s, i) => (
                      <tr key={s._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>{s.ebookId?.title || "Deleted"}</td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{s.userId?.name || "—"}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${s.amount?.toFixed(2)}</td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
