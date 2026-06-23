"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Providers";

const GENRES = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "History"];

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed");
  return data.data.url;
}

function EbookForm({ initial, onSubmit, busy, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: "", description: "", price: "", genre: "Fiction", coverImage: "" }
  );
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initial?.coverImage || "");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let coverImage = form.coverImage;
      if (imageFile) { setUploading(true); coverImage = await uploadToImgBB(imageFile); setUploading(false); }
      await onSubmit({ ...form, coverImage, price: Number(form.price) });
    } catch (err) { setUploading(false); alert(err.message); }
  };

  const inputStyle = { background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink-900)", outline: "none" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>Title</label>
        <input name="title" required value={form.title} onChange={handle} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={inputStyle} />
      </div>
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>Description / Full Content</label>
        <textarea name="description" required rows={5} value={form.description} onChange={handle} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" style={inputStyle} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>Price ($)</label>
          <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={handle} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>Genre</label>
          <select name="genre" value={form.genre} onChange={handle} className="w-full px-4 py-2.5 rounded-xl border text-sm" style={inputStyle}>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs mb-1 block" style={{ color: "var(--ink-700)" }}>Cover Image (imgBB)</label>
        <input type="file" accept="image/*" onChange={handleFile} className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
        {preview && <img src={preview} alt="Preview" className="mt-2 w-20 h-28 object-cover rounded-xl border" style={{ borderColor: "var(--line)" }} />}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={busy || uploading} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
          {uploading ? "Uploading…" : busy ? "Saving…" : initial ? "Save Changes" : "Publish Ebook"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-outline px-6 py-2.5 text-sm">Cancel</button>
        )}
      </div>
    </form>
  );
}

export default function WriterDashboard() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState("manage");
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEbook, setEditEbook] = useState(null);
  const [busy, setBusy] = useState(false);

  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchAll = async () => {
    if (!token || !user) return;
    try {
      const [eRes, sRes, bRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks?writerId=${user.id}&limit=100`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase/my-sales`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, { headers: h }),
      ]);
      const [eData, sData, bData] = await Promise.all([eRes.json(), sRes.json(), bRes.json()]);
      setEbooks(eData.ebooks || []);
      setSales(sData.sales || []);
      setBookmarks(bData.bookmarks || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [token, user?.id]);

  const handleAdd = async (data) => {
    setBusy(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({ ...data, writerName: user?.name }),
      });
      setTab("manage");
      fetchAll();
    } catch (e) { alert(e.message); }
    finally { setBusy(false); }
  };

  const handleEdit = async (data) => {
    setBusy(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${editEbook._id}`, {
        method: "PUT", headers: h, body: JSON.stringify(data),
      });
      setEditEbook(null);
      setTab("manage");
      fetchAll();
    } catch (e) { alert(e.message); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this ebook?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${id}`, { method: "DELETE", headers: h });
    fetchAll();
  };

  const handleToggle = async (ebook) => {
    const status = ebook.status === "published" ? "unpublished" : "published";
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${ebook._id}`, {
      method: "PUT", headers: h, body: JSON.stringify({ status }),
    });
    fetchAll();
  };

  const totalRevenue = sales.reduce((s, p) => s + (p.amount || 0), 0);
  const TABS = [
    { key: "manage", label: "My Ebooks" },
    { key: "add", label: "Add Ebook" },
    { key: "sales", label: "Sales" },
    { key: "bookmarks", label: "Bookmarks" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Writer Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-500)" }}>
          {ebooks.length} ebooks · {sales.length} sales · ${totalRevenue.toFixed(2)} earned
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Ebooks", value: ebooks.length },
          { label: "Sales", value: sales.length },
          { label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--ink-500)" }}>{s.label}</p>
            <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--line)" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setEditEbook(null); }}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
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
          {tab === "manage" && (
            editEbook ? (
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ink-900)" }}>Edit: {editEbook.title}</h2>
                <EbookForm initial={editEbook} onSubmit={handleEdit} busy={busy} onCancel={() => setEditEbook(null)} />
              </div>
            ) : ebooks.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm mb-3" style={{ color: "var(--ink-500)" }}>No ebooks yet</p>
                <button onClick={() => setTab("add")} className="btn btn-primary text-sm px-4 py-2">Add your first ebook</button>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--paper-2)" }}>
                    <tr>
                      {["Title", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: "var(--ink-500)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ebooks.map((e, i) => (
                      <tr key={e._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                        <td className="px-4 py-3">
                          <p className="font-medium" style={{ color: "var(--ink-900)" }}>{e.title}</p>
                          <p className="text-xs" style={{ color: "var(--ink-500)" }}>{e.genre}</p>
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${e.price}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full capitalize"
                            style={{ background: e.status === "published" ? "#dcfce7" : "#f3f4f6", color: e.status === "published" ? "#166534" : "var(--ink-500)" }}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setEditEbook(e)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}>Edit</button>
                            <button onClick={() => handleToggle(e)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "var(--line)", color: "var(--ink-700)" }}>
                              {e.status === "published" ? "Unpublish" : "Publish"}
                            </button>
                            <button onClick={() => handleDelete(e._id)} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#fca5a5", color: "#dc2626" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "add" && (
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>Add New Ebook</h2>
              <p className="text-xs mb-4" style={{ color: "var(--ink-500)" }}>
                Add <code className="px-1 py-0.5 rounded" style={{ background: "var(--line)" }}>NEXT_PUBLIC_IMGBB_KEY</code> to your Vercel env vars.{" "}
                <a href="https://api.imgbb.com" target="_blank" rel="noreferrer" style={{ color: "var(--ink-700)" }} className="underline">Get free key at api.imgbb.com</a>
              </p>
              <EbookForm onSubmit={handleAdd} busy={busy} />
            </div>
          )}

          {tab === "sales" && (
            sales.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-500)" }}>No sales yet.</p>
            ) : (
              <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--paper-2)" }}>
                    <tr>
                      {["Ebook", "Buyer", "Amount", "Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: "var(--ink-500)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((s, i) => (
                      <tr key={s._id} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>{s.ebookId?.title || "—"}</td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{s.userId?.name || "—"}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-900)" }}>${s.amount?.toFixed(2)}</td>
                        <td className="px-4 py-3" style={{ color: "var(--ink-500)" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === "bookmarks" && (
            bookmarks.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-500)" }}>No bookmarks yet.</p>
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
                      <p className="text-xs" style={{ color: "var(--ink-500)" }}>${ebook.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}