'use client';

import React from 'react';
import { 
    FileText, 
    CheckCircle2, 
    AlertTriangle, 
    Clock, 
    UploadCloud, 
    Eye, 
    Download, 
    Loader2,
    ShieldCheck
} from 'lucide-react';

interface DocEntry {
    id: string;
    name: string;
    date: string;
    url: string;
}

export default function DocumentPage() {
    const [kycData, setKycData] = React.useState<any>(null);
    const [businessDocs, setBusinessDocs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [uploadingDocId, setUploadingDocId] = React.useState<string | null>(null);

    const fetchKycDocs = async () => {
        try {
            const response = await fetch('/api/onboarding/kyc');
            if (response.ok) {
                const data = await response.json();
                setKycData(data);
            }
        } catch (error) {
            console.error("Error fetching KYC documents:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        // 1. Load business documents from localStorage onboarding info if present
        const onboardingDataJson = localStorage.getItem('onboarding_business_info');
        let localBizDocs: any[] = [];
        if (onboardingDataJson) {
            try {
                const onboardingData = JSON.parse(onboardingDataJson);
                if (onboardingData.files && Array.isArray(onboardingData.files)) {
                    localBizDocs = onboardingData.files.map((file: any, index: number) => ({
                        id: `onboarding-${index}`,
                        name: file.name,
                        date: `Uploaded on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        url: file.content || "#"
                    }));
                }
            } catch (e) {
                console.error("Failed to parse onboarding business info", e);
            }
        }
        setBusinessDocs(localBizDocs);

        // 2. Fetch KYC documents & user country from database
        fetchKycDocs();
    }, []);

    // Determine required KYC docs based on user's country
    const kycDocsList = React.useMemo(() => {
        const country = (kycData?.country || "").toLowerCase();
        const isIndia = country === "india";

        const baseDocs = [
            { id: "passport", label: "Passport", dbKey: "passportUrl" },
            { id: "drivingLicense", label: "Driving License", dbKey: "drivingLicenseUrl" },
            { id: "addressProof", label: "Address Proof", dbKey: "addressProofUrl" },
            { id: "utilityBill", label: "Utility Bill", dbKey: "utilityBillUrl" },
            { id: "einLetter", label: "EIN Letter (SS-4 Form)", dbKey: "einLetterUrl" },
        ];

        if (isIndia) {
            return [
                ...baseDocs,
                { id: "aadhaarCard", label: "Aadhaar Card", dbKey: "aadhaarCardUrl" },
                { id: "panCard", label: "PAN Card", dbKey: "panCardUrl" },
            ];
        }

        return baseDocs;
    }, [kycData]);

    // Filter to show only rejected documents if there is at least one rejected document, otherwise show all
    const displayedKycDocs = React.useMemo(() => {
        const list = kycDocsList || [];
        const hasRejected = list.some(doc => {
            const statusKey = doc.dbKey.replace('Url', 'Status');
            return kycData?.[statusKey] === 'rejected';
        });

        if (hasRejected) {
            return list.filter(doc => {
                const statusKey = doc.dbKey.replace('Url', 'Status');
                return kycData?.[statusKey] === 'rejected';
            });
        }
        return list;
    }, [kycDocsList, kycData]);

    const handleFileUpload = async (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingDocId(docId);
        try {
            const formData = new FormData();
            formData.append(docId, file);

            const response = await fetch('/api/onboarding/kyc', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const updatedKyc = await response.json();
                // Refresh local state with updated database values
                setKycData((prev: any) => ({
                    ...prev,
                    ...updatedKyc,
                    status: 'pending' // Setting to pending as status resets on backend
                }));
            } else {
                const err = await response.json();
                alert(err.message || "Failed to upload document");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("An error occurred during upload.");
        } finally {
            setUploadingDocId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-24 px-4 font-sans selection:bg-blue-100">
            <div className="max-w-[1000px] mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4 text-[#0266FF]">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-[40px] md:text-[48px] font-extrabold text-[#1E293B] tracking-tight mb-2">
                        Document Center
                    </h1>
                    <p className="text-[#64748B] text-lg font-medium max-w-[600px] mx-auto">
                        Manage your business records and verify your identity securely in one centralized hub.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-12 h-12 text-[#0266FF] animate-spin" />
                        <p className="text-slate-500 font-bold text-sm tracking-wide">Loading documents...</p>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Business Records Section */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                            <div className="border-b border-slate-100 pb-6 mb-8">
                                <h2 className="text-[24px] font-extrabold text-[#1E293B] mb-1">
                                    Business Documents
                                </h2>
                                <p className="text-[#64748B] text-sm">
                                    Access and manage official registration certificates, plans, and files regarding your company formation.
                                </p>
                            </div>

                            {businessDocs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <FileText className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#1E293B] mb-1">No business records found</h4>
                                    <p className="text-[#64748B] text-sm max-w-[320px]">
                                        Your company formation files will appear here once the registration begins.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {businessDocs.map((doc) => (
                                        <div 
                                            key={doc.id}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-5 mb-4 md:mb-0">
                                                <div className="p-4 bg-blue-50/50 border border-blue-100 text-[#0266FF] rounded-xl flex-shrink-0">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-[#0266FF] transition-colors">
                                                        {doc.name}
                                                    </h3>
                                                    <p className="text-slate-400 text-xs font-semibold mt-1">
                                                        {doc.date}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => doc.url !== "#" && window.open(doc.url, '_blank')}
                                                    className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                                                >
                                                    <Eye className="w-4 h-4" /> View
                                                </button>
                                                <a
                                                    href={doc.url}
                                                    download={doc.name}
                                                    className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all text-center"
                                                >
                                                    <Download className="w-4 h-4" /> Download
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* KYC / Identity Verification Section */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8">
                                <div>
                                    <h2 className="text-[24px] font-extrabold text-[#1E293B] mb-1">
                                        Identity Verification (KYC)
                                    </h2>
                                    <p className="text-[#64748B] text-sm">
                                        Please ensure all required documents are verified to prevent any service interruptions.
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    {kycData?.status === 'verified' ? (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                            <CheckCircle2 className="w-4 h-4" /> Account Verified
                                        </span>
                                    ) : kycData?.status === 'rejected' ? (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider">
                                            <AlertTriangle className="w-4 h-4 animate-pulse" /> Action Required
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-[#0266FF] rounded-full text-xs font-bold uppercase tracking-wider">
                                            <Clock className="w-4 h-4" /> Under Review
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* KYC Documents Checklist */}
                            <div className="space-y-6">
                                {displayedKycDocs.map((doc) => {
                                    const fileUrl = kycData?.[doc.dbKey];
                                    const isUploaded = !!fileUrl;
                                    const isUploading = uploadingDocId === doc.id;

                                    // Map document db key to status field key
                                    const statusKey = doc.dbKey.replace('Url', 'Status');
                                    const docStatus = kycData?.[statusKey] || 'pending';

                                    return (
                                        <div 
                                            key={doc.id}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300"
                                        >
                                            {/* Document Name and Status Icon */}
                                            <div className="flex items-center gap-5 mb-4 md:mb-0">
                                                <div className={`p-4 rounded-xl flex-shrink-0 border transition-all ${
                                                    !isUploaded 
                                                        ? 'bg-rose-50/50 border-rose-100 text-rose-500' 
                                                        : docStatus === 'verified' 
                                                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-500'
                                                            : docStatus === 'rejected'
                                                                ? 'bg-rose-50/50 border-rose-100 text-rose-500'
                                                                : 'bg-blue-50/50 border-blue-100 text-[#0266FF]'
                                                }`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#1E293B] group-hover:text-blue-600 transition-colors">
                                                        {doc.label}
                                                    </h3>
                                                    <div className="flex items-center gap-2.5 mt-1">
                                                        {!isUploaded ? (
                                                            <span className="flex items-center gap-1 text-[13px] font-bold text-rose-500">
                                                                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Missing / Upload Required
                                                            </span>
                                                        ) : docStatus === 'verified' ? (
                                                            <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-600">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                                            </span>
                                                        ) : docStatus === 'rejected' ? (
                                                            <span className="flex items-center gap-1 text-[13px] font-bold text-rose-500">
                                                                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Rejected / Re-upload Required
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[13px] font-bold text-blue-600">
                                                                <Clock className="w-3.5 h-3.5" /> Under Review
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {isUploaded && (
                                                    <>
                                                        <button
                                                            onClick={() => window.open(fileUrl, '_blank')}
                                                            className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                                                        >
                                                            <Eye className="w-4 h-4" /> View
                                                        </button>
                                                        <a
                                                            href={fileUrl}
                                                            download={`${doc.label}.pdf`}
                                                            className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                                                        >
                                                            <Download className="w-4 h-4" /> Download
                                                        </a>
                                                    </>
                                                )}

                                                {(!isUploaded || docStatus === 'rejected') && (
                                                    <div className="relative">
                                                        <input 
                                                            type="file" 
                                                            id={`input-${doc.id}`}
                                                            disabled={isUploading}
                                                            onChange={(e) => handleFileUpload(doc.id, e)}
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                        <label 
                                                            htmlFor={`input-${doc.id}`}
                                                            className={`px-6 py-3 text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] ${
                                                                isUploading
                                                                    ? 'bg-blue-50 text-blue-400 cursor-not-allowed shadow-none'
                                                                    : docStatus === 'rejected'
                                                                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100 hover:shadow-lg'
                                                                        : 'bg-[#0266FF] hover:bg-blue-600 text-white shadow-blue-100 hover:shadow-lg'
                                                            }`}
                                                        >
                                                            {isUploading ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UploadCloud className="w-4 h-4" />
                                                                    {docStatus === 'rejected' ? 'Re-upload Document' : 'Upload Document'}
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
