import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
