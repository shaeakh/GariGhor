"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import defaultSettings from "@/data/settings.json";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First try local API if running in Node environment
      let authSuccess = false;
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            authSuccess = true;
          }
        }
      } catch (err) {
        // Fallback for static export (github.io)
      }

      // Fallback client-side verification for static export (GitHub Pages)
      const expectedUsername = defaultSettings.auth?.username || "admin";
      const expectedPassword = defaultSettings.auth?.password || "password";

      if (authSuccess || (username === expectedUsername && password === expectedPassword)) {
        sessionStorage.setItem("garighor_admin_session", "authenticated");
        router.push("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-500 font-extrabold text-white text-xl shadow-md">
            G
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink">
            GariGhor Admin Portal
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Sign in to manage dashboard settings & services
          </p>
        </div>

        <div className="rounded-2xl border border-brand-line bg-brand-card-bg p-8 shadow-xl">
          {error && (
            <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-brand-muted" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (admin)"
                  className="w-full rounded-lg border border-brand-line bg-brand-bg pl-10 pr-3 py-2 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-brand-muted" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (password)"
                  className="w-full rounded-lg border border-brand-line bg-brand-bg pl-10 pr-3 py-2 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange-500 focus:ring-2 focus:ring-brand-orange-500/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-bold py-2.5 shadow-md"
            >
              {loading ? "Authenticating..." : "Sign In to Admin"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-brand-line text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-orange-500 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to main website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
