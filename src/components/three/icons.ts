/**
 * Line icons used inside the 3D scenes (path data from Lucide, ISC licence).
 * Rendered either as inline SVG (HTML labels) or onto a canvas (WebGL sprites).
 */
type Node = ["path", { d: string }] | ["circle", { cx: number; cy: number; r: number }] | ["rect", { x: number; y: number; width: number; height: number; rx: number }];

export const ICONS: Record<string, Node[]> = {
  finans: [
    ["path", { d: "M10 18v-7" }],
    ["path", { d: "M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" }],
    ["path", { d: "M14 18v-7" }], ["path", { d: "M18 18v-7" }], ["path", { d: "M3 22h18" }], ["path", { d: "M6 18v-7" }],
  ],
  satinalma: [
    ["circle", { cx: 8, cy: 21, r: 1 }], ["circle", { cx: 19, cy: 21, r: 1 }],
    ["path", { d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" }],
  ],
  stok: [
    ["path", { d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" }],
    ["path", { d: "M12 22V12" }], ["path", { d: "M3.29 7 12 12l8.71-5" }], ["path", { d: "m7.5 4.27 9 5.15" }],
  ],
  uretim: [
    ["path", { d: "M12 16h.01" }], ["path", { d: "M16 16h.01" }], ["path", { d: "M8 16h.01" }],
    ["path", { d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" }],
  ],
  satis: [["path", { d: "M16 7h6v6" }], ["path", { d: "m22 7-8.5 8.5-5-5L2 17" }]],
  ik: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }], ["circle", { cx: 9, cy: 7, r: 4 }],
  ],
  insan: [["circle", { cx: 12, cy: 8, r: 5 }], ["path", { d: "M20 21a8 8 0 0 0-16 0" }]],
  yonetisim: [
    ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
  inovasyon: [
    ["path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }],
    ["path", { d: "M9 18h6" }], ["path", { d: "M10 22h4" }],
  ],
  teknoloji: [
    ["path", { d: "M12 20v2" }], ["path", { d: "M12 2v2" }], ["path", { d: "M17 20v2" }], ["path", { d: "M17 2v2" }],
    ["path", { d: "M2 12h2" }], ["path", { d: "M2 17h2" }], ["path", { d: "M2 7h2" }], ["path", { d: "M20 12h2" }],
    ["path", { d: "M20 17h2" }], ["path", { d: "M20 7h2" }], ["path", { d: "M7 20v2" }], ["path", { d: "M7 2v2" }],
    ["rect", { x: 4, y: 4, width: 16, height: 16, rx: 2 }], ["rect", { x: 8, y: 8, width: 8, height: 8, rx: 1 }],
  ],
  musteri: [
    ["path", { d: "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" }],
  ],
  operasyon: [
    ["path", { d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }],
    ["circle", { cx: 12, cy: 12, r: 3 }],
  ],
  saha: [["rect", { x: 5, y: 2, width: 14, height: 20, rx: 2 }], ["path", { d: "M12 18h.01" }]],
  onay: [["circle", { cx: 12, cy: 12, r: 10 }], ["path", { d: "m9 12 2 2 4-4" }]],
  entegrasyon: [
    ["path", { d: "M12 22v-5" }], ["path", { d: "M15 8V2" }],
    ["path", { d: "M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z" }], ["path", { d: "M9 8V2" }],
  ],
  kpi: [["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }], ["path", { d: "m19 9-5 5-4-4-3 3" }]],
};

/** Inline SVG markup for an icon (stroke follows currentColor). */
export function iconSvg(name: string, size = 14, stroke = 2): string {
  const parts = (ICONS[name] || []).map(([tag, a]) => {
    if (tag === "path") return `<path d="${a.d}"/>`;
    if (tag === "circle") return `<circle cx="${a.cx}" cy="${a.cy}" r="${a.r}"/>`;
    return `<rect x="${a.x}" y="${a.y}" width="${a.width}" height="${a.height}" rx="${a.rx}"/>`;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${parts.join("")}</svg>`;
}

/** Draws an icon onto a 2D canvas context inside the box (x, y, size). */
export function drawIcon(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, size: number, color: string, stroke = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [tag, a] of ICONS[name] || []) {
    if (tag === "path") ctx.stroke(new Path2D(a.d));
    else if (tag === "circle") { ctx.beginPath(); ctx.arc(a.cx, a.cy, a.r, 0, Math.PI * 2); ctx.stroke(); }
    else { ctx.beginPath(); ctx.roundRect(a.x, a.y, a.width, a.height, a.rx); ctx.stroke(); }
  }
  ctx.restore();
}
