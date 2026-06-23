"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const GENRES = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "History"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
      <div className="aspect-[3/4] animate-pulse" style={{ background: "var(--line)" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "80%" }} />
        <div className="h-3 rounded-full animate-pulse" style={{ background: "var(--line)", width: "50%" }} />
      </div>
    </div>
  );
}

function EbookCard({ ebook }) {
  return (
    <Link
      href={`/ebooks/${ebook._id}`}
      className="group block rounded-2xl overflow-hidden border hover:shadow-md transition-all duration-200"
      style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {ebook.coverImage ? (
          <img
            src={ebook.coverImage}
            alt={ebook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: "var(--line)" }}
          >
            📖
          </div>
        )}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(28,24,20,0.75)", color: "#fff" }}
        >
          {ebook.genre}
        </span>
        {ebook.status === "sold" && (
          <span
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
            style={{ background: "#dc2626", color: "#fff" }}
          >
            Sold
          </span>
        )}
      </div>
      <div className="p-3">
        <h3
          className="font-semibold text-sm leading-tight mb-1 line-clamp-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
        >
          {ebook.title}
        </h3>
        <p className="text-xs mb-1" style={{ color: "var(--ink-500)" }}>by {ebook.writerName}</p>
        <p className="text-sm font-semibold" style={{ color: "var(--ink-900)" }}>${ebook.price}</p>
      </div>
    </Link>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const fetchEbooks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);
      params.set("page", page);
      params.set("limit", 8);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?${params}`);
      const data = await res.json();
      setEbooks(data.ebooks || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEbooks(1); }, [genre]);

  const handleReset = () => {
    setSearch(""); setGenre(""); setMinPrice(""); setMaxPrice(""); setSort("");
    setTimeout(() => fetchEbooks(1), 50);
  };

  const inputStyle = {
    background: "var(--paper)",
    borderColor: "var(--line)",
    color: "var(--ink-900)",
    outline: "none",
  };

  return (
    <main className="min-h-screen pt-6 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span
            className="inline-flex items-center border rounded-full px-3 py-0.5 text-xs uppercase tracking-widest mb-3"
            style={{ borderColor: "var(--ink-900)", color: "var(--ink-900)" }}
          >
            Catalog
          </span>
          <h1
            className="text-4xl md:text-5xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            Browse ebooks
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-500)" }}>
            Search and filter through original ebooks{" "}
            <span style={{ color: "#d97706" }}>from our writers</span>.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          className="rounded-2xl border p-4 mb-8"
          style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}
        >
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-48">
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-500)" }}>Search</label>
              <input
                type="text"
                placeholder="Title or writer name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchEbooks(1)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <div className="w-40">
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-500)" }}>Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={inputStyle}
              >
                <option value="">All genres</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="w-24">
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-500)" }}>Min $</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <div className="w-24">
              <label className="text-xs mb-1 block" style={{ color: "var(--ink-500)" }}>Max $</label>
              <input
                type="number"
                placeholder="999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>

            <button
              onClick={() => fetchEbooks(1)}
              className="btn btn-primary px-5 py-2 text-sm self-end"
            >
              Go
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--ink-500)" }}>Sort by</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setTimeout(() => fetchEbooks(1), 50); }}
                className="px-3 py-1.5 rounded-xl border text-sm"
                style={inputStyle}
              >
                <option value="">Newest</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
              </select>
            </div>
            <button
              onClick={handleReset}
              className="text-sm"
              style={{ color: "var(--ink-500)" }}
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
              No ebooks found
            </p>
            <p className="text-sm" style={{ color: "var(--ink-500)" }}>
              Try changing your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ebooks.map((e) => <EbookCard key={e._id} ebook={e} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => fetchEbooks(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline px-4 py-2 text-sm disabled:opacity-30"
            >
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchEbooks(i + 1)}
                className="w-9 h-9 rounded-full text-sm font-medium"
                style={{
                  background: currentPage === i + 1 ? "var(--ink-900)" : "transparent",
                  color: currentPage === i + 1 ? "var(--paper)" : "var(--ink-700)",
                  border: currentPage === i + 1 ? "none" : "1.5px solid var(--line)",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => fetchEbooks(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline px-4 py-2 text-sm disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BrowseEbooksPage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}