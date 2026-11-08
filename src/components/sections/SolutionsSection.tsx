"use client";

import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { InlineEditable, useEditor, IconPicker, CUSTOM_ICONS } from "@/components/editor";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext, rectSortingStrategy, useSortable,
  arrayMove, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Solution {
  id?: string | number;
  category_label: string;
  title: string;
  description: string;
  icon_name: string;
}

interface SolutionsSectionProps {
  solutions: Solution[];
  hero?: any;
}

function SolutionIcon({ name }: { name: string }) {
  const IconComp = CUSTOM_ICONS[name || "erp"];
  return (
    <div className="solution-icon">
      {IconComp ? <div className="w-6 h-6">{IconComp}</div> : <div className="text-xl flex items-center justify-center w-full h-full">{name}</div>}
    </div>
  );
}

function SortableSolutionCard({ sol, index, isEditorMode, sortId, onUpdateIcon }: { sol: Solution; index: number; isEditorMode: boolean; sortId: string; onUpdateIcon: (index: number, iconName: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={cardVariants}
      className={`relative group h-full bg-white p-7 md:p-8 transition-colors duration-300 hover:bg-[var(--color-bg-soft)] ${isDragging ? 'opacity-80 shadow-2xl ring-2 ring-[var(--brand-blue)]' : ''} ${isEditorMode ? 'outline outline-1 outline-transparent hover:outline-emerald-300' : ''}`}
    >
      {/* Accent bar */}
      <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--brand-blue)] transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />

      {/* Drag Handle */}
      {isEditorMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-white/90 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Sürükleyerek Taşı"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" />
            <circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" />
            <circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between mb-8">
        {isEditorMode ? (
          <IconPicker value={sol.icon_name} onChange={(iconName) => onUpdateIcon(index, iconName)} />
        ) : (
          <SolutionIcon name={sol.icon_name} />
        )}
        <span className="font-mono text-xs text-slate-300 group-hover:text-[var(--brand-blue)] transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <InlineEditable section="solutions" field="title" index={index} defaultValue={sol.title} tagName="h3" className="text-xl font-semibold tracking-tight text-[var(--brand-navy)] mb-2" />
      <InlineEditable section="solutions" field="category_label" index={index} defaultValue={sol.category_label} tagName="p" className="font-mono text-[10.5px] font-medium tracking-wider text-[var(--brand-blue)] uppercase mb-4 leading-relaxed" />
      <InlineEditable section="solutions" field="description" index={index} defaultValue={sol.description} tagName="p" className="text-[14.5px] text-slate-500 leading-relaxed" />
    </motion.div>
  );
}

export function SolutionsSection({ solutions: initialSolutions, hero }: SolutionsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEditorMode, data, updateData, reorderData } = useEditor();

  const activeSolutions = isEditorMode && data?.solutions ? data.solutions : initialSolutions;

  const handleUpdateIcon = (index: number, iconName: string) => {
    updateData("solutions", "icon_name", iconName, index);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sortIds = activeSolutions.map((s: Solution, i: number) => s.id?.toString() || s.title || `sol-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortIds.indexOf(active.id as string);
    const newIndex = sortIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    reorderData("solutions", arrayMove(activeSolutions, oldIndex, newIndex));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const solutionCards = activeSolutions.map((sol: Solution, index: number) => {
    const sortId = sortIds[index];
    return (
      <SortableSolutionCard
        key={sortId}
        sol={sol}
        index={index}
        isEditorMode={isEditorMode}
        sortId={sortId}
        onUpdateIcon={handleUpdateIcon}
      />
    );
  });

  const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden";

  return (
    <section ref={sectionRef} id="cozumler" className="py-24 md:py-28 bg-white relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 md:mb-14"
        >
          <div className="lg:col-span-7">
            <InlineEditable section="hero" field="solutions_label" defaultValue={hero?.solutions_label || "ÇÖZÜM ALANLARI"} tagName="p" className="section-label mb-4" />
            <InlineEditable section="hero" field="solutions_title" defaultValue={hero?.solutions_title || "ERP içinde standart, ERP dışında esnek dijital katman."} tagName="h2" className="section-title" />
          </div>
          <div className="lg:col-span-5">
            <InlineEditable section="hero" field="solutions_desc" defaultValue={hero?.solutions_desc || ""} tagName="p" className="text-slate-500 leading-relaxed" />
          </div>
        </motion.div>

        {isEditorMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortIds} strategy={rectSortingStrategy}>
              <div className={gridClass}>{solutionCards}</div>
            </SortableContext>
          </DndContext>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className={gridClass}
          >
            {solutionCards}
          </motion.div>
        )}
      </div>
    </section>
  );
}
