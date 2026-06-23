import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "var(--paper)" }}
    >
      <p
        className="text-8xl font-bold mb-4"
        style={{ fontFamily: "var(--font-display)", color: "var(--line)" }}
      >
        404
      </p>
      <h1
        className="text-3xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}
      >
        Page not found
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-500)" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary px-6 py-3 text-sm">
        Go back home
      </Link>
    </main>
  );
}