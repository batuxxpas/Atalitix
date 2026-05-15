/**
 * Error display component
 */

import { Button } from "@/components/ui";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export function ErrorDisplay({
  title = "Bir hata oluştu",
  message = "Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.",
  retry,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-400"
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
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{message}</p>
      {retry && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={retry}>
            Tekrar Dene
          </Button>
        </div>
      )}
    </div>
  );
}
