"use client";

import dynamic from "next/dynamic";
import React, { useSyncExternalStore } from "react";
import { visualMode, subscribeNoop } from "./capability";

const MaturityScene3D = dynamic(() => import("./MaturityScene3D"), { ssr: false, loading: () => null });

/** 3D maturity model, or the given 2D fallback (radar) on devices without WebGL / with reduced motion. */
export function MaturityVisual({
  names, current, target, active, onActive, fallback,
}: {
  names: string[]; current: number[]; target: number[];
  active: number | null; onActive: (i: number | null) => void;
  fallback: React.ReactNode;
}) {
  const mode = useSyncExternalStore(subscribeNoop, visualMode, () => "pending" as const);
  if (mode === "svg") return <>{fallback}</>;

  return (
    <figure className="w-full max-w-[560px] mx-auto">
      <div className="relative w-full aspect-[1.05/1]">
        {mode === "3d" && <MaturityScene3D names={names} current={current} target={target} active={active} onActive={onActive} />}
      </div>
      <figcaption className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12.5px] text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-2.5 bg-[var(--brand-navy-700)]" />Mevcut seviye</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-2.5 border border-dashed border-[var(--brand-blue)]" />12 ay hedefi</span>
        <span className="italic">Örnek profil</span>
      </figcaption>
    </figure>
  );
}
