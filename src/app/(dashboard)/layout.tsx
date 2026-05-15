import { Sidebar } from "@/components/layout";

/**
 * Dashboard layout - Sidebar + main content alanı.
 * Bu layout sadece /dashboard/* route'larında gösterilir.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
