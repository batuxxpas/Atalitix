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
    </figure>
  );
}
