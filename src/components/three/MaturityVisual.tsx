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
      <div className="relative w-full aspect-[1.18/1]">
        {mode === "3d" && <MaturityScene3D names={names} current={current} target={target} active={active} onActive={onActive} />}
      </div>
      <figcaption className="mt-1 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12.5px] text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-2"><span className="flex h-3 w-3 flex-col gap-[1px]"><span className="flex-1 rounded-[1px] bg-[#0b1a4f]" /><span className="flex-1 rounded-[1px] bg-[#3d7ff0]" /><span className="flex-1 rounded-[1px] bg-[#c4d7ff]" /></span>Mevcut seviye</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-[2px] border border-[var(--brand-blue)] bg-[#c4d7ff]/50" />12 ay hedefi</span>
        <span className="italic">Örnek profil</span>
      </figcaption>
    </figure>
  );
}
