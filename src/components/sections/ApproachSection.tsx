"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { InlineEditable, useEditor } from "@/components/editor";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InViewMask, FadeIn } from "@/components/motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function AnimatedCounter({ from, to }: { from: number; to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.1, rootMargin: "-50px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!started || !node) return;
    const duration = 2200;
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let rafId: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
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

function DragHandle({ dark, ...props }: React.HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      {...props}
      className={`absolute top-6 right-0 z-20 p-1.5 rounded border cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity ${
        dark ? "bg-white/10 border-white/20 text-slate-300" : "bg-white border-slate-200 text-slate-400"
      }`}
      title="Sürükle"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
      </svg>
    </div>
  );
}

function ApproachRow({ step, index, isEditorMode, sortId }: { step: ApproachStep; index: number; isEditorMode: boolean; sortId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      // Reading focus: a step brightens while it sits in the middle of the viewport
      initial={isEditorMode ? false : { opacity: 0.3 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-38% 0px -38% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative grid grid-cols-12 gap-x-6 border-t border-white/15 py-7 md:py-8"
    >
      {isEditorMode && <DragHandle dark {...attributes} {...listeners} />}
      <span className="col-span-2 font-serif text-[1.5rem] md:text-[1.75rem] leading-none text-[var(--brand-blue-400)] tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="col-span-10 pr-8">
        <InlineEditable section="approachSteps" field="title" index={index} defaultValue={step.title} tagName="h3" className="font-serif text-[1.3rem] md:text-[1.45rem] leading-tight text-white mb-2" />
        <InlineEditable section="approachSteps" field="description" index={index} defaultValue={step.description} tagName="p" className="text-[15px] leading-relaxed text-slate-300/90 max-w-xl" />
      </div>
    </motion.li>
  );
}

function ExperienceRow({ item, index, isEditorMode, sortId }: { item: ExperienceItem; index: number; isEditorMode: boolean; sortId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      initial={isEditorMode ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: EASE_OUT }}
      className={`group relative flex items-baseline gap-6 border-b border-[var(--rule)] py-5 ${isDragging ? "bg-white shadow-xl" : ""}`}
    >
      {isEditorMode && <DragHandle {...attributes} {...listeners} />}
      <span className="h-px w-6 shrink-0 translate-y-[-0.3em] bg-[var(--brand-blue)]" aria-hidden="true" />
      <InlineEditable section="experienceItems" field="title" index={index} defaultValue={item.title} tagName="p" className="font-serif text-[1.1rem] md:text-[1.2rem] leading-snug text-[var(--ink)] pr-8" />
    </motion.li>
  );
}

export function ApproachSection({ approachSteps: initialApproach, experienceItems: initialExperience, hero }: ApproachSectionProps) {
  const { isEditorMode, data, reorderData } = useEditor();

  const activeApproach: ApproachStep[] = isEditorMode && data?.approachSteps ? data.approachSteps : initialApproach;
  const activeExperience: ExperienceItem[] = isEditorMode && data?.experienceItems ? data.experienceItems : initialExperience;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const approachIds = activeApproach.map((s, i) => s.id?.toString() || s.title || `ap-${i}`);
  const handleApproachDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = approachIds.indexOf(active.id as string);
    const newIdx = approachIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    reorderData("approachSteps", arrayMove(activeApproach, oldIdx, newIdx));
  };

  const experienceIds = activeExperience.map((s, i) => s.id?.toString() || s.title || `exp-${i}`);
  const handleExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = experienceIds.indexOf(active.id as string);
    const newIdx = experienceIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    reorderData("experienceItems", arrayMove(activeExperience, oldIdx, newIdx));
  };

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: railP } = useScroll({ target: railRef, offset: ["start 65%", "end 55%"] });
  const railFill = useSpring(railP, { stiffness: 120, damping: 30, mass: 0.4 });

  const approachList = (
    <ol className="border-b border-white/15">
      {activeApproach.map((step, index) => (
        <ApproachRow key={approachIds[index]} step={step} index={index} isEditorMode={isEditorMode} sortId={approachIds[index]} />
      ))}
    </ol>
  );

  const experienceList = (
    <ul className="border-t border-[var(--rule-strong)]">
      {activeExperience.map((item, index) => (
        <ExperienceRow key={experienceIds[index]} item={item} index={index} isEditorMode={isEditorMode} sortId={experienceIds[index]} />
      ))}
    </ul>
  );

  return (
    <>
      {/* Approach — full-bleed navy */}
      <section id="yaklasim" className="relative bg-[var(--brand-navy-900)] text-white py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <FadeIn instant={isEditorMode} className="mb-6">
                  <InlineEditable section="hero" field="approach_label" defaultValue={hero?.approach_label || "YAKLAŞIM"} tagName="p" className="section-label !text-slate-400" />
                </FadeIn>
                <InViewMask instant={isEditorMode}>
                  <InlineEditable section="hero" field="approach_title" defaultValue={hero?.approach_title || ""} tagName="h2" className="section-title-light" />
                </InViewMask>
                <FadeIn instant={isEditorMode} delay={0.15} className="mt-8">
                  <InlineEditable section="hero" field="approach_desc" defaultValue={hero?.approach_desc || ""} tagName="p" className="text-[15px] leading-relaxed text-slate-300/80" />
                </FadeIn>
              </div>
            </div>

            <div ref={railRef} className="lg:col-span-7 relative md:pl-10">
              {/* Progress rail fills as the steps are read */}
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-white/10" aria-hidden="true">
                <motion.div className="h-full w-full origin-top bg-[var(--brand-blue)]" style={{ scaleY: isEditorMode ? 1 : railFill }} />
              </div>
              {isEditorMode ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleApproachDragEnd}>
                  <SortableContext items={approachIds} strategy={verticalListSortingStrategy}>
                    {approachList}
                  </SortableContext>
                </DndContext>
              ) : (
                approachList
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="deneyim" className="relative bg-white py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <FadeIn instant={isEditorMode} className="mb-8">
                <p className="section-label">Deneyim</p>
              </FadeIn>
              <div className="display flex items-start text-[5rem] md:text-[6.5rem] leading-[0.9] mb-6">
                {isEditorMode ? (
                  <InlineEditable section="hero" field="experience_years" defaultValue={hero?.experience_years || "20"} tagName="span" />
                ) : (
                  <AnimatedCounter from={0} to={parseInt(hero?.experience_years || "20") || 20} />
                )}
                <span className="text-[var(--brand-blue)] text-[3rem] md:text-[3.75rem] ml-1">+</span>
              </div>
              <InViewMask instant={isEditorMode} className="mb-6">
                <InlineEditable section="hero" field="experience_title" defaultValue={hero?.experience_title || ""} tagName="h2" className="font-serif text-[1.4rem] md:text-[1.6rem] leading-snug text-[var(--ink)]" />
              </InViewMask>
              <FadeIn instant={isEditorMode} delay={0.1}>
                <InlineEditable section="hero" field="experience_desc" defaultValue={hero?.experience_desc || ""} tagName="p" className="text-[15px] leading-relaxed text-[var(--ink-muted)]" />
              </FadeIn>
            </div>

            <div className="lg:col-span-7 lg:pt-16">
              {isEditorMode ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
                  <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
                    {experienceList}
                  </SortableContext>
                </DndContext>
              ) : (
                experienceList
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
