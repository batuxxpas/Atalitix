"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableListProps = {
  items: any[];
  idKey?: string;
  onReorder: (newItems: any[]) => void;
  strategy?: "grid" | "list";
  className?: string;
  children: (item: any, index: number) => React.ReactNode;
};

export function SortableList({
  items,
  idKey = "id",
  onReorder,
  strategy = "list",
  className = "",
  children,
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ensure each item has a stable ID
  const itemsWithIds = items.map((item, i) => ({
    ...item,
    _sortId: item[idKey] || item.title || `item-${i}`,
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemsWithIds.findIndex((i) => i._sortId === active.id);
    const newIndex = itemsWithIds.findIndex((i) => i._sortId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(reordered);
  };

  const sortingStrategy =
    strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemsWithIds.map((i) => i._sortId)}
        strategy={sortingStrategy}
      >
        <div className={className}>
          {itemsWithIds.map((item, index) => (
            <SortableItem key={item._sortId} id={item._sortId}>
              {children(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-80 scale-[1.02] shadow-2xl" : ""}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="Sürükle"
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
      {children}
    </div>
  );
}

// Dark theme version for sections with dark backgrounds
export function SortableItemDark({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-80 scale-[1.02] shadow-2xl" : ""}
    >
      {/* Drag Handle (dark theme) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-md bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-slate-400 hover:text-white hover:border-indigo-400 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="Sürükle"
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
      {children}
    </div>
  );
}

export { useSortable } from "@dnd-kit/sortable";
export { CSS } from "@dnd-kit/utilities";
export { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
export { arrayMove, SortableContext, rectSortingStrategy, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

