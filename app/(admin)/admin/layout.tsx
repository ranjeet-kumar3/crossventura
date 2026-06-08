"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] xl:ml-[260px] 2xl:ml-[322px]">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-4 md:px-8 xl:px-6 2xl:px-8 bg-[#ABBED1]/20 pb-12 xl:pb-6 2xl:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}