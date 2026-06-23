"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EbookCard, EbookCardSkeleton } from "@/components/EbookCard";
import { GENRES } from "@/lib/genres";

function BrowseContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(sp.get("search") || "");
  const [genre, setGenre] = useState(sp.get("genre") || "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") || "");
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [page, setPage] = useState(Number(sp.get("page") || 1));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search)   params.set("search", search);
    if (genre)    params.set("genre", genre);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort)     params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "8");

    // ✅ Express backend URL থেকে fetch করছে, Next.js /api নয়
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then((d) => {
        // Express returns: { ebooks, totalPages, currentPage, total }
        // normalize to: { items, totalPages, page }
        setData({
          items:      d.ebooks      || [],
          totalPages: d.totalPages  || 1,
          page:       d.currentPage || 1,
          total:      d.total       || 0,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, genre, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  // sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search)       params.set("search", search);
    if (genre)        params.set("genre", genre);
    if (minPrice)     params.set("minPrice", minPrice);
    if (maxPrice)     params.set("maxPrice", maxPrice);
    if (sort !== "newest") params.set("sort", sort);
    if (page !== 1)   params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
  }, [search, genre, minPrice, maxPrice, sort, page, router]);

  const reset = () => {
    setSearch("");
    setGenre("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6">
      <header className="mb-6">
        <span className="pill">Catalog</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[--ink-900]">
          Browse ebooks
        </h1>
        <p className="mt-1 text-sm text-[--ink-500]">
          Search and filter through original ebooks from our writers.
        </p>
      </header>

      <div className="card mb-6 p-4 sm:p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load();
          }}
          className="grid gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            <label className="mb-1 block text-xs font-medium text-[--ink-500]">Search</label>
            <input
              className="input"
              placeholder="Title or writer name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-medium text-[--ink-500]">Genre</label>
            <select
              className="select"
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
            >
              <option value="">All genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-[--ink-500]">Min $</label>
            <input
              type="number"
              min={0}
              className="input"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-[--ink-500]">Max $</label>
            <input
              type="number"
              min={0}
              className="input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex items-end">
            <button className="btn btn-primary w-full" type="submit">Go</button>
          </div>

          <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[--ink-500]">Sort by</span>
              <select
                className="select w-auto"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
            <button type="button" onClick={reset} className="btn btn-ghost">
              Reset filters
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="card mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          ⚠️ {error} — Make sure your backend server is running and{" "}
          <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_API_URL</code> is set in{" "}
          <code className="rounded bg-red-100 px-1">.env.local</code>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <EbookCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="card grid place-items-center px-6 py-16 text-center">
          <div className="text-5xl">📚</div>
          <h3 className="mt-3 text-lg font-semibold">No ebooks match your search</h3>
          <p className="mt-1 max-w-md text-sm text-[--ink-500]">
            Try a different keyword or clear the filters to see everything.
          </p>
          <button onClick={reset} className="btn btn-outline mt-4">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((b, i) => (
              <EbookCard key={b._id || b.id} ebook={b} index={i} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-outline disabled:opacity-50"
              >
                ← Prev
              </button>
              {Array.from({ length: data.totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium ${
                      n === page
                        ? "bg-[#6d3df5] text-white"
                        : "border border-black/10 text-[--ink-700] hover:bg-black/5"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="btn btn-outline disabled:opacity-50"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">Loading…</div>}>
      <BrowseContent />
    </Suspense>
  );
}