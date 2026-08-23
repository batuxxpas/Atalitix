"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
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

function SortableApproachCard({ step, index, isEditorMode, sortId }: { step: ApproachStep; index: number; isEditorMode: boolean; sortId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={slideLeftVariants}
      className={`card-dark flex items-start gap-5 relative group ${isDragging ? 'opacity-80 ring-2 ring-indigo-400 shadow-2xl' : ''} ${isEditorMode ? 'border border-transparent hover:border-indigo-500/30 transition-colors' : ''}`}
    >
      {isEditorMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-slate-700/80 border border-slate-600 text-slate-400 hover:text-white hover:border-indigo-400 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Sürükle"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      )}
      <div className="step-circle-light">{index + 1}</div>
      <div className="flex-1 pr-8">
        <InlineEditable section="approachSteps" field="title" index={index} defaultValue={step.title} tagName="h4" className="text-base font-bold text-white mb-1" />
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

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={fadeUpVariants}
      whileHover={isEditorMode ? undefined : { scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.8)", transition: { duration: 0.2 } }}
      className={`card-dark relative group ${isDragging ? 'opacity-80 ring-2 ring-indigo-400 shadow-2xl' : ''} ${isEditorMode ? 'border border-transparent hover:border-indigo-500/30 transition-colors' : ''}`}
    >
      {isEditorMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-slate-700/80 border border-slate-600 text-slate-400 hover:text-white hover:border-indigo-400 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Sürükle"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      )}
      <div className="step-circle mb-4">{String(index + 1).padStart(2, "0")}</div>
      <InlineEditable section="experienceItems" field="title" index={index} defaultValue={item.title} tagName="p" className="text-sm font-semibold text-white leading-relaxed pr-6" />
    </motion.div>
  );
}

export function ApproachSection({ approachSteps: initialApproach, experienceItems: initialExperience, hero }: ApproachSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEditorMode, data, reorderData } = useEditor();

  const activeApproach = isEditorMode && data?.approachSteps ? data.approachSteps : initialApproach;
  const activeExperience = isEditorMode && data?.experienceItems ? data.experienceItems : initialExperience;

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
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const approachCards = activeApproach.map((step: ApproachStep, index: number) => (
    <SortableApproachCard key={approachIds[index]} step={step} index={index} isEditorMode={isEditorMode} sortId={approachIds[index]} />
  ));

  const experienceCards = activeExperience.map((item: ExperienceItem, index: number) => (
    <SortableExperienceCard key={experienceIds[index]} item={item} index={index} isEditorMode={isEditorMode} sortId={experienceIds[index]} />
  ));

  return (
    <div className="section-dark relative">
      <section ref={sectionRef} id="yaklasim" className="py-24 overflow-hidden relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideRightVariants}
            >
              <InlineEditable section="hero" field="approach_label" defaultValue={hero?.approach_label || "YAKLAŞIM"} tagName="p" className="section-label text-indigo-400 mb-4" />
              <InlineEditable section="hero" field="approach_title" defaultValue={hero?.approach_title || "Dijital dönüşüm yolculuğu, önce süreç tasarımıdır."} tagName="h2" className="section-title-light mb-6" />
              <InlineEditable section="hero" field="approach_desc" defaultValue={hero?.approach_desc || "ERP, AI, RPA veya low-code araçları ancak doğru süreç mimarisiyle değer üretir. Bu yüzden çalışmaya araçtan değil; iş akışı, rol, veri, karar noktası ve ölçülebilir faydadan başlarız."} tagName="p" className="text-slate-400 leading-relaxed" />
            </motion.div>
            
            {isEditorMode ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleApproachDragEnd}>
                <SortableContext items={approachIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">{approachCards}</div>
                </SortableContext>
              </DndContext>
            ) : (
              <motion.div variants={staggerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-3">
                {approachCards}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section id="deneyim" className="py-24 border-t border-slate-800 overflow-hidden relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideRightVariants}
            >
              <div className="text-7xl md:text-8xl font-black text-white mb-4 leading-none flex items-center">
                {isEditorMode ? (
                  <InlineEditable section="hero" field="experience_years" defaultValue={hero?.experience_years || "20"} tagName="span" />
                ) : (
                  <AnimatedCounter from={0} to={parseInt(hero?.experience_years || "20") || 20} />
                )}
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: 2.5, type: "spring" }}
                  className="text-[var(--color-primary)] ml-1"
                >+</motion.span>
              </div>
              <InlineEditable section="hero" field="experience_title" defaultValue={hero?.experience_title || "Yıllık üretim, otomotiv, planlama ve bilgi teknolojileri deneyimi."} tagName="h2" className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6" />
              <InlineEditable section="hero" field="experience_desc" defaultValue={hero?.experience_desc || "Atalitix'in uzmanlığı; üretim sahası, otomotiv operasyonları, planlama disiplini ve bilgi teknolojileri geçmişinin birleşiminden gelir."} tagName="p" className="text-slate-400 leading-relaxed" />
            </motion.div>
            
            {isEditorMode ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
                <SortableContext items={experienceIds} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{experienceCards}</div>
                </SortableContext>
              </DndContext>
            ) : (
              <motion.div variants={staggerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experienceCards}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
