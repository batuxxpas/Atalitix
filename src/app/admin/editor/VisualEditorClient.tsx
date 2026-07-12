"use client";

import { useState } from "react";
import { HeroSection, SolutionsSection, ApproachSection } from "@/components/sections";
import { Header, Footer } from "@/components/layout";
import { saveHeroSection, saveSolutions, saveApproachSteps, saveExperienceItems } from "./actions";
import { EditorProvider, useEditor } from "@/components/editor";

export default function VisualEditorClient({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async (currentData: any) => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const updatedSolutions = currentData.solutions.map((s: any, i: number) => ({ ...s, sort_order: i + 1 }));
      const updatedApproach = currentData.approachSteps.map((s: any, i: number) => ({ ...s, sort_order: i + 1 }));
      const updatedExperience = currentData.experienceItems.map((s: any, i: number) => ({ ...s, sort_order: i + 1 }));

      const resHero = await saveHeroSection(currentData.hero);
      if (!resHero.success) throw new Error(resHero.error);
      
      const resSol = await saveSolutions(updatedSolutions);
      if (!resSol.success) throw new Error(resSol.error);
      
      const resApp = await saveApproachSteps(updatedApproach);
      if (!resApp.success) throw new Error(resApp.error);
      
      const resExp = await saveExperienceItems(updatedExperience);
      if (!resExp.success) throw new Error(resExp.error);
      
      setSaveMessage("✅ Başarıyla Kaydedildi!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e: any) {
      setSaveMessage("❌ Hata: " + e.message);
      setTimeout(() => setSaveMessage(""), 4000);
    }
    
    setIsSaving(false);
  };

  return (
    <EditorProvider isEditorMode={true} initialData={initialData}>
      <VisualEditorInner onSave={handleSave} isSaving={isSaving} saveMessage={saveMessage} />
    </EditorProvider>
  );
}

function VisualEditorInner({ onSave, isSaving, saveMessage }: { onSave: (data: any) => void, isSaving: boolean, saveMessage: string }) {
  const { data } = useEditor();

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Real Header - exactly as on homepage */}
      <Header />

      {/* The Actual Homepage Content - rendered exactly as the real site */}
      <main>
        <HeroSection
          hero={data.hero}
          processSteps={data.processSteps}
          processCategories={data.processCategories}
        />
        
        <SolutionsSection solutions={data.solutions} hero={data.hero} />
        
        <ApproachSection
          approachSteps={data.approachSteps}
          experienceItems={data.experienceItems}
          hero={data.hero}
        />
      </main>

      {/* Real Footer */}
      <Footer />

      {/* Floating Editor Controls */}
      <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-500">
        {/* Back button */}
        <button
          onClick={() => window.location.href = '/admin'}
          className="bg-white/95 backdrop-blur-sm text-slate-700 font-semibold px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all flex items-center gap-2 border border-slate-200/80 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Panele Dön
        </button>

        {/* Save button */}
        <div className="relative">
          {saveMessage && (
            <div className="absolute bottom-full mb-3 right-0 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap border border-slate-700/50">
              {saveMessage}
            </div>
          )}
          <button 
            onClick={() => onSave(data)}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.5)] font-bold text-base flex items-center gap-2.5 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
          >
            {isSaving ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isSaving ? "Kaydediliyor..." : "YAYINLA"}
          </button>
        </div>
      </div>
    </div>
  );
}
