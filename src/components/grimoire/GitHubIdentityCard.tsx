import Image from "next/image";

interface GitHubIdentityCardProps {
  login: string;
  name: string | null;
  avatarUrl: string;
}

/**
 * gitfut-style GitHub identity strip: who this grimoire belongs to and a
 * direct link to their real profile. Shared by the profile page and the
 * ceremony reveal.
 */
export function GitHubIdentityCard({ login, name, avatarUrl }: GitHubIdentityCardProps) {
  const githubUrl = `https://github.com/${login}`;

  return (
    <div className="rounded-xl border border-white/10 bg-background-elevated/60 p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 ring-1 ring-gold/30">
        <Image src={avatarUrl} alt={login} fill sizes="64px" className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-base sm:text-lg text-gold-bright truncate">
          {name ?? login}
        </p>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground-muted hover:text-gold-bright transition-colors truncate block"
        >
          github.com/{login} ↗
        </a>
      </div>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 font-display text-[0.6rem] sm:text-[0.65rem] tracking-[0.15em] uppercase px-3 sm:px-4 py-2 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors whitespace-nowrap"
      >
        View on GitHub
      </a>
    </div>
  );
}
