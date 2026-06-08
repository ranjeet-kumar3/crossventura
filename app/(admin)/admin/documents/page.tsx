"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  X,
  Maximize2,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";

// Removed INITIAL_DOCUMENTS mock data

const ITEMS_PER_PAGE = 6;

export default function DocumentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Passport");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<'approve' | 'reject' | 'reupload' | null>(null);

  const tabs = ["Passport", "Office Address Proof", "Driving License", "Utility Bill", "Aadhaar Card", "PAN Card", "EIN Letter (SS-4 Form)"];

  const tabImages: { [key: string]: string } = {
    "Passport": "/adminimg/passport.png",
    "Driving License": "/adminimg/passport.png", // Replace with real driving license image path
    "Aadhaar Card": "/adminimg/passport.png", // Replace with real aadhaar image path
    "PAN Card": "/adminimg/passport.png",
    "Utility Bill": "/adminimg/passport.png",
    "Office Address Proof": "/adminimg/passport.png",
    "EIN Letter (SS-4 Form)": "/adminimg/passport.png"
  };

  const activeUserDocs = useMemo(() => {
    if (!selectedDoc) return {};
    // Find all documents for the same user in our fetched list
    const userDocs = documents.filter(d => d.userName === selectedDoc.userName);
    const mapping: { [key: string]: string } = {};
    userDocs.forEach(d => {
      mapping[d.fileName] = d.url;
    });
    return mapping;
  }, [selectedDoc, documents]);

  const currentImageUrl = selectedDoc?.type === "Business"
    ? selectedDoc.url
    : (activeUserDocs[activeTab] ||
      (selectedDoc && activeTab === selectedDoc.fileName ? selectedDoc.url : null) ||
      (showDemo ? "/adminimg/passport.png" : null));

  React.useEffect(() => {
    setShowDemo(false);
  }, [selectedDoc, activeTab]);

  React.useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/documents?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
        const data = await res.json();
        if (!data.error) {
          setDocuments(data.documents || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDocuments();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  const handleDocumentAction = async (action: 'approve' | 'reject' | 'reupload') => {
    if (!selectedDoc) return;
    setLoadingAction(action);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDoc.id,
          action,
          reason: action === 'reject' ? rejectionReason : undefined
        })
      });

      const data = await res.json();
      if (!data.error) {
        // Refresh local state/table
        const updatedRes = await fetch(`/api/admin/documents?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
        const updatedData = await updatedRes.json();
        if (!updatedData.error) {
          setDocuments(updatedData.documents || []);
          setTotalPages(updatedData.totalPages || 1);
          setTotalItems(updatedData.totalItems || 0);

          // Update selected doc status
          const updatedDoc = updatedData.documents.find((d: any) => d.id === selectedDoc.id);
          if (updatedDoc) {
            setSelectedDoc(updatedDoc);
          } else {
            setIsPreviewOpen(false);
          }
        }
        setIsRejecting(false);
        setRejectionReason("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="h-full xl:h-auto xl:max-h-[650px] 2xl:max-h-[920px] flex flex-col space-y-3 2xl:space-y-6 animate-in fade-in duration-500  max-w-[1550px] 2xl:max-w-[1650px]">
      <div className="flex items-center justify-between flex-shrink-0 px-2">
        <h1 className="text-2xl 2xl:text-3xl font-bold text-[#3E4246] tracking-tight">Document Management</h1>
      </div>

      {/* Main Table Card */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        {/* Search & Filter */}
        <div className="p-3 xl:p-4 2xl:p-5 border-b border-gray-300 flex items-center justify-between flex-shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search documents"
              className="w-72 bg-gray-50 border text-black border-gray-300 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
          <button className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left  border-collapse min-w-[1100px]">
            <thead className="sticky top-0 z-10 bg-[#F8F9FA]/50 backdrop-blur-sm border-b border-gray-300">
              <tr>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider w-24">#</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider">User Name</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider">Document Type</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider">File Name</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider">Upload Date</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-10 2xl:px-12 py-6 2xl:py-7 text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 relative">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="h-[400px]">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500">Loading documents...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {documents.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-10 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No documents found</p>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && documents.map((doc, index) => (
                <tr key={doc.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 2xl:px-12 py-2 2xl:py-6 text-sm 2xl:text-base font-bold text-gray-400 group-hover:text-[#3E4246] transition-colors">
                    {((currentPage - 1) * ITEMS_PER_PAGE + index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-10 2xl:px-12 py-4 2xl:py-7 text-[15px] 2xl:text-[17px] font-bold text-[#3E4246] group-hover:text-[#2B7FFF] transition-colors">{doc.userName}</td>
                  <td className="px-10 2xl:px-12 py-4 2xl:py-7 text-[15px] 2xl:text-[17px] font-medium text-gray-500">{doc.type}</td>
                  <td className="px-10 2xl:px-12 py-4 2xl:py-7">
                    <div className="flex items-center gap-2 text-[15px] 2xl:text-[17px] font-medium text-gray-500">
                      <FileText className="w-5 h-5 text-gray-400" />
                      {doc.fileName}
                    </div>
                  </td>
                  <td className="px-10 2xl:px-12 py-2 2xl:py-4 text-[15px] 2xl:text-[17px] font-medium text-gray-500">{doc.date}</td>
                  <td className="px-10 2xl:px-12 py-2 2xl:py-4">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] 2xl:text-[14px] font-bold tracking-wide border ${doc.status === 'Completed' || doc.status === 'Verified'
                        ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                        : doc.status === 'Pending'
                          ? 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                          : doc.status === 'Rejected'
                            ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${doc.status === 'Completed' || doc.status === 'Verified'
                          ? 'bg-[#137333]'
                          : doc.status === 'Pending'
                            ? 'bg-[#B06000]'
                            : doc.status === 'Rejected'
                              ? 'bg-[#C5221F]'
                              : 'bg-gray-600'
                        }`} />
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-10 2xl:px-12 py-2 2xl:py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsPreviewOpen(true);
                        // Auto-select tab based on file name or type
                        const matchingTab = tabs.find(t => doc.fileName.toLowerCase().includes(t.replace(/\s/g, '').toLowerCase()));
                        if (matchingTab) setActiveTab(matchingTab);
                        else if (doc.type === "KYC") setActiveTab("Passport");
                      }}
                      className="text-gray-400 cursor-pointer hover:text-[#2B7FFF] transition-all active:scale-110"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 xl:p-3 2xl:p-6 flex items-center justify-center border-t border-gray-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${currentPage === i + 1
                      ? "bg-white text-gray-900 border border-gray-100 shadow-sm"
                      : "text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Review Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[#1D2128]/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsPreviewOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-[1000px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {/* Modal Header */}
            <div className="p-8 pb-4">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute left-8 top-10 p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-[#1D2128]">Document review panel</h2>

                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                  {selectedDoc?.type === "Business" ? (
                    <button className="px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all bg-[#2B7FFF] text-white shadow-lg shadow-blue-100">
                      {selectedDoc.fileName}
                    </button>
                  ) : (
                    tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${activeTab === tab
                            ? "bg-[#2B7FFF] text-white shadow-lg shadow-blue-100"
                            : "bg-[#F8F9FA] text-gray-400 hover:bg-gray-100"
                          }`}
                      >
                        {tab}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Document Viewer Area */}
            <div className="px-12 py-6">
              <div className="relative bg-[#F8F9FA] rounded-[24px] p-8 aspect-[16/9] flex items-center justify-center group">
                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                  <ChevronLeftIcon className="w-8 h-8" />
                </button>

                {/* Expand Icon */}
                <button className="absolute right-6 top-6 p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-gray-900 transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>

                {/* Document Image/PDF Viewer */}
                <div className="relative w-full h-full max-w-[550px] shadow-xl rounded-lg overflow-hidden border-4 border-white transition-all duration-500 bg-gray-100 flex items-center justify-center">
                  {currentImageUrl ? (
                    currentImageUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-2">
                        <iframe
                          src={currentImageUrl}
                          className="w-full h-full border-0 rounded-lg"
                          title={`${activeTab} PDF`}
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full font-medium flex items-center gap-2">
                          <span>PDF Document</span>
                          <a
                            href={currentImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-300 font-bold hover:text-blue-200 transition-colors"
                          >
                            Open full size
                          </a>
                        </div>
                      </div>
                    ) : (
                      <Image
                        key={activeTab} // Forces re-animation on tab change
                        src={currentImageUrl}
                        alt={`${activeTab} Preview`}
                        fill
                        className="object-cover animate-in fade-in zoom-in-95 duration-500"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                      <FileText className="w-16 h-16 text-gray-300 mb-3 animate-pulse" />
                      <p className="font-bold text-gray-600 text-[15px] mb-1">No Document Uploaded</p>
                      <p className="text-[13px] text-gray-400 max-w-[200px] leading-relaxed mb-3">
                        This user has not uploaded their {activeTab} yet.
                      </p>
                      <button
                        onClick={() => setShowDemo(true)}
                        className="bg-[#2B7FFF] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-100/50 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Sample Template</span>
                      </button>
                    </div>
                  )}
                </div>

                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleDocumentAction('approve')}
                  className="flex items-center justify-center gap-2 bg-[#00A76F] hover:bg-[#008F5E] text-white py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAction === 'approve' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <span>Approve</span>
                  )}
                </button>
                <button
                  disabled={loadingAction !== null}
                  onClick={() => {
                    if (isRejecting) {
                      if (!rejectionReason.trim()) {
                        alert("Please enter a rejection reason");
                        return;
                      }
                      handleDocumentAction('reject');
                    } else {
                      setIsRejecting(true);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isRejecting ? "bg-[#FF1F3D] text-white ring-4 ring-red-100 animate-pulse" : "bg-[#FF1F3D] hover:bg-[#D91A34] text-white"
                    }`}
                >
                  {loadingAction === 'reject' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Rejecting...</span>
                    </>
                  ) : isRejecting ? (
                    <span>Confirm Reject</span>
                  ) : (
                    <span>Reject</span>
                  )}
                </button>
                <button
                  disabled={loadingAction !== null}
                  onClick={() => handleDocumentAction('reupload')}
                  className="flex items-center justify-center gap-2 bg-[#2B7FFF] hover:bg-[#1A6AE6] text-white py-4 rounded-full font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAction === 'reupload' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <span>Request Re-Upload</span>
                  )}
                </button>
              </div>

              {/* Rejection Reason Input (Image matching design) */}
              {isRejecting && (
                <div className="mt-6 animate-in slide-in-from-top-4 fade-in duration-300">
                  <label className="text-[15px] font-bold text-[#3E4246] mb-3 block">Rejection Reason</label>
                  <div className="bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason here..."
                      className="w-full bg-[#F8F9FA]/30 text-black py-4 px-6 rounded-xl text-[15px] outline-none placeholder:text-gray-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Main Continue Button */}
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-full mt-6 bg-[#2B7FFF] hover:bg-[#1A6AE6] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
