import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-16 border-t px-6 py-10 text-sm"
      style={{ borderColor: "var(--line)", color: "var(--ink-500)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p
            className="text-base font-semibold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
          >
            Fable
          </p>
          <p className="text-sm">Discover & Read Original Ebooks</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/about" className="hover:text-[--ink-900] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[--ink-900] transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-[--ink-900] transition-colors">Privacy Policy</Link>
        </div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-[--ink-900] transition-colors">Facebook</a>
          <a href="#" className="hover:text-[--ink-900] transition-colors">Twitter</a>
          <a href="#" className="hover:text-[--ink-900] transition-colors">Instagram</a>
        </div>

        <div className="flex flex-col gap-2">
          <p style={{ color: "var(--ink-700)" }}>Newsletter</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-3 py-2 rounded-full text-sm outline-none border"
              style={{
                background: "var(--paper-2)",
                borderColor: "var(--line)",
                color: "var(--ink-900)",
              }}
            />
            <button className="btn btn-primary text-sm px-4 py-2">Subscribe</button>
          </div>
        </div>
      </div>

      <p className="text-center mt-10 text-xs" style={{ color: "var(--ink-500)" }}>
        © {new Date().getFullYear()} Fable. All rights reserved.
      </p>
    </footer>
  );
}