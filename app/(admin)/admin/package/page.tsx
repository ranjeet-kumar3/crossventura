"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  Eye,
  Loader2,
  PackageOpen,
  DollarSign,
  MapPin,
  Coins,
  Compass,
  Activity
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function PackagePage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [viewingPackage, setViewingPackage] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    state: string;
    stateFee: string;
    category: string;
    status: string;
    supportedStates: string[];
  }>({
    name: "",
    price: "",
    state: "",
    stateFee: "",
    category: "",
    status: "Active",
    supportedStates: []
  });

  const isCategoryHeader = useMemo(() => {
    if (!editingPackage) return false;
    return ["compliances", "payment solutions", "post business setup & scaling"].includes(
      (editingPackage.name || "").toLowerCase()
    );
  }, [editingPackage]);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/package?search=${searchTerm}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [searchTerm]);

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

  const totalPages = Math.ceil(packages.length / ITEMS_PER_PAGE);
  
  const currentPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return packages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [packages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (pkg: any = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      
      // Smart default fallback states based on package name if not already defined in database
      let initialStates = pkg.supportedStates || [];
      if (initialStates.length === 0) {
        if (pkg.name?.toLowerCase().includes("global")) {
          initialStates = ["New York", "Texas", "California"];
        } else {
          initialStates = ["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"];
        }
      }

      setFormData({
        name: pkg.name,
        price: pkg.price,
        state: pkg.state || "",
        stateFee: pkg.stateFee || "",
        category: pkg.category || "",
        status: pkg.status || "Active",
        supportedStates: initialStates
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: "",
        price: "",
        state: "",
        stateFee: "",
        category: "",
        status: "Active",
        supportedStates: ["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"]
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (pkg: any) => {
    setViewingPackage(pkg);
    setIsViewModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage ? { ...formData, id: editingPackage.id } : formData),
      });
      if (res.ok) {
        fetchPackages();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const res = await fetch(`/api/admin/package?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchPackages();
        }
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500 max-w-[1550px] 2xl:max-w-[1650px]">
      {/* Header Section */}
      <div className="bg-white px-8 h-26 rounded-[20px] border border-gray-50 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
          <p className="text-sm text-gray-500 font-medium font-outfit tracking-wide">View & manage all registered users</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group ">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Package"
              className="w-82 bg-gray-50 border text-black border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div 
                ref={filterRef}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[20px] shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex flex-col">
                  {['Service Type', 'State', 'Status'].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-6 py-3.5 text-[#3E4246] hover:bg-slate-50 transition-colors text-[16px] font-medium flex items-center justify-between group"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      {item}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 cursor-pointer text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
          >
            Add Package
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white border-b border-gray-300">
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider w-24">#</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Package Name</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">State</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">State Fee</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">User Journey Type</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-3 2xl:py-6 text-[15px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                      <span className="font-medium">Loading packages...</span>
                    </div>
                  </td>
                </tr>
              ) : currentPackages.length > 0 ? (
                currentPackages.map((pkg, index) => {
                  const isRowCategoryHeader = ["compliances", "payment solutions", "post business setup & scaling"].includes(
                    (pkg.name || "").toLowerCase()
                  );
                  return (
                    <tr key={pkg.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                        {((currentPage - 1) * ITEMS_PER_PAGE + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{pkg.name}</td>
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-700">
                        {isRowCategoryHeader ? "N/A" : pkg.price}
                      </td>
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-500">
                        {isRowCategoryHeader ? "N/A" : (
                          pkg.state?.toLowerCase() === "all states" || 
                          pkg.name?.toLowerCase().includes("premium") || 
                          pkg.name?.toLowerCase().includes("starter") || 
                          pkg.name?.toLowerCase().includes("global") ? (
                            <div className="relative inline-block group/tooltip cursor-help border-b border-dashed border-gray-300 pb-0.5">
                              <span className="text-gray-700 font-semibold">All States</span>
                              {/* Tooltip matching image exactly */}
                              <div className="absolute top-full left-0 mt-1 hidden group-hover/tooltip:block bg-white text-gray-800 text-[13px] font-normal border border-gray-800 py-1 px-3.5 shadow-sm whitespace-nowrap z-[90]">
                                Delaware, Wyoming, Florida, Texas, Nevada, New York, California, New Mexico, Washington
                              </div>
                            </div>
                          ) : (
                            pkg.state || "N/A"
                          )
                        )}
                      </td>
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-500">
                        {isRowCategoryHeader ? "N/A" : pkg.stateFee || "N/A"}
                      </td>
                      <td className="px-8 py-3 2xl:py-5.5 text-sm font-medium text-gray-500">{pkg.category || "N/A"}</td>
                    <td className="px-8 py-3 2xl:py-5.5">
                      <span className={`text-sm font-bold ${pkg.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-8 py-3 2xl:py-5.5">
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          onClick={() => openViewModal(pkg)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => openModal(pkg)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center text-gray-400 font-medium">
                    No packages found. Click "Add Package" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="p-8 flex items-center justify-center border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      (i + 1) === currentPage 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "text-gray-500 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-8 flex flex-col items-center justify-center ${
              !editingPackage 
                ? "bg-gradient-to-r from-blue-600 via-[#1D4ED8] to-indigo-600 text-white" 
                : "bg-white text-[#3E4246] border-b border-gray-50"
            }`}>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`absolute left-8 top-8 p-2 rounded-xl transition-all active:scale-90 ${
                  !editingPackage ? "hover:bg-white/10 text-white" : "hover:bg-gray-50 text-gray-900"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {!editingPackage ? (
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                    ✨ Create Mode
                  </span>
                  <h3 className="text-3xl font-extrabold tracking-tight">Add New Package</h3>
                  <p className="text-blue-100/90 text-xs font-semibold font-outfit tracking-wide">Configure your new business offering below</p>
                </div>
              ) : (
                <h3 className="text-2xl font-bold">{editingPackage ? "Edit Package" : "Add Package"}</h3>
              )}
            </div>
            
            <div className="px-10 py-10">
              <form className="space-y-5" onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-5">
                  {/* Package Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <PackageOpen className={`w-4 h-4 ${!editingPackage ? "text-indigo-500" : "text-gray-400"}`} />
                      Package Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Package Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all ${
                        !editingPackage 
                          ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                          : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <DollarSign className={`w-4 h-4 ${!editingPackage ? "text-emerald-500" : "text-gray-400"}`} />
                      Price
                    </label>
                    <input
                      type="text"
                      required={!isCategoryHeader}
                      disabled={isCategoryHeader}
                      placeholder="Enter Price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all ${
                        isCategoryHeader
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : !editingPackage 
                          ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                          : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <MapPin className={`w-4 h-4 ${!editingPackage ? "text-blue-500" : "text-gray-400"}`} />
                      State
                    </label>
                    <div className="relative group">
                      <select
                        disabled={isCategoryHeader}
                        value={formData.state}
                        onChange={(e) => {
                          const selectedState = e.target.value;
                          const stateFeeMap: Record<string, string> = {
                            "Delaware": "$160",
                            "Wyoming": "$103",
                            "Florida": "$125",
                            "Texas": "$310",
                            "Nevada": "$425",
                            "New York": "$205",
                            "California": "$90",
                            "New Mexico": "$50",
                            "Washington": "$200",
                            "All States": "N/A"
                          };
                          const fee = stateFeeMap[selectedState] || "";
                          setFormData({ 
                            ...formData, 
                            state: selectedState,
                            stateFee: fee
                          });
                        }}
                        className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                          isCategoryHeader
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : !editingPackage 
                            ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                            : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">Select State</option>
                        <option value="All States">All States</option>
                        {["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"].map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* State Fee */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <Coins className={`w-4 h-4 ${!editingPackage ? "text-amber-500" : "text-gray-400"}`} />
                      State Fee
                    </label>
                    <input
                      type="text"
                      disabled={isCategoryHeader}
                      placeholder="Enter State Fee"
                      value={formData.stateFee}
                      onChange={(e) => setFormData({ ...formData, stateFee: e.target.value })}
                      className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all ${
                        isCategoryHeader
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : !editingPackage 
                          ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                          : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {/* User Journey Type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <Compass className={`w-4 h-4 ${!editingPackage ? "text-violet-500" : "text-gray-400"}`} />
                      User Journey Type
                    </label>
                    <div className="relative group">
                      <select 
                        disabled={isCategoryHeader}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                          isCategoryHeader
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : !editingPackage 
                            ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                            : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">Select User Journey Type</option>
                        <option value="Start your new business">Start your new business</option>
                        <option value="Existing your business">Existing your business</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <Activity className={`w-4 h-4 ${!editingPackage ? "text-teal-500" : "text-gray-400"}`} />
                      Status
                    </label>
                    <div className="relative group">
                      <select 
                        disabled={isCategoryHeader}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full border rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                          isCategoryHeader
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : !editingPackage 
                            ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                            : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Supported States Section (Only for Start your new business) */}
                {formData.category === "Start your new business" && (
                  <div className="space-y-3.5 border-t border-gray-100 pt-5">
                    <label className="text-sm font-bold text-[#3E4246] ml-1">Supported States</label>
                    <div className="grid grid-cols-3 gap-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      {["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"].map(state => {
                        const isChecked = formData.supportedStates.includes(state);
                        return (
                          <label key={state} className="flex items-center gap-3 cursor-pointer group select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                let updatedStates = [...formData.supportedStates];
                                if (checked) {
                                  updatedStates.push(state);
                                } else {
                                  updatedStates = updatedStates.filter(s => s !== state);
                                }
                                setFormData({ ...formData, supportedStates: updatedStates });
                              }}
                              className="w-5 h-5 rounded border-gray-200 text-blue-600 focus:ring-blue-100 cursor-pointer"
                            />
                            <span className="text-[14px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{state}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 flex justify-center">
                  {!editingPackage ? (
                    <button 
                      type="submit"
                      className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-150 active:scale-[0.98]"
                    >
                       Create Package
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full max-w-sm py-4 bg-[#2B7FFF] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                    >
                      Update Package
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="relative p-8 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-2xl font-bold text-[#3E4246]">Package Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package Name</p>
                  <p className="text-[17px] font-bold text-[#3E4246]">{viewingPackage.name}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price</p>
                  <p className="text-[17px] font-bold text-[#3E4246]">{viewingPackage.price}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">State</p>
                  <p className="text-[17px] font-bold text-gray-700">{viewingPackage.state || "N/A"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">State Fee</p>
                  <p className="text-[17px] font-bold text-gray-700">{viewingPackage.stateFee || "N/A"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Journey Type</p>
                  <p className="text-[17px] font-bold text-gray-700">{viewingPackage.category || "N/A"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-bold">
                    {viewingPackage.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
