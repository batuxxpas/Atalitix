"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, Variants, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import { InViewMask } from "@/components/motion";
import { InlineEditable, useEditor } from "@/components/editor";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, rectSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function AnimatedCounter({ from, to }: { from: number; to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.1, rootMargin: "-50px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    const node = nodeRef.current;
    if (!started || !node) return;
    const duration = 2500;
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      node.textContent = Math.round(from + (to - from) * easeOut(progress)).toString();
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, from, to]);

  return <span ref={nodeRef}>{from}</span>;
}

interface ApproachStep {
  id?: string | number;
  step_number: number;
  title: string;
  description: string;
}

interface ExperienceItem {
  id?: string | number;
  step_number: number;
  title: string;
}

interface ApproachSectionProps {
  approachSteps: ApproachStep[];
  experienceItems: ExperienceItem[];
  hero?: any;
}

function SortableApproachCard({ step, index, isEditorMode, sortId, active }: { step: ApproachStep; index: number; isEditorMode: boolean; sortId: string; active: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };


  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={variants}
      className={`relative group flex gap-5 lg:block ${isDragging ? 'opacity-80 ring-2 ring-[var(--brand-blue-400)] rounded-xl' : ''}`}
    >
      {isEditorMode && (
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-md border cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm bg-slate-700/80 border-slate-600 text-slate-400 hover:text-white hover:border-indigo-400`}
          title="Sürükle"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      )}
      {/* Marker — sits on the progress track */}
      <div className="relative z-10 shrink-0 lg:mb-6">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[0.625rem] font-mono text-[13px] font-medium transition-all duration-500 ${
            active
              ? "bg-[var(--brand-blue)] text-white shadow-[0_0_0_6px_rgba(29,108,242,0.18)]"
              : "bg-[var(--brand-navy-900)] text-slate-500 border border-white/15"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className={`pr-4 pb-2 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-45"}`}>
        <InlineEditable section="approachSteps" field="title" index={index} defaultValue={step.title} tagName="h3" className="text-lg font-semibold text-white mb-2" />
        <InlineEditable section="approachSteps" field="description" index={index} defaultValue={step.description} tagName="p" className="text-sm text-slate-400 leading-relaxed" />
      </div>
    </motion.div>
  );
}

function SortableExperienceCard({ item, index, isEditorMode, sortId }: { item: ExperienceItem; index: number; isEditorMode: boolean; sortId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const variants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={variants}
      className={`relative group flex items-start gap-4 bg-white px-5 py-5 md:px-6 ${isDragging ? 'opacity-80 ring-2 ring-[var(--brand-blue)] shadow-xl' : ''}`}
    >
      {isEditorMode && (
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-md border cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm bg-white/90 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300`}
          title="Sürükle"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      )}
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--brand-blue-50)] text-[var(--brand-blue)]" aria-hidden="true">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </span>
      <InlineEditable section="experienceItems" field="title" index={index} defaultValue={item.title} tagName="p" className="text-[15px] font-medium text-[var(--brand-navy)] leading-relaxed pr-6" />
    </motion.div>
  );
}

export function ApproachSection({ approachSteps: initialApproach, experienceItems: initialExperience, hero }: ApproachSectionProps) {
  const { isEditorMode, data, reorderData } = useEditor();

  const activeApproach = isEditorMode && data?.approachSteps ? data.approachSteps : initialApproach;
  const activeExperience = isEditorMode && data?.experienceItems ? data.experienceItems : initialExperience;

  // Dark panel expands from an inset card to full-bleed as it scrolls in
  const panelRef = useRef<HTMLElement>(null);
  const { scrollYProgress: panelP } = useScroll({ target: panelRef, offset: ["start end", "start 15%"] });
  const clipPath = useTransform(panelP, (v) => {
    const k = 1 - v;
    return `inset(0px ${(k * 4).toFixed(2)}% 0px ${(k * 4).toFixed(2)}% round ${(k * 32).toFixed(1)}px)`;
  });

  // Steps light up along a scroll-linked track
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsP } = useScroll({ target: stepsRef, offset: ["start 80%", "end 60%"] });
  const fill = useSpring(stepsP, { stiffness: 120, damping: 28, mass: 0.4 });
  const [activeStep, setActiveStep] = useState(-1);
  useMotionValueEvent(stepsP, "change", (v) => {
    const n = activeApproach.length;
    setActiveStep(v <= 0.001 ? -1 : Math.min(n - 1, Math.floor(v * n)));
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Approach sort IDs
  const approachIds = activeApproach.map((s: ApproachStep, i: number) => s.id?.toString() || s.title || `ap-${i}`);
  const handleApproachDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = approachIds.indexOf(active.id as string);
    const newIdx = approachIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    reorderData("approachSteps", arrayMove(activeApproach, oldIdx, newIdx));
  };

  // Experience sort IDs
  const experienceIds = activeExperience.map((s: ExperienceItem, i: number) => s.id?.toString() || s.title || `exp-${i}`);
  const handleExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = experienceIds.indexOf(active.id as string);
    const newIdx = experienceIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    reorderData("experienceItems", arrayMove(activeExperience, oldIdx, newIdx));
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const approachCards = activeApproach.map((step: ApproachStep, index: number) => (
    <SortableApproachCard key={approachIds[index]} step={step} index={index} isEditorMode={isEditorMode} sortId={approachIds[index]} active={isEditorMode || index <= activeStep} />
  ));

  const experienceCards = activeExperience.map((item: ExperienceItem, index: number) => (
    <SortableExperienceCard key={experienceIds[index]} item={item} index={index} isEditorMode={isEditorMode} sortId={experienceIds[index]} />
  ));

  const nSteps = Math.max(activeApproach.length, 1);
  const approachGrid = "relative grid grid-cols-1 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] gap-x-6 gap-y-10";
  const approachGridStyle = { ["--cols" as string]: nSteps } as React.CSSProperties;
  // Horizontal track runs from the first to the last marker centre (gap-x-6 = 24px, marker = 40px)
  const trackRight = `calc((100% - ${24 * (nSteps - 1)}px) / ${nSteps} - 20px)`;
  const track = (
    <>
      <div className="hidden lg:block absolute top-5 left-5 h-px bg-white/10" style={{ right: trackRight }} aria-hidden="true">
        <motion.div className="h-full origin-left bg-[var(--brand-blue)]" style={{ scaleX: isEditorMode ? 1 : fill }} />
      </div>
      <div className="lg:hidden absolute left-5 top-5 bottom-8 w-px bg-white/10" aria-hidden="true">
        <motion.div className="w-full h-full origin-top bg-[var(--brand-blue)]" style={{ scaleY: isEditorMode ? 1 : fill }} />
      </div>
    </>
  );
  const experienceList = "rounded-2xl border border-slate-200 bg-slate-200 grid grid-cols-1 gap-px overflow-hidden shadow-[0_20px_50px_-30px_rgba(11,26,79,0.3)]";

  return (
    <>
      <section ref={panelRef} id="yaklasim" className="relative bg-white">
        <motion.div
          style={isEditorMode ? undefined : { clipPath }}
          className="relative py-24 md:py-32 blueprint-bg-dark text-white overflow-hidden"
        >
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60rem] max-w-full rounded-full bg-[var(--brand-blue)]/15 blur-3xl" aria-hidden="true" />
        <div className="container relative">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-14 md:mb-16"
          >
            <div className="lg:col-span-7">
              <InlineEditable section="hero" field="approach_label" defaultValue={hero?.approach_label || "YAKLAŞIM"} tagName="p" className="section-label !text-[var(--brand-blue-400)] mb-4" />
              <InViewMask instant={isEditorMode}>
                <InlineEditable section="hero" field="approach_title" defaultValue={hero?.approach_title || ""} tagName="h2" className="section-title-light" />
              </InViewMask>
            </div>
            <div className="lg:col-span-5">
              <InlineEditable section="hero" field="approach_desc" defaultValue={hero?.approach_desc || ""} tagName="p" className="text-slate-400 leading-relaxed" />
            </div>
          </motion.div>

          {isEditorMode ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleApproachDragEnd}>
              <SortableContext items={approachIds} strategy={rectSortingStrategy}>
                <div className={approachGrid} style={approachGridStyle}>{track}{approachCards}</div>
              </SortableContext>
            </DndContext>
          ) : (
            <motion.div ref={stepsRef} variants={staggerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className={approachGrid} style={approachGridStyle}>
              {track}
              {approachCards}
            </motion.div>
          )}
        </div>
        </motion.div>
      </section>

      <section id="deneyim" className="relative py-24 md:py-28 bg-[var(--color-bg-soft)] overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="lg:col-span-5"
            >
              <p className="section-label mb-5">DENEYİM</p>
              <div className="flex items-start text-7xl md:text-8xl font-bold tracking-tighter text-[var(--brand-navy)] mb-5 leading-none">
                {isEditorMode ? (
                  <InlineEditable section="hero" field="experience_years" defaultValue={hero?.experience_years || "20"} tagName="span" />
                ) : (
                  <AnimatedCounter from={0} to={parseInt(hero?.experience_years || "20") || 20} />
                )}
                <span className="text-[var(--brand-blue)] text-5xl md:text-6xl ml-1 mt-1">+</span>
              </div>
              <InViewMask instant={isEditorMode} className="mb-5">
                <InlineEditable section="hero" field="experience_title" defaultValue={hero?.experience_title || ""} tagName="h2" className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--brand-navy)] leading-snug" />
              </InViewMask>
              <InlineEditable section="hero" field="experience_desc" defaultValue={hero?.experience_desc || ""} tagName="p" className="text-slate-500 leading-relaxed" />
            </motion.div>

            <div className="lg:col-span-7">
              {isEditorMode ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
                  <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
                    <div className={experienceList}>{experienceCards}</div>
                  </SortableContext>
                </DndContext>
              ) : (
                <motion.div variants={staggerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className={experienceList}>
                  {experienceCards}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
