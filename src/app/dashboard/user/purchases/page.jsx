"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function UserPurchasesPage() {
  const { token } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-purchases`, { headers: h });
        const data = await res.json();
        setPurchases(data.purchases || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPurchases();
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
          Purchase History ({purchases.length})
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>All your ebook purchases</p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No purchases yet</p>
          <Link href="/browse" className="btn btn-primary text-sm px-4 py-2">
            Browse Ebooks
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                {["Ebook", "Writer", "Amount", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>
                    {h}
                  </th>
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
      )}
    </div>
  );
}
