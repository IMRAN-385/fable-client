export default function ContactPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16" style={{ background: "var(--ink)" }}>
      <h1 className="font-display text-4xl mb-6" style={{ color: "var(--ivory)" }}>
        Contact <span className="italic" style={{ color: "var(--gold)" }}>Us</span>
      </h1>
      <p className="font-mono text-sm max-w-xl" style={{ color: "var(--muted)" }}>
        Have questions or feedback? Reach us at{" "}
        <a href="mailto:hello@fable.com" style={{ color: "var(--gold)" }}>
          hello@fable.com
        </a>
      </p>
    </main>
  );
}