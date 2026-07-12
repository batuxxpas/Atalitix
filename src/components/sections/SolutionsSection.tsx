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
  if (IconComp) {
    return (
      <div className="solution-icon">
        <div className="w-6 h-6">{IconComp}</div>
      </div>
    );
  }
  
  return (
    <div className="solution-icon">
      <div className="text-xl flex items-center justify-center w-full h-full">{name}</div>
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={cardVariants}
      whileHover={isEditorMode ? undefined : { y: -5, transition: { duration: 0.2 } }}
      className={`card-corporate relative group ${isDragging ? 'opacity-80 scale-[1.02] shadow-2xl ring-2 ring-indigo-400' : ''} ${isEditorMode ? 'border-2 border-transparent hover:border-emerald-200/60 transition-colors' : ''}`}
    >
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

      {isEditorMode ? (
        <IconPicker value={sol.icon_name} onChange={(iconName) => onUpdateIcon(index, iconName)} className="mb-4" />
      ) : (
        <SolutionIcon name={sol.icon_name} />
      )}
      <InlineEditable section="solutions" field="category_label" index={index} defaultValue={sol.category_label} tagName="p" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1" />
      <InlineEditable section="solutions" field="title" index={index} defaultValue={sol.title} tagName="h3" className="text-lg font-bold text-slate-900 mb-2" />
      <InlineEditable section="solutions" field="description" index={index} defaultValue={sol.description} tagName="p" className="text-sm text-slate-500 leading-relaxed" />
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

  return (
    <section ref={sectionRef} id="cozumler" className="py-24 grid-bg relative">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left title */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-4"
          >
            <InlineEditable section="hero" field="solutions_label" defaultValue={hero?.solutions_label || "ÇÖZÜM ALANLARI"} tagName="p" className="section-label mb-4" />
            <InlineEditable section="hero" field="solutions_title" defaultValue={hero?.solutions_title || "ERP içinde standart, ERP dışında esnek dijital katman."} tagName="h2" className="section-title mb-6" />
            <InlineEditable section="hero" field="solutions_desc" defaultValue={hero?.solutions_desc || "Her süreci tek bir araca zorlamayız. Önce iş akışını ve hedeflenen değeri netleştirir, sonra çözümü doğru katmana yerleştiririz: ERP, otomasyon, AI, low-code/no-code veya özel yazılım."} tagName="p" className="text-slate-500 leading-relaxed" />
          </motion.div>

          {/* Solution Cards */}
          {isEditorMode ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sortIds} strategy={rectSortingStrategy}>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {solutionCards}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {solutionCards}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
