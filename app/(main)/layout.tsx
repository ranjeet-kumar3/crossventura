"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname?.startsWith('/onboarding') || pathname === '/signup' || pathname === '/login';
  const hideFooter = hideLayout || ['/profile', '/document', '/payments', '/myorders'].includes(pathname || '');

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={`flex-grow ${!hideLayout ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
