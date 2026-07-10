"use client";

import { toBlob, toPng } from "html-to-image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GrimoireCover } from "@/components/grimoire/GrimoireCover";
import { GrimoirePages } from "@/components/grimoire/GrimoirePages";
import { cn } from "@/lib/utils";
import type { GrimoireBookData } from "@/types/grimoire";

interface GrimoireBookProps {
  data: GrimoireBookData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  allowExport?: boolean;
  hint?: boolean;
}

export function GrimoireBook({
  data,
  open,
  onOpenChange,
  className,
  allowExport = true,
  hint = true,
}: GrimoireBookProps) {
  const [internalOpen, setInternalOpen] = useState(open ?? false);
  const isOpen = open ?? internalOpen;
  const pagesRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  function toggle() {
    const next = !isOpen;
    if (onOpenChange) onOpenChange(next);
    if (open === undefined) setInternalOpen(next);
  }

  async function handleExport() {
    if (!pagesRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(pagesRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#07050d",
      });
      const link = document.createElement("a");
      link.download = `${data.login}-grimoire.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export grimoire", error);
    } finally {
      setExporting(false);
    }
  }

  async function handleShare() {
    if (!pagesRef.current) return;
    setSharing(true);
    const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/grimoire/${data.login}` : undefined;

    try {
      const blob = await toBlob(pagesRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#07050d",
      });

      const shareText = `My GitGrimoire — ${data.rank} of the ${data.squad}${profileUrl ? `\n${profileUrl}` : ""}`;

      if (blob) {
        const file = new File([blob], `${data.login}-grimoire.png`, { type: "image/png" });
        const filesPayload = { files: [file] };
        if (navigator.canShare?.(filesPayload)) {
          await navigator.share({ ...filesPayload, title: "My GitGrimoire", text: shareText });
          return;
        }
      }

      if (navigator.share && profileUrl) {
        await navigator.share({ title: "My GitGrimoire", text: shareText, url: profileUrl });
        return;
      }

      if (profileUrl) {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") console.error("Failed to share grimoire", error);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className={cn("w-full flex flex-col items-center gap-6", className)}>
      <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-[16/10] perspective-1600">
        <div className="absolute inset-0 preserve-3d">
          <motion.div
            ref={pagesRef}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.92 }}
            transition={{ duration: 0.7, delay: isOpen ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ cursor: isOpen ? "pointer" : "default", pointerEvents: isOpen ? "auto" : "none" }}
            onClick={() => isOpen && toggle()}
          >
            <GrimoirePages data={data} />
          </motion.div>

          <motion.button
            type="button"
            onClick={toggle}
            aria-label={isOpen ? "Close grimoire" : "Open grimoire"}
            className="absolute top-0 h-full aspect-[3/4] backface-hidden"
            style={{
              left: "50%",
              x: "-50%",
              transformOrigin: "left center",
              pointerEvents: isOpen ? "none" : "auto",
              cursor: "pointer",
            }}
            initial={false}
            animate={{ rotateY: isOpen ? -155 : 0, opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
          >
            <GrimoireCover data={data} />
          </motion.button>
        </div>
      </div>

      {!isOpen && hint && (
        <p className="font-display text-xs tracking-[0.2em] uppercase text-foreground-muted animate-pulse">
          Tap the grimoire to open it
        </p>
      )}

      {isOpen && allowExport && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="font-display text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full border border-gold/40 text-gold-bright hover:bg-gold/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {exporting ? "Inscribing..." : "Download PNG"}
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="font-display text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full bg-gold text-black hover:bg-gold-bright transition-colors disabled:opacity-50 cursor-pointer"
          >
            {copied ? "Link Copied" : sharing ? "Preparing..." : "Share"}
          </button>
        </div>
      )}
    </div>
  );
}
