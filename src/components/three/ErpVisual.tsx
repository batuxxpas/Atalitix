"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { ErpModuleMap } from "@/components/ui/ErpModuleMap";
import { visualMode, subscribeNoop } from "./capability";

const ErpScene3D = dynamic(() => import("./ErpScene3D"), { ssr: false, loading: () => null });

/** Hero visual: 3D ERP platform model, or the SVG map on devices without WebGL / with reduced motion. */
export function ErpVisual({ play }: { play: boolean }) {
  const mode = useSyncExternalStore(subscribeNoop, visualMode, () => "pending" as const);

  if (mode === "svg") return <ErpModuleMap play={play} />;

  return (
    <figure className="relative w-full max-w-[640px] mx-auto">
      <div className="relative w-full aspect-[1.08/1]">{mode === "3d" && <ErpScene3D play={play} />}</div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 border-[1.5px] border-[var(--brand-navy)] bg-white" /> ERP modülleri</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rotate-45 bg-[var(--brand-blue)]" /> ERP dışı katman</span>
        <span className="hidden sm:inline text-[12px] italic">Modüllerin üzerine gelin</span>
      </figcaption>
    </figure>
  );
}
