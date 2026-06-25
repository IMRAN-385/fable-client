"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

function SimpleBar({ label, value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 shrink-0 truncate" style={{ color: "var(--ink-700)" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--ink-900)", transition: "width 0.5s" }} />
      </div>
      <span className="text-xs w-5 text-right shrink-0" style={{ color: "var(--ink-500)" }}>{value}</span>
    </div>
  );
}

function AdminDashboardContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();

  // ✅ FIX: DashboardLayout's sidebar links point to
  // /dashboard/admin?tab=users, /dashboard/admin?tab=ebooks, etc, but this
  // component always ignored that and started on "overview" with no way
  // to land on another tab via URL. Now the initial tab comes from the
  // query string, matching the links it's rendered alongside.
  const initialTab = searchParams.get("tab") || "overview";
  const [tab, setTab] = useState(initialTab);

  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState({});
  const [genreCount, setGenreCount] = useState({});
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchAll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [aRes, uRes, eRes, tRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/analytics`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?limit=200`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/all`, { headers: h }),
      ]);
      const [aData, uData, eData, tData] = await Promise.all([aRes.json(), uRes.json(), eRes.json(), tRes.json()]);
      // ✅ FIX: this now matches exactly what /api/users/analytics returns
      // after the backend fix: { stats, monthlySales, genreCount }.
      setStats(aData.stats);
      setMonthlySales(aData.monthlySales || {});
      setGenreCount(aData.genreCount || {});
      setUsers(uData.users || []);
      setEbooks(eData.ebooks || []);
      setTransactions(tData.purchases || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [token]);

  const handleRoleChange = async (id, role) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/role`, {
      method: "PATCH", headers: h, body: JSON.stringify({ role }),
    });
    fetchAll();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, { method: "DELETE", headers: h });
    fetchAll();
  };

  const handleDeleteEbook = async (id) => {
    if (!confirm("Delete ebook?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${id}`, { method: "DELETE", headers: h });
    fetchAll();
  };

  const handleToggleEbook = async (ebook) => {
    const status = ebook.status === "published" ? "unpublished" : "published";
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${ebook._id}`, {
      method: "PUT", headers: h, body: JSON.stringify({ status }),
    });
    fetchAll();
  };

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "users", label: `Users (${users.length})` },
    { key: "ebooks", label: `Ebooks (${ebooks.length})` },
    { key: "transactions", label: `Transactions (${transactions.length})` },
  ];

  const maxMonthly = Math.max(...Object.values(monthlySales), 1);
  const maxGenre = Math.max(...Object.values(genreCount), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Admin Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-500)" }}>Manage your platform</p>
      </div>

      <div className="flex gap-1 mb-6 border-b overflow-x-auto no-scrollbar" style={{ borderColor: "var(--line)" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0"
            style={{ borderColor: tab === t.key ? "var(--ink-900)" : "transparent", color: tab === t.key ? "var(--ink-900)" : "var(--ink-500)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
        </div>
      ) : (
        <>
          {tab === "overview" && stats && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Users", value: stats.totalUsers },
                  { label: "Writers", value: stats.totalWriters },
                  { label: "Ebooks Sold", value: stats.totalSold },
                  { label: "Revenue", value: `$${stats.totalRevenue?.toFixed(2)}` },
                ].map((s) => (
                  <div key={s.label} className="p-5 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                    <p className="text-xs mb-2" style={{ color: "var(--ink-500)" }}>{s.label}</p>
                    <p className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink-900)" }}>Monthly Sales</h3>
                  {Object.keys(monthlySales).length === 0 ? (
                    <p className="text-xs" style={{ color: "var(--ink-500)" }}>No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(monthlySales).slice(-8).map(([month, count]) => (
                        <SimpleBar key={month} label={month} value={count} max={maxMonthly} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink-900)" }}>Sales by Genre</h3>
                  {Object.keys(genreCount).length === 0 ? (
                    <p className="text-xs" style={{ color: "var(--ink-500)" }}>No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(genreCount).sort((a, b) => b[1] - a[1]).map(([genre, count]) => (
                        <SimpleBar key={genre} label={genre} value={count} max={maxGenre} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "var(--paper-2)" }}>
                  <tr>
                    {["Name", "Email", "Role", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>{u.name}</td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg border"
                          style={{ background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink-900)" }}
                        >
                          <option value="user">User</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#fca5a5", color: "#dc2626" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "ebooks" && (
            <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "var(--paper-2)" }}>
                  <tr>
                    {["Title", "Writer", "Price", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map((e, i) => (
                    <tr key={e._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                      <td className="px-4 py-3">
                        <Link href={`/ebooks/${e._id}`} className="font-medium hover:underline" style={{ color: "var(--ink-900)" }}>{e.title}</Link>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{e.writerName}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${e.price}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full capitalize"
                          style={{ background: e.status === "published" ? "#dcfce7" : "#f3f4f6", color: e.status === "published" ? "#166534" : "var(--ink-500)" }}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleToggleEbook(e)} className="text-xs px-3 py-1 rounded-full border whitespace-nowrap" style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}>
                            {e.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button onClick={() => handleDeleteEbook(e._id)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#fca5a5", color: "#dc2626" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "transactions" && (
            <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "var(--paper-2)" }}>
                  <tr>
                    {["Ebook / Type", "Buyer", "Amount", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "var(--ink-500)" }}>No transactions yet</td></tr>
                  ) : transactions.map((t, i) => (
                    <tr key={t._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>
                        {/* ✅ FIX: publishing-fee rows have no ebookId, show that clearly instead of "—" */}
                        {t.ebookId?.title || (t.type === "publishing_fee" ? "Writer verification fee" : "—")}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{t.userId?.email || "—"}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${t.amount?.toFixed(2)}</td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm" style={{ color: "var(--ink-500)" }}>Loading…</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
