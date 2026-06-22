export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16" style={{ background: "var(--ink)" }}>
      <h1 className="font-display text-4xl mb-6" style={{ color: "var(--ivory)" }}>
        About <span className="italic" style={{ color: "var(--gold)" }}>Fable</span>
      </h1>
      <p className="font-mono text-sm max-w-xl" style={{ color: "var(--muted)" }}>
        Fable is a digital platform connecting ebook lovers with talented writers. Discover, read, and share original ebooks from emerging authors around the world.
      </p>
    </main>
  );
}