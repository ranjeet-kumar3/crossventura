"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./auth/AuthModal";
import UserDropdown from "./UserDropdown";
import { useSession, signOut } from "next-auth/react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentUser = user || session?.user;

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        // Flatten the user object to include businessName
        const flattenedUser = {
          ...data.user,
          businessName: data.user.businessName || ""
        };
        setUser(flattenedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, [session]);

  const handleLogout = async () => {
    try {
      // If NextAuth session exists, sign out from NextAuth
      if (session) {
        await signOut({ redirect: false });
      }

      // Also call custom logout API
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok || session) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[50] bg-white border-b border-gray-100 transition-all duration-300">
        <div className="w-full mx-auto px-4 sm:px-10 lg:px-8 xl:px-16">
          <div className="flex justify-between items-center h-20 md:h-[94px] lg:h-[94px] xl:h-[100px] 2xl:h-[120px]">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative w-[62px] h-[62px] lg:w-[80px] lg:h-[80px] xl:w-[96px] xl:h-[96px]">
                  <Image
                    src="/logo.svg"
                    alt="CrossVentura Logo"
                    width={96}
                    height={96}
                    className="object-contain w-24 h-24"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center lg:ml-18 lg:space-x-6 xl:ml-10 xl:space-x-10">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Blogs", path: "/blogs" },
                { name: "Pricing", path: "/pricing" },
                { name: "Contact", path: "/contacts" }
              ].map((link) => (
                <div key={link.path} className="relative group">
                  <Link
                    href={link.path}
                    className={`flex flex-col items-center justify-center text-[clamp(16px,1.3vw,18px)] 2xl:text-[22px] transition-all py-2 ${pathname === link.path ? "text-[#0266FF] font-semibold" : "text-gray-600 hover:text-[#0266FF] font-[400]"
                      }`}
                  >
                    {/* Hidden bold placeholder to reserve space and prevent layout shift */}
                    <span className="font-bold h-0 overflow-hidden invisible" aria-hidden="true">
                      {link.name}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-[#0266FF] transition-all duration-300 ${pathname === link.path ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                    }`} />
                </div> 
              ))}
            </div>

            {/* Desktop Auth Buttons - Fixed Width Container to prevent shift */}
            <div className="hidden lg:flex items-center justify-end lg:w-[250px] xl:w-[280px] 2xl:w-[320px] lg:space-x-3 xl:space-x-4 2xl:space-x-6">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-3.5 xl:px-5 2xl:px-8 py-2 xl:py-2.5 2xl:py-3 cursor-pointer whitespace-nowrap text-center text-[14px] xl:text-[15px] 2xl:text-[16px] font-[400] text-gray-700 bg-[#3E4246]/4 hover:bg-[#e9eff5] rounded-full transition-all duration-200 active:scale-95"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 xl:px-5 2xl:px-6 py-2 xl:py-2.5 2xl:py-3 whitespace-nowrap text-center text-[14px] xl:text-[15px] 2xl:text-[16px] font-[400] text-white bg-gradient-to-r from-[#0266FF] to-[#3B87FA] hover:opacity-90 transition-all rounded-full flex items-center justify-center cursor-pointer gap-2 shadow-lg "
                  >
                    Log In
                    <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />
                  </button>
                </>
              ) : (
                <UserDropdown user={currentUser} handleLogout={handleLogout} />
              )}

            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-gray-600 hover:bg-[#f4f7fa] transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-50 ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 pt-2 pb-8 space-y-2 bg-white">
            <Link href="/" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
            <Link href="/services" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link href="/blogs" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              Blogs
            </Link>
            <Link href="/pricing" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              Pricing
            </Link>
            <Link href="/contacts" className="block px-4 py-4 text-base font-bold text-gray-600 hover:text-[#33537a] hover:bg-[#f4f7fa] rounded-2xl transition-all" onClick={() => setIsOpen(false)}>
              Contact
            </Link>

            <div className="pt-6 grid grid-cols-2 gap-4 px-2">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="w-full py-4 text-center text-sm font-bold text-gray-700 bg-[#f4f7fa] rounded-2xl"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full py-4 text-center text-[16px] font-[400] text-white bg-gradient-to-r from-[#0266FF] to-[#3B87FA] hover:opacity-90 transition-all rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0266FF]/20"
                  >
                    Log In
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full py-4 text-center text-sm font-bold text-gray-700 bg-[#f4f7fa] rounded-2xl flex items-center justify-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 text-center text-[16px] font-[400] text-white bg-red-500 rounded-2xl flex items-center justify-center gap-1"
                  >
                    Logout
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;



