"use client";

import React from "react";
import { SidebarNav, Navbar } from "@features/layout";

/**
 * Main layout for authenticated pages.
 * Wraps all pages in app/(main) with the sidebar and navbar.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - fixed position with mobile toggle support */}
      <div className="lg:hidden">
        <SidebarNav
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Desktop sidebar - always visible */}
      <div className="hidden lg:block">
        <SidebarNav />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
