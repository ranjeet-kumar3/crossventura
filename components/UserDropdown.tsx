"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";


interface UserDropdownProps {
  user: {
    name: string;
    role: string;
    businessName?: string;
    image?: string;
  } | null;
  handleLogout: () => void;
}

const UserDropdown = ({ user, handleLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Use actual user data or empty placeholder
  const displayUser = user || {
    name: "",
    businessName: "",
    role: "",
    image: ""
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 p-1 rounded-full hover:bg-gray-50 transition-all duration-200 focus:outline-none group"
      >
        <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-100 group-hover:ring-[#193D66]/20 transition-all duration-300">
          {displayUser.image ? (
            <Image
              src={displayUser.image}
              alt="User Profile"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#0266FF] flex items-center justify-center text-white font-bold text-[15px] lg:text-[18px] transition-transform duration-500 group-hover:scale-110">
              {getInitials(displayUser.name)}
            </div>
          )}
        </div>


        <div className="hidden sm:flex flex-col text-left justify-center">
          <span className="text-[15px] lg:text-[16px] font-bold text-[#193D66] leading-tight">
            {displayUser.name}
          </span>
          {displayUser.businessName && (
            <span className="text-[11px] lg:text-[12px] text-gray-400 font-medium leading-tight lowercase">
              {displayUser.businessName}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-6 h-6 cursor-pointer text-[#3E4246] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[172px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100/80 py-2 z-[100] animate-in fade-in zoom-in duration-200">
          <div className="px-2 space-y-0.5">
            <DropdownItem
              href="/profile"
              label="Profile"
              onClick={() => setIsOpen(false)}
            />

            <DropdownItem
              href="/myorders"
              label="My Orders"
              onClick={() => setIsOpen(false)}
            />
            <DropdownItem
              href="/document"
              label="Documents"
              onClick={() => setIsOpen(false)}
            />
            <DropdownItem
              href="/payments"
              label="Payments"
              onClick={() => setIsOpen(false)}
            />

            {/* <div className="my-2 border-t border-gray-50" /> */}

            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full flex items-center cursor-pointer px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#1e293b] rounded-xl transition-all duration-200"
            >
              <span className="text-[18px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-[32px] w-full max-w-[590px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 animate-in zoom-in-95 fade-in duration-300">
            <div className="text-center space-y-4">
              <h3 className="text-[32px]  md:text-[36px] font-[800] text-[#1e293b] leading-tight">
                Log out?
              </h3>
              <p className="text-[#64748b] text-[16px] md:text-[18px] font-medium">
                Are you sure you want to log out?
              </p>
            </div>

            <div className="flex flex-col  sm:flex-row  gap-4 mt-10">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-12 py-4 rounded-full cursor-pointer border-2 border-slate-100 text-[#64748b] text-[16px] font-[700] hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-12 py-4 rounded-full cursor-pointer bg-[#FF2D37] text-white text-[16px] font-[400] shadow-lg shadow-[#FF2D37]/20 hover:bg-[#e62932] transition-all active:scale-95"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



interface DropdownItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

const DropdownItem = ({ href, label, onClick }: DropdownItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center px-4 py-3 text-gray-600 hover:bg-[#F8FAFC] hover:text-[#193D66] rounded-xl transition-all duration-200"
  >
    <span className="text-[18px] font-medium">{label}</span>
  </Link>
);

export default UserDropdown;
