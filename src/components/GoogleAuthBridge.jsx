"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/Providers";

/**
 * ✅ FIX for: "Google Login doesn't actually log the user in."
 *
 * Root cause: GoogleLoginButton calls next-auth's signIn("google"), which
 * creates a NextAuth session — a completely separate system from this
 * app's real auth, which is a custom JWT stored via useAuth()/saveAuth().
 * The backend already had a working /api/auth/google route that issues a
 * real app JWT, but nothing on the frontend ever called it.
 *
 * This component watches for a NextAuth session, exchanges it for a real
 * app JWT via the backend, and calls saveAuth() — so after the Google
 * OAuth redirect completes, useAuth().user/token actually populate.
 *
 * Mount this once near the root, e.g. inside Providers.jsx or AppShell,
 * underneath <SessionWrapper>:
 *
 *   <SessionWrapper>
 *     <Providers>
 *       <GoogleAuthBridge />
 *       <AppShell>{children}</AppShell>
 *     </Providers>
 *   </SessionWrapper>
 */
export default function GoogleAuthBridge() {
  const { data: session, status } = useSession();
  const { token, saveAuth } = useAuth();
  const exchanging = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (token) return; // already have an app JWT, nothing to do
    if (exchanging.current) return;

    exchanging.current = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session.user.name,
        email: session.user.email,
        photo: session.user.image,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.token && data?.user) {
          saveAuth(data.user, data.token);
        }
      })
      .catch((err) => console.error("Google auth bridge failed:", err))
      .finally(() => {
        exchanging.current = false;
      });
  }, [status, session, token, saveAuth]);

  return null;
}
