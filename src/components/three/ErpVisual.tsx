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
      <figcaption className="mt-1 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[12.5px] text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-white shadow-[0_0_0_1.5px_var(--brand-navy)]" /> ERP modülleri</span>
        <span className="inline-flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-blue)]" /> Canlı veri akışı</span>
        <span className="hidden sm:inline text-[12px] italic">Birimlerin üzerine gelin</span>
      </figcaption>
    </figure>
  );
}
