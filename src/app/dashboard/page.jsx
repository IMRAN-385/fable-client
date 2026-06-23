"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/user");
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ink-900)" }} />
    </div>
  );
}