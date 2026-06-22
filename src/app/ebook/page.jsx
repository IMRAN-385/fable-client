"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "History"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl aspect-[3/4] animate-pulse" style={{ background: "var(--ink-soft)" }} />
  );
}

function EbookCard({ ebook, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link
        href={`/ebooks/${ebook._id}`}
        className="group block relative rounded-2xl overflow-hidden aspect-[3/4]"
        style={{ background: "var(--ink-soft)" }}
      >
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: "linear-gradient(180deg, var(--gold), var(--spine))" }}
        />

        {ebook.coverImage ? (
          <img
            src={ebook.coverImage}
            alt={ebook.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl" style={{ color: "var(--muted)" }}>
            📖
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {ebook.status === "sold" && (
          <span
            className="absolute top-3 left-3 px-2 py-1 rounded-full font-mono text-[10px] uppercase tracking-wide"
            style={{ background: "var(--spine)", color: "var(--ivory)" }}
          >
            Sold
          </span>
        )}

        <span
          className="absolute top-3 right-3 px-2 py-1 rounded-full font-mono text-[10px] uppercase tracking-wide rotate-2"
          style={{ background: "rgba(201,162,39,0.15)", color: "var(--gold)", border: "1px solid var(--gold)" }}
        >
          {ebook.genre}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-base mb-1 leading-tight" style={{ color: "var(--ivory)" }}>
            {ebook.title}
          </h3>
          <p className="font-mono text-xs mb-2" style={{ color: "var(--muted)" }}>
            by {ebook.writerName}
          </p>
          <p className="font-mono text-sm font-semibold" style={{ color: "var(--gold)" }}>
            ${ebook.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BrowseEbooksPage() {
  const searchParams = useSearchParams();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("");

  const fetchEbooks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (availability) params.set("availability", availability);
      if (sort) params.set("sort", sort);
      params.set("page", page);
      params.set("limit", 9);

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

  useEffect(() => {
    fetchEbooks(1);
  }, [genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEbooks(1);
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16" style={{ background: "var(--ink)" }}>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-px" style={{ background: "var(--ink-soft)" }} />
          <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
            Library
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl" style={{ color: "var(--ivory)" }}>
          Browse <span className="italic" style={{ color: "var(--gold)" }}>Ebooks</span>
        </h1>
      </motion.div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Search title or writer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)", border: "1px solid var(--ink-soft)" }}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full font-mono text-sm"
            style={{ background: "var(--gold)", color: "var(--ink)" }}
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {/* Genre */}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Price Range */}
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          />
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          />

          {/* Availability */}
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-full font-mono text-sm outline-none"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          >
            <option value="">Newest</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>

          <button
            onClick={() => fetchEbooks(1)}
            className="px-6 py-2 rounded-full font-mono text-sm"
            style={{ background: "var(--ink-soft)", color: "var(--gold)", border: "1px solid var(--gold)" }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : ebooks.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl mb-2" style={{ color: "var(--ivory)" }}>No ebooks found</p>
          <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Try changing your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ebooks.map((ebook, i) => (
            <EbookCard key={ebook._id} ebook={ebook} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => fetchEbooks(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full font-mono text-sm disabled:opacity-30"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          >
            ← Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchEbooks(i + 1)}
              className="w-9 h-9 rounded-full font-mono text-sm"
              style={{
                background: currentPage === i + 1 ? "var(--gold)" : "var(--ink-soft)",
                color: currentPage === i + 1 ? "var(--ink)" : "var(--ivory)",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => fetchEbooks(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full font-mono text-sm disabled:opacity-30"
            style={{ background: "var(--ink-soft)", color: "var(--ivory)" }}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}