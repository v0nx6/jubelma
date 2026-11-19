"use client";

import { useEffect } from "react";

/**
 * Keeps a stable anonymous visitor key for the "Terakhir dilihat" history.
 * This replaces the old middleware, which Vercel shipped unbundled and broke
 * at runtime. Running on the client avoids middleware entirely.
 */
export function VisitorCookie() {
  useEffect(() => {
    const hasKey = document.cookie
      .split("; ")
      .some((entry) => entry.startsWith("jubelma_visitor="));
    if (hasKey) return;

    document.cookie = `jubelma_visitor=${crypto.randomUUID()}; path=/; SameSite=Lax; Max-Age=31536000`;
  }, []);

  return null;
}
