import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12 px-6 py-8 text-sm text-gray-600">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2">Fable</h3>
          <p>Discover & Read Original Ebooks</p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>

        <div className="flex gap-4">
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Twitter">Twitter</a>
          <a href="#" aria-label="Instagram">Instagram</a>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="newsletter">Subscribe to our newsletter</label>
          <div className="flex gap-2">
            <input id="newsletter" type="email" placeholder="Your email" className="border p-2 rounded text-sm" />
            <button type="button" className="bg-black text-white px-4 rounded text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-gray-400">
        © {new Date().getFullYear()} Fable. All rights reserved.
      </p>
    </footer>
  );
}