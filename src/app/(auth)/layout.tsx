import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";

/**
 * Auth sayfaları layout'u (login, register)
 * Header ve Footer gösterilir ama minimal bir görünüm olur.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
