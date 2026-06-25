"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

export default function UserBookmarksPage() {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, { headers: h });
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBookmarks();
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
          Bookmarked Ebooks ({bookmarks.length})
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>Ebooks saved for later reading</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No bookmarks yet</p>
          <Link href="/browse" className="btn btn-primary text-sm px-4 py-2">
            Browse Ebooks
          </Link>
        </div>
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
                <p className="text-xs" style={{ color: "var(--ink-500)" }}>by {ebook.writerName}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--ink-900)" }}>${ebook.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
