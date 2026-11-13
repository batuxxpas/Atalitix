"use client";

import React from "react";
import { motion } from "framer-motion";
import { InlineEditable, useEditor, CUSTOM_ICONS } from "@/components/editor";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InViewMask, FadeIn } from "@/components/motion";

interface Solution {
  id?: string | number;
  category_label: string;
  title: string;
  description: string;
  icon_name: string;
}

export interface SolutionSubItem {
  id: string;
  cozum_id: string;
  baslik: string;
  aciklama: string | null;
}

interface SolutionsSectionProps {
  solutions: Solution[];
  hero?: any;
  subItems?: SolutionSubItem[];
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function DragHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="absolute top-6 right-0 z-20 p-1.5 rounded border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      title="Sürükleyerek Taşı"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
      </svg>
    </div>
  );
}

// Where each solution / sub-area is explained further down the page (by position: 1, 2, 3 · 1.1, 1.2, 2.1)
const SOLUTION_TARGETS = ["erp", "olgunluk", "egitim"];
const SUB_TARGETS: Record<string, string> = { "1.1": "erp", "1.2": "odoo", "2.1": "firsatlar" };

function SolutionRow({ sol, index, isEditorMode, sortId, subs }: { sol: Solution; index: number; isEditorMode: boolean; sortId: string; subs: SolutionSubItem[] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      initial={isEditorMode ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`group relative ${isDragging ? "bg-white shadow-xl" : ""}`}
    >
      {/* Top rule draws in */}
      <motion.div
        className="h-px origin-left bg-[var(--rule)]"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } } }}
      />
      {/* Hover accent: a navy rule sweeps over the hairline */}
      <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-[var(--brand-navy)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" aria-hidden="true" />

      {isEditorMode && <DragHandle {...attributes} {...listeners} />}

      {/* Whole row links to the solution's detail section (sub-area links sit above it) */}
      {!isEditorMode && SOLUTION_TARGETS[index] && (
        <a href={`#${SOLUTION_TARGETS[index]}`} className="absolute inset-0 z-0" aria-label={`${sol.title}: detayları gör`} />
      )}

      <motion.div
        className={`relative grid grid-cols-12 gap-x-6 gap-y-3 py-7 md:py-8 ${isEditorMode ? "" : "pointer-events-none"}`}
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.15, ease: EASE_OUT } } }}
      >
        <span className="col-span-2 md:col-span-1 pt-1.5 text-[13px] tabular-nums text-[var(--ink-muted)] transition-colors group-hover:text-[var(--brand-blue)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="col-span-10 md:col-span-5 flex items-start gap-4">
          {CUSTOM_ICONS[sol.icon_name] && (
            <span className="mt-0.5 h-6 w-6 shrink-0 text-[var(--ink-muted)] transition-all duration-500 group-hover:text-[var(--brand-blue)] group-hover:-rotate-6" aria-hidden="true">
              {CUSTOM_ICONS[sol.icon_name]}
            </span>
          )}
          <InlineEditable
            section="solutions" field="title" index={index} defaultValue={sol.title} tagName="h3"
            className="font-serif text-[1.4rem] md:text-[1.55rem] leading-[1.2] tracking-[-0.01em] text-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-1.5"
          />
        </div>
        <div className="col-span-10 col-start-3 md:col-span-6 md:col-start-auto md:pt-1">
          <InlineEditable
            section="solutions" field="category_label" index={index} defaultValue={sol.category_label} tagName="p"
            className="text-[11px] font-medium tracking-[0.09em] uppercase text-[var(--brand-navy-700)] mb-2"
          />
          <InlineEditable
            section="solutions" field="description" index={index} defaultValue={sol.description} tagName="p"
            className="text-[15px] leading-relaxed text-[var(--ink-body)] max-w-xl"
          />
          {!isEditorMode && SOLUTION_TARGETS[index] && (
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--brand-navy-700)] opacity-70 transition-opacity group-hover:opacity-100">
              Detayları gör <span className="transition-transform group-hover:translate-y-0.5" aria-hidden="true">↓</span>
            </span>
          )}

          {/* Sub-areas: 1.1, 1.2 … */}
          {subs.length > 0 && (
            <ul className="mt-5 border-t border-[var(--rule)]">
              {subs.map((sub, j) => {
                const code = `${index + 1}.${j + 1}`;
                const target = SUB_TARGETS[code] ?? SOLUTION_TARGETS[index];
                const inner = (
                  <>
                    <span className="w-8 shrink-0 pt-0.5 text-[12.5px] tabular-nums text-[var(--brand-blue)]">{code}</span>
                    <div className="flex-1">
                      <p className="font-serif text-[1.05rem] text-[var(--ink)] transition-colors group-hover/sub:text-[var(--brand-blue)]">{sub.baslik}</p>
                      {sub.aciklama && <p className="mt-0.5 text-[13.5px] leading-relaxed text-[var(--ink-muted)]">{sub.aciklama}</p>}
                    </div>
                    {!isEditorMode && target && (
                      <span className="shrink-0 pt-0.5 text-[var(--ink-muted)] transition-all group-hover/sub:translate-y-0.5 group-hover/sub:text-[var(--brand-blue)]" aria-hidden="true">↓</span>
                    )}
                  </>
                );
                return (
                  <li key={sub.id} className="border-b border-[var(--rule)]">
                    {!isEditorMode && target ? (
                      <a href={`#${target}`} className="group/sub pointer-events-auto relative z-[1] flex gap-4 py-3">{inner}</a>
                    ) : (
                      <div className="flex gap-4 py-3">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.li>
  );
}

export function SolutionsSection({ solutions: initialSolutions, hero, subItems = [] }: SolutionsSectionProps) {
  const { isEditorMode, data, reorderData } = useEditor();
  const activeSolutions: Solution[] = isEditorMode && data?.solutions ? data.solutions : initialSolutions;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sortIds = activeSolutions.map((s, i) => s.id?.toString() || s.title || `sol-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortIds.indexOf(active.id as string);
    const newIndex = sortIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    reorderData("solutions", arrayMove(activeSolutions, oldIndex, newIndex));
  };

  const rows = activeSolutions.map((sol, index) => (
    <SolutionRow key={sortIds[index]} sol={sol} index={index} isEditorMode={isEditorMode} sortId={sortIds[index]} subs={subItems.filter((s) => s.cozum_id === String(sol.id))} />
  ));

  const list = <ul className="border-b border-[var(--rule)]">{rows}</ul>;

  return (
    <section id="cozumler" className="relative bg-white py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <FadeIn instant={isEditorMode} className="mb-6">
              <InlineEditable section="hero" field="solutions_label" defaultValue={hero?.solutions_label || "ÇÖZÜM ALANLARI"} tagName="p" className="section-label" />
            </FadeIn>
            <InViewMask instant={isEditorMode}>
              <InlineEditable section="hero" field="solutions_title" defaultValue={hero?.solutions_title || ""} tagName="h2" className="section-title" />
            </InViewMask>
          </div>
          <FadeIn instant={isEditorMode} delay={0.15} className="lg:col-span-5 lg:pt-12">
            <InlineEditable section="hero" field="solutions_desc" defaultValue={hero?.solutions_desc || ""} tagName="p" className="text-[15px] leading-relaxed text-[var(--ink-muted)]" />
          </FadeIn>
        </div>

        {isEditorMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortIds} strategy={verticalListSortingStrategy}>
              {list}
            </SortableContext>
          </DndContext>
        ) : (
          list
        )}
      </div>
    </section>
  );
}
