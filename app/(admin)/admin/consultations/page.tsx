"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Pencil,
  X,
  Loader2
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function ConsultationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<any>(null);
  
  // New states for rescheduling
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchTerm,
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedServiceType && { serviceType: selectedServiceType }),
        ...(selectedState && { state: selectedState }),
        ...(selectedTimezone && { timezone: selectedTimezone }),
      });
      const res = await fetch(`/api/admin/consultations?${params.toString()}`);
      const data = await res.json();
      setConsultations(data.consultations || []);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConsultations();
  }, [currentPage, searchTerm, selectedStatus, selectedServiceType, selectedState, selectedTimezone]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditModal = (item: any) => {
    setEditingConsultation(item);
    
    // Attempt to parse date to YYYY-MM-DD for the date picker
    // If it's already in a readable format, we might need a utility or just keep it as is if it fails
    let formattedDate = item.date;
    try {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split('T')[0];
      }
    } catch (e) {}

    setRescheduleDate(formattedDate);
    setRescheduleTime(item.time);
    setIsEditModalOpen(true);
  };

  const handleAction = async (actionType: 'reschedule' | 'cancel' | 'update') => {
    if (!editingConsultation || isSubmitting) return;

    setIsSubmitting(true);

    let updates: any = { id: editingConsultation.id };

    if (actionType === 'cancel') {
      updates.status = 'Cancelled';
    } else if (actionType === 'reschedule') {
      updates.date = rescheduleDate;
      updates.time = rescheduleTime;
      updates.status = 'Rescheduled';
    }

    try {
      const res = await fetch('/api/admin/consultations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchConsultations();
      }
    } catch (error) {
      console.error(`Error during ${actionType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-4 animate-in fade-in duration-500 max-w-[1450px] 2xl:max-w-[1650px] mx-auto p-2 xl:p-0 overflow-hidden">
      {/* Header Section */}
      <div className="bg-white px-8 mt-3 h-26 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#3E4246] tracking-tight">Consultation Management</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-400 font-medium">View & manage all registered users</p>
            {selectedServiceType && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedServiceType}
                <button 
                  onClick={() => setSelectedServiceType(null)}
                  className="hover:text-blue-800 transition-colors"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {selectedState && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedState}
                <button 
                  onClick={() => setSelectedState(null)}
                  className="hover:text-green-800 transition-colors"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedStatus}
                <button 
                  onClick={() => setSelectedStatus(null)}
                  className="hover:text-purple-800 transition-colors"
                >
                  <X className="w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {selectedTimezone && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[12px] font-bold animate-in fade-in zoom-in">
                {selectedTimezone}
                <button 
                  onClick={() => setSelectedTimezone(null)}
                  className="hover:text-orange-800 transition-colors"
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
              placeholder="Search user"
              className="bg-transparent border-none text-sm font-medium text-gray-600 outline-none w-48 md:w-64 placeholder:text-gray-300"
            />
            <div className="w-[1px] h-4 bg-gray-200 mx-3" />
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`transition-colors ${isFilterOpen ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <SlidersHorizontal className="w-6 h-6" />
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-6 w-48 bg-[#F8F9FA] border border-gray-100 rounded-2xl shadow-xl z-20 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative group/type">
                      <button className="w-full px-6 py-3 text-left text-[16px] font-bold text-[#3E4246] hover:bg-white hover:text-[#2B7FFF] transition-all flex items-center justify-between group cursor-pointer">
                        Service Type
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* Service Type Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/type:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "LLC Formation",
                          "Banking Setup",
                          "Compliance Service",
                          "Tax Consultation",
                          "EIN Registration"
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedServiceType(selectedServiceType === type ? null : type);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${
                              selectedServiceType === type 
                              ? "text-blue-600 bg-blue-50" 
                              : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative group/state">
                      <button className="w-full px-6 py-3 text-left text-[16px] font-bold text-[#3E4246] hover:bg-white hover:text-[#2B7FFF] transition-all flex items-center justify-between group cursor-pointer">
                        State
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* State Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/state:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "Wyoming",
                          "Texas",
                          "Florida",
                          "Delaware"
                        ].map((state) => (
                          <button
                            key={state}
                            onClick={() => {
                              setSelectedState(selectedState === state ? null : state);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${
                              selectedState === state 
                              ? "text-blue-600 bg-blue-50" 
                              : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                          >
                            {state}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative group/timezone">
                      <button className="w-full px-6 py-3 text-left text-[16px] font-bold text-[#3E4246] hover:bg-white hover:text-[#2B7FFF] transition-all flex items-center justify-between group cursor-pointer">
                        Timezone
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* Timezone Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/timezone:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "IST",
                          "EST",
                          "PST",
                          "GMT"
                        ].map((tz) => (
                          <button
                            key={tz}
                            onClick={() => {
                              setSelectedTimezone(selectedTimezone === tz ? null : tz);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${
                              selectedTimezone === tz 
                              ? "text-blue-600 bg-blue-50" 
                              : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                          >
                            {tz}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative group/status">
                      <button className="w-full px-6 py-3 text-left text-[16px] font-bold text-[#3E4246] hover:bg-white hover:text-[#2B7FFF] transition-all flex items-center justify-between group cursor-pointer">
                        Status
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                      </button>

                      {/* Status Sub-menu on Hover */}
                      <div className="absolute right-full top-[-12px] mr-1 w-[220px] bg-white rounded-[20px] shadow-xl border border-gray-100 py-3 hidden group-hover/status:block animate-in fade-in slide-in-from-right-2 duration-200">
                        {[
                          "Scheduled",
                          "Pending",
                          "Completed",
                          "Cancelled",
                          "Rescheduled"
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatus(selectedStatus === status ? null : status);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-2.5 transition-colors text-[15px] font-medium cursor-pointer ${
                              selectedStatus === status 
                              ? "text-blue-600 bg-blue-50" 
                              : "text-[#3E4246] hover:bg-gray-50"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-[#F8F9FA]/50 border-b border-gray-300">
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider w-20">#</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">User Name</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Service Type</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Timezone</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">State</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 2xl:px-8 py-3 2xl:py-5 text-[13px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      <p className="text-gray-400 font-bold">Loading consultations...</p>
                    </div>
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <p className="text-gray-400 font-bold text-lg">No consultations found</p>
                  </td>
                </tr>
              ) : (
                consultations.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">{item.displayId}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-bold text-[#3E4246] group-hover:text-[#2B7FFF] transition-colors">{item.userName}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-medium text-gray-500">{item.serviceType}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-medium text-gray-500">{item.date}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-medium text-gray-500">{item.time}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-medium text-gray-500">{item.timezone}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6 text-[14px] 2xl:text-[16px] font-medium text-gray-500">{item.state}</td>
                    <td className="px-4 2xl:px-8 py-3 2xl:py-6">
                      <span className={`text-[12px] 2xl:text-[14px] font-extrabold px-2.5 2xl:px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        item.status === 'Completed' ? 'bg-green-50 text-[#10B981] border border-green-100' : 
                        item.status === 'Pending' ? 'bg-orange-50 text-[#F59E0B] border border-orange-100' :
                        item.status === 'Cancelled' ? 'bg-red-50 text-[#EF4444] border border-red-100' :
                        item.status === 'Scheduled' ? 'bg-blue-50 text-[#3B82F6] border border-blue-100' :
                        item.status === 'Rescheduled' ? 'bg-purple-50 text-[#8B5CF6] border border-purple-100' :
                        item.status === 'booked' ? 'bg-indigo-50 text-[#6366F1] border border-indigo-100' :
                        'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 2xl:py-6">
                      <div className="flex items-center justify-center gap-5">
                        <Link 
                          href={`/admin/consultations/${item.id}`}
                          className="text-gray-900 hover:text-[#2B7FFF] transition-colors active:scale-110"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                        </Link>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-gray-900 hover:text-[#2B7FFF] transition-colors active:scale-110"
                        >
                          <Pencil className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${
                      pageNum === currentPage 
                        ? "bg-white text-gray-900 border border-gray-100 shadow-sm" 
                        : "text-gray-400 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
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

      {/* Edit Consultation Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-10 pb-4 flex flex-col items-center">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute left-10 top-10 p-2 hover:bg-gray-50 rounded-xl transition-all active:scale-90"
              >
                <ChevronLeft className="w-8 h-8 text-gray-900" />
              </button>
              <h3 className="text-[32px] font-bold text-[#3E4246] tracking-tight">Edit Consultation</h3>
              <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wider">Booking ID : #CONS-102{editingConsultation?.id}</p>
            </div>
            
            <div className="px-20 pb-16 pt-8">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-bold text-[#3E4246] mb-6">Consultation Booking</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-bold text-gray-500">Consultation Type</span>
                      <span className="text-[17px] font-bold text-[#3E4246]">{editingConsultation?.serviceType}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-bold text-gray-500">Date</span>
                      <input 
                        type="date" 
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="text-[17px] font-bold text-[#3E4246] text-right bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-bold text-gray-500">Time</span>
                      <input 
                        type="time" 
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="text-[17px] font-bold text-[#3E4246] text-right bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-bold text-gray-500">Timezone</span>
                      <span className="text-[17px] font-bold text-[#3E4246]">{editingConsultation?.timezone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-bold text-gray-500">Consultation Fee</span>
                      <span className="text-[17px] font-bold text-[#3E4246]">$49</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-12">
                  <button 
                    onClick={() => handleAction('reschedule')}
                    disabled={isSubmitting}
                    className="py-4.5 bg-[#00A781] text-white rounded-full font-bold hover:bg-[#008F6F] transition-all shadow-lg shadow-emerald-100 active:scale-[0.98] text-[15px] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reschedule"}
                  </button>
                  <button 
                    onClick={() => handleAction('cancel')}
                    disabled={isSubmitting}
                    className="py-4.5 bg-[#FF1F3D] text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-[0.98] text-[15px] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cancel Booking"}
                  </button>
                </div>

                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full py-4.5 bg-[#2B7FFF] text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] text-[15px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsEditModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
