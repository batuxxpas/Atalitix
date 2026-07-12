"use client";

import React, { useEffect, useState } from "react";
import { InlineEditable, useEditor } from "@/components/editor";

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
}

interface AtalitixGraphicMapProps {
  steps: ProcessStep[];
}

const DEFAULT_NODES = [
  { id: "saha", label: "Saha", x: 10, y: 70, color: "text-slate-900" },
  { id: "surec", label: "Süreç", x: 30, y: 45, color: "text-slate-900" },
  { id: "erp", label: "ERP", x: 50, y: 80, color: "text-slate-900" },
  { id: "veri", label: "Veri", x: 70, y: 45, color: "text-slate-900" },
  { id: "ai", label: "AI", x: 90, y: 60, color: "text-rose-700", border: "border-rose-100", shadow: "shadow-[0_8px_30px_rgb(225,29,72,0.15)]", hoverShadow: "hover:shadow-[0_20px_40px_rgb(225,29,72,0.3)]" },
];

export function AtalitixGraphicMap({ steps: initialSteps }: AtalitixGraphicMapProps) {
  const [mounted, setMounted] = useState(false);
  const { isEditorMode, data, updateData } = useEditor();

  const activeSteps = isEditorMode && data?.processSteps ? data.processSteps : initialSteps;

  // Get line color & speed from data or defaults
  const lineColor = data?.hero?.map_line_color || "#4f5ecb";
  const lineSpeed = data?.hero?.map_line_speed || "30";
  const lineGlow = data?.hero?.map_line_glow || "rgba(79, 94, 203, 0.15)";

  // Get node labels from data or defaults
  const nodeLabels = DEFAULT_NODES.map((n) => ({
    ...n,
    label: data?.hero?.[`node_${n.id}`] || n.label,
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden group">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatNode {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        .floating-node-0 { animation: floatNode 4s ease-in-out infinite; }
        .floating-node-1 { animation: floatNode 4.5s ease-in-out infinite 0.5s; }
        .floating-node-2 { animation: floatNode 5s ease-in-out infinite 1s; }
        .floating-node-3 { animation: floatNode 4.2s ease-in-out infinite 1.5s; }
        .floating-node-4 { animation: floatNode 4.8s ease-in-out infinite 2s; }
      
        @keyframes lineFlow {
          to { stroke-dashoffset: -1000; }
        }
        .animated-path {
          stroke-dasharray: 10 10;
          animation: lineFlow ${lineSpeed}s linear infinite;
        }
      `}} />

      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Header */}
      <div className="relative z-20 mb-8 md:mb-12 inline-flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-50 shadow-sm">
        <InlineEditable section="hero" field="map_title" defaultValue={data?.hero?.map_title || "ATALİTİX MAP"} tagName="h3" className="text-xs font-black text-[#3b82f6] tracking-[0.2em] uppercase mb-1" />
        <InlineEditable section="hero" field="map_badge" defaultValue={data?.hero?.map_badge || "Sahadan sisteme, sistemden karara"} tagName="p" className="text-slate-500 text-sm font-medium" />
      </div>

      {/* Editor: Line Controls */}
      {isEditorMode && (
        <div className="relative z-30 mb-4 flex flex-wrap items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <span className="text-xs font-semibold text-slate-600 mr-1">🎨 Çizgi Ayarları:</span>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            Renk
            <input type="color" value={lineColor}
              onChange={(e) => updateData("hero", "map_line_color", e.target.value)}
              className="w-6 h-6 rounded border border-slate-200 cursor-pointer" />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            Glow
            <input type="color" value={lineGlow.includes("rgb") ? "#4f5ecb" : lineGlow}
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1,3),16);
                const g = parseInt(hex.slice(3,5),16);
                const b = parseInt(hex.slice(5,7),16);
                updateData("hero", "map_line_glow", `rgba(${r}, ${g}, ${b}, 0.15)`);
              }}
              className="w-6 h-6 rounded border border-slate-200 cursor-pointer" />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            Hız
            <input type="range" min="5" max="60" value={lineSpeed}
              onChange={(e) => updateData("hero", "map_line_speed", e.target.value)}
              className="w-20 h-1 accent-indigo-500" />
            <span className="text-[10px] text-slate-400 w-6">{lineSpeed}s</span>
          </label>
        </div>
      )}

      {/* Graphic Area */}
      <div className="relative h-56 md:h-72 w-full mb-10">
        {/* SVG Path */}
        <svg
          className={`absolute inset-0 w-full h-full overflow-visible transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 10 70 C 20 70, 20 45, 30 45 C 40 45, 40 80, 50 80 C 60 80, 60 45, 70 45 C 80 45, 80 60, 90 60"
            fill="none"
            stroke={lineGlow}
            strokeWidth="4"
          />
          <path
            d="M 10 70 C 20 70, 20 45, 30 45 C 40 45, 40 80, 50 80 C 60 80, 60 45, 70 45 C 80 45, 80 60, 90 60"
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            className="animated-path"
          />
        </svg>

        {/* Nodes */}
        {nodeLabels.map((node, i) => (
          <div
            key={node.id}
            className={`absolute flex items-center justify-center font-extrabold ${node.color} bg-white rounded-3xl ${(node as any).border || 'border-slate-50'} border-2 w-20 h-20 md:w-24 md:h-24 transition-all duration-[800ms] hover:scale-110 ${(node as any).shadow || 'shadow-[0_8px_30px_rgb(0,0,0,0.08)]'} ${(node as any).hoverShadow || 'hover:shadow-[0_20px_40px_rgb(59,130,246,0.2)]'} z-10 floating-node-${i} ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              transitionDelay: `${i * 100}ms`,
              cursor: isEditorMode ? 'text' : 'default',
            }}
          >
            {isEditorMode ? (
              <InlineEditable 
                section="hero" 
                field={`node_${node.id}`} 
                defaultValue={node.label} 
                tagName="span" 
                className={`font-extrabold ${node.color} text-center`}
                placeholder={node.id}
              />
            ) : (
              node.label
            )}
          </div>
        ))}
      </div>

      {/* Info Cards (processSteps) */}
      <div
        className="grid gap-4 md:gap-5 relative z-20 mt-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {activeSteps.map((step: ProcessStep, idx: number) => (
          <div
            key={step.step_number || idx}
            className={`bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 group/card flex flex-col h-full ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: `${600 + idx * 100}ms` }}
          >
            <span className="text-[#3b82f6] font-bold text-sm mb-3 block opacity-80 group-hover/card:opacity-100 transition-opacity">
              {String(step.step_number).padStart(2, "0")}
            </span>
            <InlineEditable section="processSteps" field="title" index={idx} defaultValue={step.title} tagName="h4" className="font-extrabold text-slate-900 text-lg md:text-xl mb-4 group-hover/card:text-[#2d3a8c] transition-colors leading-tight" />
            <InlineEditable section="processSteps" field="description" index={idx} defaultValue={step.description} tagName="p" className="text-sm text-slate-500 leading-relaxed flex-grow" />
          </div>
        ))}
      </div>
    </div>
  );
}
