"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  PackageOpen,
  DollarSign,
  MapPin,
  Coins,
  Compass,
  Activity
} from "lucide-react";

const ITEMS_PER_PAGE = 8;


export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [viewingService, setViewingService] = useState<any | null>(null);
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    availability: "All States",
    businessFlow: "",
    planType: "", // New field
    category: "",
    description: "",
    status: "Active"
  });



  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/services?search=${searchTerm}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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


  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.availability.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesName = !selectedServiceName || service.name === selectedServiceName;
      const matchesType = !selectedServiceType || service.type === selectedServiceType;

      return matchesSearch && matchesName && matchesType;
    });
  }, [searchTerm, services, selectedServiceName, selectedServiceType]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  const currentServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (service: any = null) => {
    if (service) {
      setEditingService(service);
      let initialPlanType = service.planType || "";
      if (initialPlanType === "All Plans" || initialPlanType === "Starter, Premium, Global") {
        initialPlanType = "Starter, Premium";
      }
      setFormData({
        name: service.name,
        type: service.type,
        price: service.price,
        availability: service.availability,
        businessFlow: service.businessFlow || "",
        planType: initialPlanType,
        category: service.category || "",
        description: service.description || "",
        status: service.status || "Active"
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        type: "",
        price: "",
        availability: "",
        businessFlow: "",
        planType: "",
        category: "",
        description: "",
        status: "Active"
      });
    }


    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService ? { ...formData, id: editingService.id } : formData),
      });
      if (res.ok) {
        fetchServices();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const res = await fetch(`/api/admin/services?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchServices();
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };


  return (
    <div className="h-full xl:h-auto xl:max-h-[820px] 2xl:max-h-[950px] flex flex-col space-y-3 animate-in fade-in duration-500 max-w-[1550px] 2xl:max-w-[1650px]">
      {/* Header Section */}
      <div className="bg-white px-8 h-26 rounded-[20px] border border-gray-50 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#3E4246] tracking-tight">Services Management</h1>
          <div className="flex items-center gap-3 mt-">
            <p className="text-sm text-gray-400 font-medium">View & manage all registered users</p>
            {selectedServiceName && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedServiceName}
                <button
                  onClick={() => setSelectedServiceName(null)}
                  className="hover:text-blue-800 transition-colors"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {selectedServiceType && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedServiceType}
                <button
                  onClick={() => setSelectedServiceType(null)}
                  className="hover:text-green-800 transition-colors"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-[#F8F9FA] border border-gray-100 rounded-2xl px-4 py-2 group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Services"
              className="bg-transparent border-none text-sm py-2 font-medium text-gray-600 outline-none w-48 md:w-64 placeholder:text-gray-300"
            />
            <div className="w-[1px] h-4 bg-gray-200 mx-3" />
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer ${isFilterOpen
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <SlidersHorizontal className="w-6 h-6" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-4 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="space-y-1">
                    <div className="relative group/name">
                      <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                        Service Name
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[200px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/name:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "Business Formation",
                          "Compliance",
                          "Banking",
                          "Tax Services",
                          "Virtual Office",
                          "Documentation"
                        ].map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              setSelectedServiceName(selectedServiceName === name ? null : name);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${selectedServiceName === name
                                ? "text-blue-600 bg-blue-50"
                                : "text-[#3E4246] hover:bg-gray-50"
                              }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative group/type">
                      <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                        Service Type
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* Service Type Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[200px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/type:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "One-time",
                          "Monthly",
                          "Yearly"
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedServiceType(selectedServiceType === type ? null : type);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${selectedServiceType === type
                                ? "text-blue-600 bg-blue-50"
                                : "text-[#3E4246] hover:bg-gray-50"
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                      Timezone
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </button>
                    <button className="w-full text-left px-6 py-3 text-[#3E4246] hover:bg-gray-50 transition-colors text-[17px] font-medium flex items-center justify-between group cursor-pointer">
                      Status
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-[#2B7FFF] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100/50 flex items-center gap-2 active:scale-[0.98]"
          >
            Add Service
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#F8F9FA]/50 border-b border-gray-300">
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider w-24">#</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Service Name</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Service Type</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Availability</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-10 py-4 2xl:py-5 text-[15px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {currentServices.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-3 2xl:py-5 text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                    {((currentPage - 1) * ITEMS_PER_PAGE + index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-10 py-3 2xl:py-5 text-[15px] font-bold text-[#3E4246] group-hover:text-[#2B7FFF] transition-colors">{service.name}</td>
                  <td className="px-10 py-3 2xl:py-5 text-[15px] font-medium text-gray-500">{service.type}</td>
                  <td className="px-10 py-3 2xl:py-5 text-[15px] font-medium text-gray-500">{service.price}</td>
                  <td 
                    title={
                      service.availability === "All States" || service.availability === "Online" || service.availability === "USA"
                        ? "Wyoming, Delaware, Nevada, Texas, Florida, California, New York, New Mexico, Washington"
                        : service.availability || "N/A"
                    }
                    className="px-10 py-3 2xl:py-5 text-[15px] font-medium text-gray-500 cursor-pointer"
                  >
                    {(() => {
                      if (!service.availability) return "N/A";
                      let statesArray: string[] = [];
                      if (service.availability === "All States" || service.availability === "Online" || service.availability === "USA") {
                        statesArray = ["Wyoming", "Delaware", "Nevada", "Texas", "Florida", "California", "New York", "New Mexico", "Washington"];
                      } else {
                        statesArray = service.availability.split(", ").map((s: string) => s.trim()).filter(Boolean);
                      }
                      if (statesArray.length > 3) {
                        return `${statesArray.slice(0, 3).join(", ")}...`;
                      }
                      return statesArray.join(", ");
                    })()}
                  </td>
                  <td className="px-10 py-3 2xl:py-5">
                    <span className={`text-[15px] font-bold ${service.status === 'Active' ? 'text-[#10B981]' : 'text-gray-400'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-10 py-3 2xl:py-5">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => setViewingService(service)}
                        className="text-gray-900 hover:text-[#2B7FFF] transition-colors active:scale-110"
                      >
                        <Eye className="w-[18px] h-[18px]" />
                      </button>
                      <button
                        onClick={() => openModal(service)}
                        className="text-gray-900 hover:text-[#2B7FFF] transition-colors active:scale-110"
                      >
                        <Pencil className="w-[18px] h-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-gray-900 hover:text-red-500 transition-colors active:scale-110"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-8 flex items-center justify-center border-t border-gray-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {[1, 2, '...', 9, 10].map((page, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${page === currentPage
                    ? "bg-white text-gray-900 border border-gray-100 shadow-sm"
                    : "text-gray-400 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Service Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-6xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-10 flex flex-col items-center justify-center ${
              !editingService 
                ? "bg-gradient-to-r from-blue-600 via-[#1D4ED8] to-indigo-600 text-white" 
                : "bg-white text-[#3E4246] border-b border-gray-50"
            }`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute left-10 top-10 p-2 rounded-xl transition-all active:scale-90 ${
                  !editingService ? "hover:bg-white/10 text-white" : "hover:bg-gray-50 text-gray-900"
                }`}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              {!editingService ? (
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                    ✨ CREATE MODE
                  </span>
                  <h3 className="text-4xl font-extrabold tracking-tight">Add New Service</h3>
                  <p className="text-blue-100/90 text-sm font-semibold font-outfit tracking-wide">Configure your new service offering below</p>
                </div>
              ) : (
                <h3 className="text-[32px] font-bold tracking-tight">{editingService ? "Edit Service" : "Add Service"}</h3>
              )}
            </div>

            <div className="p-12">
              <form className="space-y-8" onSubmit={handleSave}>
                {/* Row 1: Name, Pricing Type, Price in 3-column grid */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6 space-y-2">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <PackageOpen className={`w-4 h-4 ${!editingService ? "text-indigo-500" : "text-gray-400"}`} />
                      Service Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Service Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full border rounded-2xl py-4 px-6 text-[15px] font-semibold focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                        !editingService 
                          ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                          : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <Coins className={`w-4 h-4 ${!editingService ? "text-amber-500" : "text-gray-400"}`} />
                      Pricing Type
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className={`w-full border rounded-2xl py-4 px-6 text-[15px] font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                          !editingService 
                            ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                            : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                        }`}
                      >
                        <option value="">Select Pricing Type</option>
                        <option value="One-time">One-time</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Consultation">Consultation</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="col-span-3 space-y-2">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <DollarSign className={`w-4 h-4 ${!editingService ? "text-emerald-500" : "text-gray-400"}`} />
                      Price
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full border rounded-2xl py-4 px-6 text-[15px] font-semibold focus:ring-2 outline-none transition-all placeholder:text-gray-300 ${
                        !editingService 
                          ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                          : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                      }`}
                    />
                  </div>
                </div>

                {/* Row 2: Availability (States) and User Journey/Package in side-by-side columns */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: States Checkboxes */}
                  <div className="col-span-7 space-y-2">
                    <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                      <MapPin className={`w-4 h-4 ${!editingService ? "text-blue-500" : "text-gray-400"}`} />
                      Availability (Select States)
                    </label>
                    <div className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200/50">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.availability === "All States" || formData.availability === "Online" || formData.availability === "USA"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, availability: "All States" });
                              } else {
                                setFormData({ ...formData, availability: "" });
                              }
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-[15px] font-bold text-gray-900">All States</span>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          "Wyoming",
                          "Delaware",
                          "Nevada",
                          "Texas",
                          "Florida",
                          "California",
                          "New York",
                          "New Mexico",
                          "Washington"
                        ].map((state) => {
                          const isChecked = 
                            formData.availability === "All States" || 
                            formData.availability === "Online" ||
                            formData.availability === "USA" ||
                            formData.availability.split(", ").map(s => s.trim()).includes(state);
                          
                          return (
                            <label key={state} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  let currentAvailability = formData.availability;
                                  const US_STATES = [
                                    "Wyoming", "Delaware", "Nevada", "Texas", "Florida", "California", "New York", "New Mexico", "Washington"
                                  ];
                                  if (currentAvailability === "All States" || currentAvailability === "Online" || currentAvailability === "USA") {
                                    if (!checked) {
                                      const activeStates = US_STATES.filter(s => s !== state);
                                      setFormData({ ...formData, availability: activeStates.join(", ") });
                                    }
                                  } else {
                                    let activeStates = currentAvailability.split(", ").map(s => s.trim()).filter(Boolean);
                                    if (checked) {
                                      if (!activeStates.includes(state)) {
                                        activeStates.push(state);
                                      }
                                    } else {
                                      activeStates = activeStates.filter(s => s !== state);
                                    }
                                    if (activeStates.length === US_STATES.length) {
                                      setFormData({ ...formData, availability: "All States" });
                                    } else {
                                      setFormData({ ...formData, availability: activeStates.join(", ") });
                                    }
                                  }
                                }}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                {state}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: User Journey and Package/Section stacked */}
                  <div className="col-span-5 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                          <Compass className={`w-4 h-4 ${!editingService ? "text-violet-500" : "text-gray-400"}`} />
                          User journey type
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.businessFlow}
                            onChange={(e) => {
                              const flow = e.target.value;
                              if (flow === "Start your new business") {
                                setFormData({ ...formData, businessFlow: flow, planType: "", category: "Add-ons" });
                              } else {
                                setFormData({ ...formData, businessFlow: flow, category: "Post Business Setup & Scaling", planType: "N/A" });
                              }
                            }}
                            className={`w-full border rounded-2xl py-4.5 px-6 text-[15px] font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                              !editingService 
                                ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                                : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                            }`}
                          >
                            <option value="" disabled>Select User Journey Type</option>
                            <option value="Start your new business">Start your new business</option>
                            <option value="Manage your existing business">Manage your existing business</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {formData.businessFlow === "Start your new business" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                            <Activity className={`w-4 h-4 ${!editingService ? "text-teal-500" : "text-gray-400"}`} />
                            package / Section (Select Plans)
                          </label>
                          <div className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200/50">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.planType === "All Plans" ||
                                    formData.planType === "Starter, Premium, Global" ||
                                    (formData.planType.includes("Starter") && formData.planType.includes("Premium") && formData.planType.includes("Global"))
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({ ...formData, planType: "Starter, Premium, Global" });
                                    } else {
                                      setFormData({ ...formData, planType: "" });
                                    }
                                  }}
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-[15px] font-bold text-gray-900">All package</span>
                              </label>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3.5">
                              {[
                                { label: "Starter Plan", value: "Starter" },
                                { label: "Premium Plan", value: "Premium" },
                                { label: "Global Plan", value: "Global" }
                              ].map((plan) => {
                                const isChecked = 
                                  formData.planType === "All Plans" ||
                                  formData.planType.split(", ").map(p => p.trim()).includes(plan.value);
                                
                                return (
                                  <label key={plan.value} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        let currentPlanType = formData.planType;
                                        if (currentPlanType === "All Plans") {
                                          currentPlanType = "Starter, Premium, Global";
                                        }
                                        let activePlans = currentPlanType.split(", ").map(p => p.trim()).filter(Boolean);
                                        if (checked) {
                                          if (!activePlans.includes(plan.value)) {
                                            activePlans.push(plan.value);
                                          }
                                        } else {
                                          activePlans = activePlans.filter(p => p !== plan.value);
                                        }
                                        
                                        if (activePlans.includes("Starter") && activePlans.includes("Premium") && activePlans.includes("Global")) {
                                          setFormData({ ...formData, planType: "Starter, Premium, Global" });
                                        } else {
                                          setFormData({ ...formData, planType: activePlans.join(", ") });
                                        }
                                      }}
                                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                      {plan.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : formData.businessFlow === "Manage your existing business" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#3E4246] ml-1 flex items-center gap-1.5">
                            <Activity className={`w-4 h-4 ${!editingService ? "text-teal-500" : "text-gray-400"}`} />
                            package / Section (Select Category)
                          </label>
                          <div className="relative">
                            <select
                               required
                               value={formData.category}
                               onChange={(e) => setFormData({ ...formData, category: e.target.value, planType: "N/A" })}
                               className={`w-full border rounded-2xl py-4.5 px-6 text-[15px] font-semibold focus:ring-2 outline-none transition-all cursor-pointer appearance-none ${
                                 !editingService 
                                   ? "bg-slate-50 border-slate-200/70 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-indigo-100" 
                                   : "bg-[#F8F9FA] border-gray-100 text-gray-600 focus:ring-blue-100"
                               }`}
                            >
                               <option value="Post Business Setup & Scaling">Post Business Setup & Scaling</option>
                               <option value="Payments Solutions">Payments Solutions</option>
                               <option value="Compliances">Compliances</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-300 ml-1 flex items-center gap-1.5">
                            <Activity className={`w-4 h-4 ${!editingService ? "text-teal-500" : "text-gray-400"}`} />
                            package / Section
                          </label>
                          <div className="bg-[#F8F9FA] border border-dashed border-gray-200 rounded-3xl p-10 text-center text-sm font-medium text-gray-400 flex flex-col items-center justify-center min-h-[180px]">
                            Please select a user journey type first to view options.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button Row */}
                <div className="pt-4 flex justify-center border-t border-gray-50">
                  {!editingService ? (
                    <button
                      type="submit"
                      className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-150 active:scale-[0.98] text-[15px]"
                    >
                       Create Service
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full max-w-sm py-4 bg-[#2B7FFF] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] text-[15px]"
                    >
                      Update Service
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
        </div>
      )}

      {/* View Service Details Modal */}
      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-10 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-[28px] font-bold text-[#3E4246] tracking-tight">Service Details</h3>
              <button
                onClick={() => setViewingService(null)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-gray-900" />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Service Name & Status */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-[24px] font-extrabold text-[#3E4246] leading-tight">{viewingService.name}</h4>
                  <p className="text-sm font-medium text-gray-400 mt-1 font-mono">Service ID: {viewingService.id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                  viewingService.status === 'Active' 
                    ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  {viewingService.status}
                </span>
              </div>

              {/* Service Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Pricing Type</span>
                  <span className="text-[17px] font-bold text-gray-800">{viewingService.type}</span>
                </div>
                
                <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Price</span>
                  <span className="text-[17px] font-bold text-[#2B7FFF]">{viewingService.price}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">User Journey Type</span>
                  <span className="text-[16px] font-bold text-gray-800">{viewingService.businessFlow || "N/A"}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Package / Section</span>
                  <span className="text-[16px] font-bold text-gray-800">
                    {viewingService.businessFlow === "Start your new business" 
                      ? `${viewingService.planType || "All"} Plan` 
                      : viewingService.category || "N/A"
                    }
                  </span>
                </div>
              </div>

              {/* Availability (States) */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Available In States</span>
                <div className="flex flex-wrap gap-2.5 bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100/50">
                  {(() => {
                    if (!viewingService.availability) return <span className="text-sm font-semibold text-gray-400">None</span>;
                    let statesList: string[] = [];
                    if (viewingService.availability === "All States" || viewingService.availability === "Online" || viewingService.availability === "USA") {
                      statesList = ["Wyoming", "Delaware", "Nevada", "Texas", "Florida", "California", "New York", "New Mexico", "Washington"];
                    } else {
                      statesList = viewingService.availability.split(", ").map((s: string) => s.trim()).filter(Boolean);
                    }
                    return statesList.map((state) => (
                      <span
                        key={state}
                        className="px-3.5 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 border border-gray-200/50 shadow-sm"
                      >
                        {state}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              {/* Description */}
              {viewingService.description && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Description</span>
                  <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100/50 text-[15px] font-medium text-gray-600 leading-relaxed">
                    {viewingService.description}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 flex justify-center bg-gray-50/50">
              <button
                onClick={() => setViewingService(null)}
                className="w-full max-w-xs py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all active:scale-[0.98] text-[15px]"
              >
                Close Details
              </button>
            </div>

          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setViewingService(null)} />
        </div>
      )}
    </div>
  );
}
