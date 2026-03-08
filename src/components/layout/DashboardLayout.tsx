import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Dashboard Layout — used for all authenticated / tool pages
 * Top navbar + collapsible sidebar + main content
 */
interface DashboardLayoutProps {
  children: ReactNode;
  /** Page title shown in sidebar header area */
  pageTitle?: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Header />
        <div className="flex flex-1 pt-[72px]">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {/* Sidebar trigger for mobile */}
            <div className="md:hidden flex items-center h-12 border-b border-border/30 px-4 bg-card/50">
              <SidebarTrigger className="text-foreground/70 hover:text-foreground" />
              {pageTitle && (
                <span className="ml-3 text-sm font-medium text-foreground tracking-wide">
                  {pageTitle}
                </span>
              )}
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
