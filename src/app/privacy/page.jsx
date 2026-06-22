export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16" style={{ background: "var(--ink)" }}>
      <h1 className="font-display text-4xl mb-6" style={{ color: "var(--ivory)" }}>
        Privacy <span className="italic" style={{ color: "var(--gold)" }}>Policy</span>
      </h1>
      <p className="font-mono text-sm max-w-xl" style={{ color: "var(--muted)" }}>
        We value your privacy. Fable does not sell or share your personal data with third parties. All data is stored securely and used only to improve your reading experience.
      </p>
    </main>
  );
}