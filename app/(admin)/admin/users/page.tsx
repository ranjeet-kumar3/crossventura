"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  X,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  businessName: string;
  category: string;
  plan: string;
  services: string;
  consultation: string;
  avatar: string;
  rawDetails: any;
}

const ITEMS_PER_PAGE = 6;

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [lastTotalCount, setLastTotalCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchTerm,
        category: selectedCategory || '',
        service: selectedService || '',
      });

      const res = await fetch(`/api/admin/users?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalUsers(data.total);

        // Notify if new users are found during auto-refresh
        if (lastTotalCount !== null && data.total > lastTotalCount) {
          const newCount = data.total - lastTotalCount;
          toast.success(`${newCount} new user(s) registered!`, {
            description: "The user list has been automatically updated.",
            icon: <UserPlus className="w-5 h-5" />,
            duration: 5000,
          });
        }
        setLastTotalCount(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch on dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedCategory, selectedService]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, searchTerm, selectedCategory, selectedService]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-2 animate-in fade-in duration-500 max-w-[1550px] 2xl:max-w-[1650px]">
      {/* Header Section */}
      <div className="bg-white px-8 h-20 bg-red-300  rounded-[20px] border border-gray-50 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl  font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 font-medium font-outfit tracking-wide">View & manage all registered users</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-82  group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              placeholder="Search Name, email or business..."
              className="w-full bg-gray-50 border border-gray-100 text-[#3E424699] rounded-xl py-3.5 pl-10 pr-4 text-[16px] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 border cursor-pointer rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${isFilterOpen
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
                }`}
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="space-y-1">
                  <div className="relative group/category">
                    <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                      User Journey Type
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </button>

                    {/* Sub-menu on Hover */}
                    <div className="absolute right-full top-[-12px] mr-1 w-[200px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/category:block animate-in fade-in slide-in-from-right-2 duration-200">
                      {[
                        "Start your new business",
                        "Manage your existing business",
                        
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(selectedCategory === cat ? null : cat);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${selectedCategory === cat
                            ? "text-blue-600 bg-blue-50"
                            : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative group/service">
                    <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                      Services
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </button>

                    {/* Services Sub-menu on Hover */}
                    <div className="absolute right-full top-[-64px] mr-1 w-[200px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/service:block animate-in fade-in slide-in-from-right-2 duration-200">
                      {[
                        "EIN",
                        "Bank Account",
                        "Tax Filing",
                        "Trademark",
                        "Virtual Address"
                      ].map((service) => (
                        <button
                          key={service}
                          onClick={() => {
                            setSelectedService(selectedService === service ? null : service);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${selectedService === service
                            ? "text-blue-600 bg-blue-50"
                            : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group">
                    Timezone
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </button>
                  <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group">
                    Status
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-3 md:py-3 md:px-8 xl:py-2 2xl:py-3 xl:px-6 2xl:px-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[28px] font-[600] text-gray-900">Agents</h2>
            {selectedCategory && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className="hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedService && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedService}
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setCurrentPage(1);
                  }}
                  className="hover:text-green-800 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <span className="text-[15px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {totalUsers} TOTAL USERS
          </span>
        </div>

        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-2 2xl:py-3 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                <th className="px-12 xl:px-6 2xl:px-12 py-3 xl:py-2 2xl:py-3 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest text-center">Country</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-left">Business Name</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-left">User Journey Type</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest text-left">Plan</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest">Services</th>
                <th className="px-6 xl:px-4 2xl:px-6 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest text-center">Consultation</th>
                <th className="px-8 xl:px-4 2xl:px-8 py-3 xl:py-4 2xl:py-5 text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-8 py-10 text-center text-gray-400 font-medium">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-7 xl:px-4 2xl:px-7 py-3.5 xl:py-6 2xl:py-6 text-sm xl:text-xs 2xl:text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">{user.displayId}</td>
                    <td className="px-7 xl:px-4 2xl:px-7 py-3.5 xl:py-6 2xl:py-6">
                      <div className="flex items-center gap-4 xl:gap-3 2xl:gap-4">
                        <div className="w-9 h-9 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:border-blue-200">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-[14px] xl:text-[13px] 2xl:text-[14px] font-medium text-[#3E4246] leading-tight group-hover:text-[#2B7FFF] transition-colors">{user.name}</h4>
                          <span className="text-[12px] xl:text-[10px] 2xl:text-[12px] text-gray-400 font-medium mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 text-center">
                      <span className="text-[14px] xl:text-[13px] 2xl:text-[14px] font-medium text-gray-600">{user.country}</span>
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 text-sm xl:text-[13px] 2xl:text-sm font-medium text-gray-800 whitespace-nowrap text-left">{user.businessName}</td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 text-sm xl:text-[13px] 2xl:text-sm font-medium text-gray-500 text-left">
                      {user.category === "start your new business" ? "Start your new business" : 
                       user.category === "manage your exisitng business" ? "Manage your existing business" : 
                       user.category}
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 max-w-[160px]">
                      <span
                        className="text-sm xl:text-[13px] 2xl:text-sm font-semibold text-gray-600 truncate block text-left"
                        title={user.plan}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 max-w-[200px]">
                      <span
                        className="text-sm xl:text-[13px] 2xl:text-sm font-medium text-gray-600 truncate block"
                        title={user.services}
                      >
                        {user.services}
                      </span>
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        user.consultation === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 
                        user.consultation === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-400'
                        }`}>
                        {user.consultation.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 xl:px-4 2xl:px-8 py-1.5 xl:py-1 2xl:py-1.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1 text-blue-500 cursor-pointer hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all active:scale-110"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-8 py-10 text-center text-gray-400 font-medium">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="py-2.5 xl:py-1.5 2xl:py-6 px-8 xl:px-4 2xl:px-8 flex items-center justify-center gap-2 border-t border-gray-300 flex-shrink-0">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border cursor-pointer border-gray-400 rounded-lg text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                    ? "bg-blue-600 text-white cursor-pointer shadow-lg shadow-blue-200 border border-blue-600 scale-105"
                    : "text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100 active:scale-95"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-400 cursor-pointer rounded-lg text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-[1230px] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-8 flex items-center justify-center border-b border-gray-50">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-xl transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h3 className="text-2xl font-bold text-[#3E4246]">User Details</h3>
            </div>

            <div className="px-12 py-10 overflow-y-auto max-h-[80vh] hide-scrollbar">
              <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                {/* User Information */}
                <div>
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">User Information</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Name</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Email</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Phone</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Country</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.country}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Timezone</span>
                      <span className="text-[#374151] font-semibold text-base">{(selectedUser as any).timezone || "IST"}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Plan */}
                <div>
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Selected Plan</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Plan</span>
                      <span className="text-[#374151] font-semibold text-base">
                        {selectedUser.plan || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">State</span>
                      <span className="text-[#374151] font-semibold text-base">
                        {selectedUser.category === "manage your exisitng business"
                          ? (selectedUser.rawDetails?.manageBusiness?.state || "N/A")
                          : (selectedUser.rawDetails?.plan?.state || "N/A")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Entity Type</span>
                      <span className="text-[#374151] font-semibold text-base">
                        {selectedUser.category === "manage your exisitng business"
                          ? "EXISTING BUSINESS"
                          : selectedUser.rawDetails?.businessDetails?.entityType?.toUpperCase() || "LLC"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add-On Services */}
                <div>
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Add-On Services</h4>
                  <div className="space-y-4">
                    {(() => {
                      const selectedAddons = [
                        ...(selectedUser.rawDetails?.starter?.addOnServices || []),
                        ...(selectedUser.rawDetails?.premium?.addOnServices || []),
                        ...(selectedUser.rawDetails?.global?.addOnServices || []) // Global might also have services
                      ];

                      const serviceInfo: Record<string, { label: string, price: string }> = {
                        "ein-letter": { label: "EIN Letter", price: "$80" },
                        "virtual-mailbox": { label: "Virtual Mailbox", price: "$25/mo" },
                        "virtual-bank": { label: "Virtual Bank Account Setup", price: "$100" },
                        "boir-filing": { label: "BOIR Filing", price: "$200" },
                        "operating-agreement": { label: "Operating Agreement for LLC", price: "$150" },
                        "bookkeeping": { label: "Bookkeeping & Accounting", price: "$200/mo" },
                        "physical-address": { label: "Physical Office Address", price: "$200/mo" },
                      };

                      if (selectedAddons.length === 0) {
                        return <p className="text-[#6B7280] italic text-base">No add-on services selected</p>;
                      }

                      return selectedAddons.map((serviceId: string) => (
                        <div key={serviceId} className="flex justify-between items-center text-sm">
                          <span className="text-[#6B7280] font-medium text-base">
                            {serviceInfo[serviceId]?.label || serviceId}
                          </span>
                          <span className="text-[#374151] font-bold text-base">
                            {serviceInfo[serviceId]?.price || "Included"}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                 {/* Business Details (Conditionally Render based on Journey Category) */}
                {selectedUser.category === "manage your exisitng business" ? (
                  <div>
                    <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Existing Business Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Business Name</span>
                        <span className="text-[#374151] font-semibold text-base">{selectedUser.businessName}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Has Registered Company</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.manageBusiness?.hasRegisteredCompany ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Country of Registration</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.manageBusiness?.countryOfRegistration || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">State</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.manageBusiness?.state || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Business Category</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.manageBusiness?.businessCategory || "N/A"}
                        </span>
                      </div>
                      {selectedUser.rawDetails?.manageBusiness?.businessDescription && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-gray-100 text-sm">
                          <span className="text-[#6B7280] font-medium text-base">Business Description</span>
                          <p className="text-[#374151] font-normal text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                            {selectedUser.rawDetails.manageBusiness.businessDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Business Formation Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Business Name</span>
                        <span className="text-[#374151] font-semibold text-base">{selectedUser.businessName}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Number of Members</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.businessDetails?.numMembers || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Principal Address</span>
                        <span className="text-[#374151] font-semibold text-base">
                          {selectedUser.rawDetails?.businessDetails?.businessAddress || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category & Services */}
                <div>
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Category & Services</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Business Category</span>
                      <span className="text-[#374151] font-semibold text-base">
                        {selectedUser.category === "start your new business" ? "Start your new business" : 
                         selectedUser.category === "manage your exisitng business" ? "Manage your existing business" : 
                         selectedUser.category}
                      </span>
                    </div>
                    {selectedUser.rawDetails?.consultation && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Consultation Status</span>
                        <span className={`text-base font-bold ${selectedUser.consultation === 'Scheduled' ? 'text-blue-600' : 'text-amber-600'}`}>
                          {selectedUser.consultation}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="text-[#6B7280] font-medium text-base">Active Services</span>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const services = selectedUser.rawDetails?.category?.selectedServices || [];
                          
                          const serviceLabels: Record<string, string> = {
                            "google_verification": "Google Verification",
                            "board_flex": "Board Flex",
                            "physical_office": "Physical Office Address",
                            "virtual_office": "Virtual Office Address",
                            "warehousing": "Warehousing & Logistics",
                            "physical_bank": "Physical Bank Account",
                            "payment_gateway": "Payment Gateway",
                            "tax_guidance": "Tax Guidance",
                            "ein-letter": "EIN Letter",
                            "virtual-mailbox": "Virtual Mailbox",
                            "virtual-bank": "Virtual Bank Setup",
                            "boir-filing": "BOIR Filing",
                            "operating-agreement": "Operating Agreement",
                            "bookkeeping": "Bookkeeping",
                            "physical-address": "Physical Address",
                          };

                          if (services.length === 0) {
                            return <span className="text-gray-400 italic text-sm">No active services</span>;
                          }

                          return services.map((s: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-50 text-[#0266FF] rounded-full text-sm font-semibold border border-blue-100">
                              {serviceLabels[s] || s}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Plan / Warehousing Intake Form */}
              {selectedUser.rawDetails?.global && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6 pb-2 border-b border-gray-100">Warehousing Intake Form (Global Plan)</h4>
                  <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Exporting to US</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.exportingToUS || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Product Category</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.productCategory || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Quantity per Shipment</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.rawDetails.global.quantity || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Dimensions</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.rawDetails.global.dimensions || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Shipment Frequency</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.frequency || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Approx Orders per month</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.rawDetails.global.approxOrders || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Shipment Weight</span>
                      <span className="text-[#374151] font-semibold text-base">{selectedUser.rawDetails.global.shipmentWeight || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Logistics Partner Needed?</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.logisticsPartner || "N/A"}</span>
                    </div>
                    {selectedUser.rawDetails.global.logisticsPartnerName && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280] font-medium text-base">Logistics Partner Name</span>
                        <span className="text-[#374151] font-semibold text-base">{selectedUser.rawDetails.global.logisticsPartnerName}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Return Handling Needed?</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.returnHandling || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6B7280] font-medium text-base">Timeline</span>
                      <span className="text-[#374151] font-semibold text-base capitalize">{selectedUser.rawDetails.global.timeline || "N/A"}</span>
                    </div>
                    <div className="col-span-2 flex justify-between items-center text-sm pt-2">
                      <span className="text-[#6B7280] font-medium text-base">Box Specs (L x W x H)</span>
                      <span className="text-[#374151] font-semibold text-base text-right">
                        {selectedUser.rawDetails.global.boxLength || "N/A"} x {selectedUser.rawDetails.global.boxWidth || "N/A"} x {selectedUser.rawDetails.global.boxHeight || "N/A"}
                        <br/><span className="text-gray-500 font-medium text-sm">Weight: {selectedUser.rawDetails.global.avgWeight || "N/A"} | Items/Box: {selectedUser.rawDetails.global.numProductsPerBox || "N/A"}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full max-w-md py-4 bg-[#2B7FFF] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}