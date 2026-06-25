"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";

export default function WriterSalesPage() {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalEarnings: 0, totalBooks: 0 });

  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-sales`, { headers: h });
        const data = await res.json();
        setSales(data.purchases || []);
        
        // Calculate stats
        const totalEarnings = data.purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const uniqueBooks = new Set(data.purchases?.map((p) => p.ebookId?._id) || []).size;
        
        setStats({
          totalSales: data.purchases?.length || 0,
          totalEarnings: totalEarnings,
          totalBooks: uniqueBooks,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSales();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Sales History
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>Track your ebook sales and earnings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Sales", value: stats.totalSales },
          { label: "Unique Books Sold", value: stats.totalBooks },
          { label: "Total Earnings", value: `$${stats.totalEarnings.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--ink-500)" }}>{s.label}</p>
            <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm" style={{ color: "var(--ink-500)" }}>No sales yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                {["Ebook", "Buyer", "Amount", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={s._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>
                    {s.ebookId?.title || "Deleted ebook"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>
                    {s.userId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>
                    ${s.amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
