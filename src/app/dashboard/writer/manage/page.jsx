"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function ManageEbooksPage() {
  const { user, token } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const h = { Authorization: `Bearer ${token}` };

  const fetchEbooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/my-ebooks`, { headers: h });
      const data = await res.json();
      setEbooks(data.ebooks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEbooks();
  }, [token]);

  const handleToggle = async (ebookId, status) => {
    const newStatus = status === "published" ? "unpublished" : "published";
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${ebookId}`, {
      method: "PUT",
      headers: h,
      body: JSON.stringify({ status: newStatus }),
    });
    fetchEbooks();
  };

  const handleDelete = async (ebookId) => {
    if (!confirm("Delete this ebook?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${ebookId}`, {
      method: "DELETE",
      headers: h,
    });
    fetchEbooks();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          My Ebooks ({ebooks.length})
        </h2>
        <Link href="/dashboard/writer/add" className="btn btn-primary px-4 py-2 text-sm">
          + Add Ebook
        </Link>
      </div>

      {ebooks.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No ebooks yet</p>
          <Link href="/dashboard/writer/add" className="btn btn-primary text-sm px-4 py-2">
            Create Your First Ebook
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                {["Title", "Genre", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--ink-500)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ebooks.map((e, i) => (
                <tr key={e._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                  <td className="px-4 py-3">
                    <Link href={`/ebooks/${e._id}`} className="font-medium hover:underline" style={{ color: "var(--ink-900)" }}>
                      {e.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{e.genre}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${e.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: e.status === "published" ? "#dcfce7" : "#f3f4f6", color: e.status === "published" ? "#166534" : "var(--ink-500)" }}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/writer/edit/${e._id}`} className="text-xs px-3 py-1 rounded-full border whitespace-nowrap" style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}>
                        Edit
                      </Link>
                      <button onClick={() => handleToggle(e._id, e.status)} className="text-xs px-3 py-1 rounded-full border whitespace-nowrap" style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}>
                        {e.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => handleDelete(e._id)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#fca5a5", color: "#dc2626" }}>
                        Delete
                      </button>
                    </div>
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
