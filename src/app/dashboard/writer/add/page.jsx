"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";
import { GENRES } from "@/lib/genres";

export default function AddEbookPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullContent: "",
    price: "",
    genre: "Fiction",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");

  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    // Note: You'll need to set NEXT_PUBLIC_IMGBB_API_KEY in .env.local
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setError("ImgBB API key not configured");
      return null;
    }

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.data?.url || null;
    } catch (e) {
      console.error("Upload error:", e);
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const url = await uploadToImgBB(file);
    if (url) {
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } else {
      setError("Failed to upload image");
    }
    setUploadingCover(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.fullContent || !formData.price || !formData.genre) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fullContent: formData.fullContent,
          price: parseFloat(formData.price),
          genre: formData.genre,
          coverImage: formData.coverImage || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create ebook");
      }

      router.push("/dashboard/writer/manage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Add New Ebook
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>Fill in the details and upload your ebook</p>
      </div>

      <div className="rounded-2xl border p-6" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
        {error && (
          <div className="mb-4 p-4 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
              Ebook Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter ebook title"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
              Short Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description (shown on listing page)"
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
              Full Content
            </label>
            <textarea
              value={formData.fullContent}
              onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
              placeholder="Complete ebook content (shown after purchase)"
              rows={6}
              className="input w-full resize-none font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
                Price ($)
              </label>
              <input
                type="number"
                step={0.01}
                min={0.99}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="9.99"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="select w-full"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-500)" }}>
              Cover Image (jpg, png)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                disabled={uploadingCover}
                className="text-xs"
              />
              {uploadingCover && <span className="text-xs" style={{ color: "var(--ink-500)" }}>Uploading...</span>}
            </div>
            {formData.coverImage && (
              <div className="mt-3 flex gap-2">
                <img src={formData.coverImage} alt="Cover preview" className="h-20 rounded-lg border" style={{ borderColor: "var(--line)" }} />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: "" })}
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{ borderColor: "#fca5a5", color: "#dc2626" }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || uploadingCover}
              className="btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ebook"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline px-6 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
