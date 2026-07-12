"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type EditorContextType = {
  isEditorMode: boolean;
  updateData: (section: string, field: string, value: any, index?: number) => void;
  reorderData: (section: string, newOrder: any[]) => void;
  data: any;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children, initialData, isEditorMode }: { children: ReactNode, initialData: any, isEditorMode: boolean }) {
  const [data, setData] = useState(initialData);

  const updateData = (section: string, field: string, value: any, index?: number) => {
    setData((prev: any) => {
      const newData = { ...prev };
      if (typeof index === 'number') {
        newData[section] = [...newData[section]];
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else {
        newData[section] = { ...newData[section], [field]: value };
      }
      return newData;
    });
  };

  const reorderData = (section: string, newOrder: any[]) => {
    setData((prev: any) => ({ ...prev, [section]: newOrder }));
  };

  return (
    <EditorContext.Provider value={{ isEditorMode, updateData, reorderData, data }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    return { isEditorMode: false, updateData: () => {}, reorderData: () => {}, data: null };
  }
  return context;
};
