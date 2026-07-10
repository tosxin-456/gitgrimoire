"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const GITHUB_LOGIN_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

function UsernameInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative w-full">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/60 font-display text-lg select-none">
        @
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={39}
        aria-label={label}
        className="w-full rounded-full bg-background-elevated/70 border border-gold/30 focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20 pl-10 pr-5 py-4 text-center font-display tracking-[0.15em] text-gold-bright placeholder:text-foreground-muted/50 placeholder:tracking-[0.1em] transition-colors"
      />
    </div>
  );
}

function DuelForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [a, setA] = useState(searchParams.get("a") ?? "");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const loginA = a.trim().replace(/^@/, "");
    const loginB = b.trim().replace(/^@/, "");

    if (!GITHUB_LOGIN_RE.test(loginA) || !GITHUB_LOGIN_RE.test(loginB)) {
      setError("Enter two valid GitHub usernames");
      return;
    }
    if (loginA.toLowerCase() === loginB.toLowerCase()) {
      setError("A mage cannot duel themselves");
      return;
    }

    setError(null);
    router.push(`/duel/${encodeURIComponent(loginA)}/${encodeURIComponent(loginB)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full max-w-md">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <UsernameInput value={a} onChange={(v) => { setA(v); if (error) setError(null); }} placeholder="challenger" label="First GitHub username" />
        <span className="font-display text-sm tracking-[0.2em] text-foreground-muted shrink-0">VS</span>
        <UsernameInput value={b} onChange={(v) => { setB(v); if (error) setError(null); }} placeholder="rival" label="Second GitHub username" />
      </div>

      <button
        type="submit"
        className="font-display text-sm sm:text-base tracking-[0.2em] uppercase px-8 py-4 rounded-full bg-gold text-black glow-pulse hover:bg-gold-bright transition-colors cursor-pointer"
      >
        Begin the Duel
      </button>

      {error && (
        <p role="alert" className="text-xs tracking-[0.15em] uppercase text-red-400/90">
          {error}
        </p>
      )}
    </form>
  );
}

export default function DuelEntryPage() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-screen px-4 gap-10 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/"
          className="font-display text-[0.65rem] tracking-[0.35em] uppercase text-foreground-muted hover:text-gold-bright transition-colors"
        >
          GitGrimoire
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-shimmer glow-gold">Duel Arena</h1>
        <p className="text-sm text-foreground-muted max-w-sm">
          Pit two Magic Knights against each other. Their real GitHub deeds decide the victor.
        </p>
      </div>

      <Suspense fallback={null}>
        <DuelForm />
      </Suspense>
    </main>
  );
}
