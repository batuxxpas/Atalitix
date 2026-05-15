"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, APP_NAME } from "@/lib/constants";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/hooks";

/**
 * Dashboard sidebar navigasyonu
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800/50 bg-slate-950 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-800/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {APP_NAME}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {DASHBOARD_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  {/* Icon placeholder - Lucide icons eklendiğinde değiştirilecek */}
                  <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-xs">
                    {item.title[0]}
                  </span>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="flex items-center gap-3">
          <Avatar
            fallback={user?.email || "U"}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email || "Kullanıcı"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Çıkış Yap"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
