"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Search, Menu, Check, X, BellRing } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: string;
  createdAt: string;
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        const newNotifs: Notification[] = data.notifications || [];
        
        const currentIds = new Set(newNotifs.map(n => n.id));
        const prevIds = prevIdsRef.current;
        
        let hasNew = false;
        let latestMsg = "";
        
        // Only trigger toast if we already had a successful fetch (prevIds.size > 0) or if it's the first fetch and there are things.
        // Wait, actually better to just trigger if it's not the initial load and there's a new ID.
        // To handle initial load properly:
        if (prevIdsRef.current.size > 0 || notifications.length > 0) {
          for (const n of newNotifs) {
            if (!prevIds.has(n.id)) {
              hasNew = true;
              latestMsg = n.message;
              break;
            }
          }
        }
        
        if (hasNew && latestMsg) {
          setToastMessage(latestMsg);
          // Play a small sound if possible, or just the visual toast
          setTimeout(() => setToastMessage(null), 5000);
        }
        
        prevIdsRef.current = currentIds;
        setNotifications(newNotifs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications([]);
      prevIdsRef.current = new Set();
      setShowDropdown(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <header className="h-[100px] xl:h-[80px] 2xl:h-[100px] flex items-center justify-between px-4 md:px-8 xl:px-6 2xl:px-8 bg-[#ABBED1]/20  sticky top-0 z-40 ">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative group cursor-pointer"
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm font-medium">
                    No new notifications
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BellRing className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-semibold text-gray-800 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Admin Dropdown Wrapper */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-200 cursor-pointer group focus:outline-none"
          >
            <div className={`w-10 h-10 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-full overflow-hidden border-2 shadow-sm ring-1 transition-all ${
              showProfileDropdown 
                ? "border-blue-500 ring-blue-100 scale-105" 
                : "border-white ring-gray-100 group-hover:ring-blue-100 group-hover:scale-105"
            }`}>
              <Image
                src="/default-avatar.png"
                alt="Sandra W."
                width={40}
                height={40}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </div>
            <div className="text-left hidden xs:block">
              <h4 className="text-sm xl:text-xs 2xl:text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">Sandra W.</h4>
              <p className="text-[10px] xl:text-[9px] 2xl:text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Senior Broker</p>
            </div>
          </button>

          {/* Profile Dropdown Modal */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-[280px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 py-5 px-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col items-center text-center pb-4 border-b border-gray-50">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm mb-3">
                  <Image
                    src="/default-avatar.png"
                    alt="Sandra W."
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-base font-bold text-gray-900 leading-tight">Sandra W.</h4>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Senior Broker</p>
                
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Session
                </div>
              </div>
              
              {/* <div className="py-3 space-y-1">
                <button 
                  onClick={() => {
                    alert("Admin settings loading...");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Account Settings
                </button>
                <button 
                  onClick={() => {
                    alert("Security logs loading...");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Security & Logs
                </button>
              </div> */}

              <div className="pt-3 border-t border-gray-50">
                <Link
                  href="/admin-login"
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full flex items-center justify-center py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                >
                  Logout 
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 pr-6 flex items-start gap-3 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-gray-900">New Activity</h4>
            <p className="text-[13px] font-medium text-gray-600 leading-snug">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
