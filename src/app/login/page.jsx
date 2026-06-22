"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/toastcontext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const auth = useAuth();
  const toastCtx = useToast();

  // safety check (IMPORTANT)
  const login = auth?.login;
  const loginWithGoogle = auth?.loginWithGoogle;
  const isAuthenticated = auth?.isAuthenticated;

  const toast = toastCtx?.toast;

  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result?.success) {
        toast?.("Login successful", "success");
        router.push(redirectUrl);
      } else {
        setError(result?.error || "Login failed");
        toast?.(result?.error || "Login failed", "error");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await loginWithGoogle("User", "user@gmail.com");

      if (result?.success) {
        toast?.("Google login success", "success");
        router.push(redirectUrl);
      } else {
        toast?.("Google login failed", "error");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-3 border p-2 rounded"
        >
          Continue with Google
        </button>

        <p className="text-sm mt-4 text-center">
          No account? <Link href="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}