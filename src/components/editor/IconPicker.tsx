"use client";

import React, { useState, useRef, useEffect } from "react";
import { CUSTOM_ICONS } from "./CustomIcons";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

const ICON_NAMES = Object.keys(CUSTOM_ICONS);

export function IconPicker({ value, onChange, className = "" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const SelectedIcon = CUSTOM_ICONS[value] || CUSTOM_ICONS["erp"];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
        title="İkon Seç"
      >
        <div className="w-6 h-6 text-emerald-600 group-hover:text-indigo-500 transition-colors">
          {SelectedIcon}
        </div>
      </button>

      {/* Picker Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] w-64 bg-white shadow-2xl rounded-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 grid grid-cols-3 gap-1 max-h-64 overflow-y-auto custom-scrollbar">
            {ICON_NAMES.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  onChange(iconName);
                  setIsOpen(false);
                }}
                className={`p-3 flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors ${
                  value === iconName ? "bg-indigo-100 text-indigo-600" : "text-slate-600"
                }`}
                title={iconName}
              >
                <div className="w-6 h-6">
                  {CUSTOM_ICONS[iconName]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
