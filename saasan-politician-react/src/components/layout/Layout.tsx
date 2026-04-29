import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8fc] lg:flex">
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex">
          <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-white hover:bg-white/10"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Sidebar className="hidden lg:flex" />

      <main className="min-h-screen flex-1 overflow-auto">
        <div className="border-b border-red-100 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                Politician Portal
              </p>
              <h1 className="text-lg font-semibold text-slate-900">Saasan</h1>
            </div>
            <div className="h-8 w-8" />
          </div>
        </div>

        <div className="min-h-full">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
