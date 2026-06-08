"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function ConsultationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/admin/consultations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch details");
        const data = await res.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-400 font-bold">Loading details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-400">Consultation Not Found</h2>
        <Link href="/admin/consultations" className="text-blue-600 hover:underline font-bold">
          Go back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-150px)]  flex flex-col space-y-4 xl:space-y-4 animate-in fade-in duration-500  max-w-[1650px] 2xl:max-w-[1750px] mx-auto p-4 xl:p-6 overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6">
        {/* Back Button */}
        <Link 
          href="/admin/consultations"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-[18px] group"
        >
          <ChevronLeft className="w-6 h-6 text-[#1D2128] group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>

        {/* Header Section Card */}
        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3E4246]">Consultation Details</h1>
            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wider">Booking ID : #CONS-102{item.id}</p>
          </div>
          <span className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
            item.status === 'Completed' ? 'bg-green-50 text-[#10B981] border-green-100' : 
            item.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
            item.status === 'Rescheduled' ? 'bg-purple-50 text-purple-600 border-purple-100' :
            'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Scrollable Main Content Grid - Scrollbar hidden */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
            {/* User Information */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                User Information
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Name", value: item.userName },
                  { label: "Email", value: item.email },
                  { label: "Phone", value: item.phone },
                  { label: "Country", value: item.country },
                  { label: "Timezone", value: item.timezone },
                ].filter(row => row.value && row.value !== 'N/A' && row.value !== '').map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-gray-400">{row.label}</span>
                    <span className="text-[15px] font-bold text-[#3E4246]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-gray-50 mx-8" />

            {/* Selected Plan & Add-ons */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Selected Plan & Services
              </h2>
              <div className="space-y-4">
                {item.plan && item.plan !== 'N/A' && (
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-gray-400">Main Plan</span>
                    <span className="text-[15px] font-bold text-blue-600">{item.plan} ({item.price})</span>
                  </div>
                )}
                {item.entityType && item.entityType !== 'N/A' && (
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-gray-400">Entity Type</span>
                    <span className="text-[15px] font-bold text-[#3E4246]">{item.entityType}</span>
                  </div>
                )}
                {item.addons && item.addons.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Add-On Services</p>
                    <div className="space-y-3">
                      {item.addons.map((addon: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-[14px] font-medium text-gray-500">{addon.name}</span>
                          <span className="text-[14px] font-bold text-[#3E4246]">{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-gray-50 mx-8" />

            {/* Consultation Booking */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Consultation Booking
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Consultation Type", value: item.serviceType },
                  { label: "Date", value: item.date },
                  { label: "Time", value: item.time },
                  { label: "Timezone", value: item.timezone },
                ].filter(row => row.value && row.value !== 'N/A' && row.value !== '').map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-gray-400">{row.label}</span>
                    <span className="text-[15px] font-bold text-[#3E4246]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
            {/* Business Formation Details */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Business Details
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Business Name", value: item.businessName },
                  { label: "Category", value: item.category },
                  { label: "Members", value: item.members },
                  { label: "Principal Address", value: item.address },
                  { label: "Registered Agent", value: item.businessName && item.businessName !== 'N/A' ? "Included" : null },
                ].filter(row => row.value && row.value !== 'N/A' && row.value !== '').map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[15px] font-bold text-gray-400">{row.label}</span>
                    <span className="text-[15px] font-bold text-[#3E4246]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-gray-50 mx-8" />

            {/* Payment Summary */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Payment Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-gray-400">Consultation Fee</span>
                  <span className="text-[15px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs">
                    {item.consultationPrice || 'Paid'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-50 mx-8" />

            {/* Documents */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#3E4246] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Documents
              </h2>
              <div className="space-y-4">
                {item.documents && item.documents.length > 0 ? item.documents.map((doc: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100 ">
                    <span className="text-[15px] font-bold text-[#3E4246]">{doc.name}</span>
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                      doc.status === 'Uploaded' ? 'bg-green-50 text-[#10B981]' : 'bg-red-50 text-[#FF1F3D]'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 italic text-center py-4">No documents found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
