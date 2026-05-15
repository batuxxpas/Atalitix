"use client";

import { Button } from "@/components/ui";

/**
 * Global error boundary
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Bir şeyler ters gitti
        </h2>
        <p className="text-slate-400 mb-6">
          {error.message || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."}
        </p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  );
}
