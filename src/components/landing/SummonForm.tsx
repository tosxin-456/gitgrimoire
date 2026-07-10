"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const GITHUB_LOGIN_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

/**
 * gitfut-style entry: type any GitHub username, no OAuth needed.
 * Navigates to the ceremony, which summons the grimoire for that login.
 */
export function SummonForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const login = username.trim().replace(/^@/, "");

    if (!login || !GITHUB_LOGIN_RE.test(login)) {
      setError("Enter a valid GitHub username");
      return;
    }

    setError(null);
    router.push(`/ceremony?user=${encodeURIComponent(login)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="relative w-full">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/60 font-display text-lg select-none">
          @
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null);
          }}
          placeholder="your-github-username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={39}
          aria-label="GitHub username"
          className="w-full rounded-full bg-background-elevated/70 border border-gold/30 focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20 pl-10 pr-5 py-4 text-center font-display tracking-[0.15em] text-gold-bright placeholder:text-foreground-muted/50 placeholder:tracking-[0.1em] transition-colors"
        />
      </div>

      <button
        type="submit"
        className="font-display text-sm sm:text-base tracking-[0.2em] uppercase px-8 py-4 rounded-full bg-gold text-black glow-pulse hover:bg-gold-bright transition-colors cursor-pointer"
      >
        Receive Your Grimoire
      </button>

      {error && (
        <p role="alert" className="text-xs tracking-[0.15em] uppercase text-red-400/90">
          {error}
        </p>
      )}
    </form>
  );
}
