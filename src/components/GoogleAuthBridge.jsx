"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/Providers";


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
