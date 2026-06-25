"use client";
import { useAuth } from "@/components/Providers";

export default function UserProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-sm" style={{ color: "var(--ink-500)" }}>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink-900)" }}>
          Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--ink-500)" }}>Your account information</p>
      </div>

      <div className="p-6 rounded-2xl border max-w-md" style={{ background: "var(--paper-2)", borderColor: "var(--line)" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold overflow-hidden" style={{ background: "var(--line)", color: "var(--ink-900)" }}>
            {user?.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--ink-900)" }}>{user?.name}</p>
            <p className="text-sm" style={{ color: "var(--ink-500)" }}>{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ink-500)" }}>Role</p>
            <p className="text-sm font-medium capitalize" style={{ color: "var(--ink-900)" }}>{user?.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ink-500)" }}>Email</p>
            <p className="text-sm font-medium" style={{ color: "var(--ink-900)" }}>{user?.email}</p>
          </div>
          {user?.photo && (
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--ink-500)" }}>Photo</p>
              <a href={user.photo} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: "#6d3df5" }}>
                View Photo →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
