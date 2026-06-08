"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Headphones,
  CreditCard,
  FileText,
  Package,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    name: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    name: "Package Management",
    icon: Package,
    href: "/admin/package",
  },
  {
    name: "Services Management",
    icon: Briefcase,
    href: "/admin/services",
  },
  {
    name: "Consultation Management",
    icon: Headphones,
    href: "/admin/consultations",
  },
  {
    name: "Payment Management",
    icon: CreditCard,
    href: "/admin/payments",
  },
  {
    name: "Document Management",
    icon: FileText,
    href: "/admin/documents",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the server-side logout API
      await fetch("/api/admin/auth/logout", { method: "POST" });
      
      // Redirect to admin login
      router.push("/admin-login");
      router.refresh(); // Refresh to clear any client-side cache
      
      // Close sidebar on mobile
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <div className={`
        flex flex-col w-[280px] xl:w-[260px] 2xl:w-[322px] h-screen bg-[#ABBED1]/20  border-gray-100 py-6 xl:py-4 2xl:py-6 px-4 xl:px-3 2xl:px-4 fixed left-0 top-0 z-50 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo & Close button */}
        <div className="mb-6 xl:mb-6 2xl:mb-10 px-6 xl:px-4 2xl:px-6 flex items-center justify-between">
          <Link href="/admin" onClick={onClose}>
            <Image
              src="/adminimg/adminlogo.png"
              alt="CrossVentura Logo"
              width={180}
              height={48}
              className="w-auto h-18 xl:h-14 2xl:h-18"
            />
          </Link>
          <button 
            onClick={onClose}
            className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 xl:py-2.5 2xl:py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm font-medium"
                    : "text-gray-500 hover:bg-white hover:text-blue-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                <span className="text-[16px] xl:text-[14px] 2xl:text-[18px] whitespace-nowrap truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 xl:py-2.5 2xl:py-3 rounded-xl text-gray-500 hover:bg-white hover:text-red-500 transition-all duration-200 w-full group cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            <span className="text-[14px] xl:text-[14px] 2xl:text-[16px]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
