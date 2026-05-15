import { Spinner } from "@/components/ui";

/**
 * Global loading state
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 animate-pulse">Yükleniyor...</p>
      </div>
    </div>
  );
}
