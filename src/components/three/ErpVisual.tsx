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
    </figure>
  );
}
