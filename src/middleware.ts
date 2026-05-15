import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki path'lerle başlayan istekleri HARİÇ tut:
     * - _next/static (static dosyalar)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public klasörü
     * Geri kalan her şey middleware'den geçer.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
