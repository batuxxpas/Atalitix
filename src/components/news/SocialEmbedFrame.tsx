"use client";

import { useEffect, useRef, useState } from "react";
import type { SocialEmbed } from "@/lib/news-utils";

/**
 * Official LinkedIn / Instagram embed. Instagram's embed reports its real height via
 * postMessage (the same mechanism as its embed.js), so the frame fits the post exactly
 * instead of being cut off or leaving empty space.
 */
export function SocialEmbedFrame({ embed, title }: { embed: SocialEmbed; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(embed.height);

  useEffect(() => {
    if (embed.platform !== "Instagram") return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.instagram.com" || e.source !== ref.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const h = Number(data?.details?.height);
        if (data?.type === "MEASURE" && h > 100 && h < 3000) setHeight(Math.ceil(h));
      } catch {
        /* not an Instagram measure message */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embed.platform]);

  return (
    <figure>
      <figcaption className="mb-3 text-[13px] text-[var(--ink-muted)]">{embed.platform}&apos;daki paylaşımımız</figcaption>
      <iframe
        ref={ref}
        src={embed.src}
        title={`${embed.platform} paylaşımı: ${title}`}
        height={height}
        loading="lazy"
        allowFullScreen
        scrolling="no"
        className="block w-full max-w-[540px] border border-[var(--rule)] bg-white transition-[height] duration-300"
      />
    </figure>
  );
}
