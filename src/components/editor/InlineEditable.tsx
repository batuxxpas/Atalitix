"use client";

import React, { useRef, useState, useCallback } from 'react';
import { useEditor } from './EditorProvider';

type InlineEditableProps = {
  section: string;
  field: string;
  index?: number;
  tagName?: any;
  className?: string;
  placeholder?: string;
  defaultValue: string;
  children?: React.ReactNode;
};

export function InlineEditable({ 
  section, field, index, tagName: Tag = "span", className = "", 
  placeholder = "", defaultValue, children 
}: InlineEditableProps) {
  const { isEditorMode, updateData, data } = useEditor();
  const elementRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  // Get current value from context if available, otherwise use default
  let currentValue = defaultValue;
  if (data && data[section]) {
    if (typeof index === 'number') {
      currentValue = data[section][index]?.[field] ?? defaultValue;
    } else {
      currentValue = data[section]?.[field] ?? defaultValue;
    }
  }

  const handleInput = useCallback(() => {
    if (!elementRef.current) return;
    const newValue = elementRef.current.innerHTML;
    updateData(section, field, newValue, index);
  }, [section, field, index, updateData]);

  const execCmd = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    handleInput();
  }, [handleInput]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    execCmd("foreColor", e.target.value);
  }, [execCmd]);

  const handleBgColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    execCmd("hiliteColor", e.target.value);
  }, [execCmd]);

  const handleFontSize = useCallback((size: string) => {
    // Use fontSize command with 1-7 range
    execCmd("fontSize", size);
    setShowFontSize(false);
  }, [execCmd]);

  if (!isEditorMode) {
    if (children) return <Tag className={className}>{children}</Tag>;
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: currentValue }} />;
  }

  const isInline = Tag === "span" || Tag === "a" || Tag === "b" || Tag === "i";
  const WrapperTag = isInline ? "span" : "div";
  const wrapperClass = isInline ? "relative inline group/edit" : "relative block group/edit w-full";

  return (
    <WrapperTag className={wrapperClass}>
      {/* Floating Toolbar */}
      {isFocused && (
        <span 
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl px-2 py-1.5 flex items-center gap-1 shadow-2xl z-[9999] whitespace-nowrap border border-slate-700/50"
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Bold */}
          <button type="button" onClick={() => execCmd('bold')}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md font-bold text-xs transition-colors" title="Kalın">
            B
          </button>
          {/* Italic */}
          <button type="button" onClick={() => execCmd('italic')}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md italic font-serif text-xs transition-colors" title="Eğik">
            I
          </button>
          {/* Underline */}
          <button type="button" onClick={() => execCmd('underline')}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md underline text-xs transition-colors" title="Altı Çizili">
            U
          </button>

          <span className="w-px h-5 bg-slate-600 mx-0.5" />

          {/* Font Size */}
          <span className="relative">
            <button type="button" onClick={() => setShowFontSize(!showFontSize)}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md text-[10px] font-mono transition-colors" title="Font Boyutu">
              Aa
            </button>
            {showFontSize && (
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-1 flex flex-col gap-0.5 z-50"
                onMouseDown={(e) => e.preventDefault()}>
                {[
                  { label: 'XS', val: '1' },
                  { label: 'S', val: '2' },
                  { label: 'M', val: '3' },
                  { label: 'L', val: '4' },
                  { label: 'XL', val: '5' },
                  { label: '2XL', val: '6' },
                  { label: '3XL', val: '7' },
                ].map(s => (
                  <button key={s.val} type="button" onClick={() => handleFontSize(s.val)}
                    className="px-3 py-1 text-xs hover:bg-white/10 rounded text-left whitespace-nowrap transition-colors">
                    {s.label}
                  </button>
                ))}
              </span>
            )}
          </span>

          <span className="w-px h-5 bg-slate-600 mx-0.5" />

          {/* Text Color */}
          <span className="relative w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md cursor-pointer overflow-hidden transition-colors" title="Metin Rengi">
            <span className="text-[10px] font-bold">A</span>
            <span className="absolute bottom-1 left-1 right-1 h-0.5 bg-red-500 rounded-full" />
            <input type="color" onChange={handleColorChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150" />
          </span>

          {/* Background Color */}
          <span className="relative w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md cursor-pointer overflow-hidden transition-colors" title="Arka Plan Rengi">
            <span className="text-[10px] font-bold bg-yellow-300 text-slate-900 px-0.5 rounded-sm">A</span>
            <input type="color" onChange={handleBgColorChange} defaultValue="#ffff00"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150" />
          </span>

          <span className="w-px h-5 bg-slate-600 mx-0.5" />

          {/* Remove Formatting */}
          <button type="button" onClick={() => execCmd('removeFormat')}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-md text-[10px] transition-colors text-red-400" title="Biçimlendirmeyi Kaldır">
            ✕
          </button>
        </span>
      )}

      {/* Editable Content */}
      <Tag
        ref={elementRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onFocus={() => { setIsFocused(true); setShowFontSize(false); }}
        onBlur={() => { setIsFocused(false); setShowFontSize(false); }}
        className={`outline-none transition-all duration-150 ${className} ring-0 hover:ring-2 hover:ring-indigo-400/40 focus:ring-2 focus:ring-indigo-500 rounded-sm px-0.5 -mx-0.5 min-w-[20px] min-h-[1em] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400/60`}
        data-placeholder={placeholder || "Metin yazın..."}
        dangerouslySetInnerHTML={{ __html: currentValue }}
        style={{ cursor: 'text' }}
      />
    </WrapperTag>
  );
}
