import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * 404 Not Found sayfası
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center max-w-md px-4">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Sayfa bulunamadı
        </h2>
        <p className="text-slate-400 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  );
}
