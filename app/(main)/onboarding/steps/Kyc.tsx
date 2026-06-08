"use client";

import React, { useState } from "react";
import { ChevronLeft, Upload, FileText, Check, AlertCircle, Trash2, Loader2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "sonner";

interface KycProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    formData: Record<string, any>;
}

interface DocEntry {
    id: string;
    name: string;
    date: string;
    url: string; // blob URL or placeholder
}

const Kyc: React.FC<KycProps> = ({ onNext, onBack, formData }) => {
    const [uploadedDocs, setUploadedDocs] = React.useState<string[]>([]);
    const [uploadingDocs, setUploadingDocs] = React.useState<string[]>([]);
    const [docEntries, setDocEntries] = React.useState<DocEntry[]>([]);
    const [fileObjects, setFileObjects] = React.useState<Record<string, File>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [linkedInProfile, setLinkedInProfile] = React.useState("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const requiredDocs = React.useMemo(() => {
        const country = (formData.country || "").toLowerCase();
        const isIndia = country === "india";

        const baseDocs = [
            { id: "Passport", label: "Passport" },
            { id: "Driving License", label: "Driving License" },
            { id: "Utility Bill", label: "Utility Bill" },
            { id: "Office Address Proof", label: "Office Address Proof" },
        ];

        if (isIndia) {
            return [
                ...baseDocs,
                { id: "Aadhaar Card", label: "Aadhaar Card (Valid only for Indian citizens)" },
                { id: "PAN Card", label: "PAN Card (Valid only for Indian citizens)" },
            ];
        }

        return baseDocs;
    }, [formData.country]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            // Find next pending doc slot
            const nextDoc = requiredDocs.find(
                d => !uploadedDocs.includes(d.id) && !uploadingDocs.includes(d.id)
            );
            if (!nextDoc) return;

            const docId = nextDoc.id;
            setUploadingDocs(prev => [...prev, docId]);

            // Create a blob URL from the actual file for local preview/download
            const blobUrl = URL.createObjectURL(file);

            // Simulate a small upload delay then mark as done
            setTimeout(() => {
                setUploadingDocs(prev => prev.filter(id => id !== docId));
                setUploadedDocs(prev => [...prev, docId]);
                setFileObjects(prev => ({ ...prev, [docId]: file }));
                setDocEntries(prev => [
                    ...prev,
                    {
                        id: docId,
                        name: file.name,
                        date: `Uploaded on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        url: blobUrl,
                    },
                ]);
            }, 1500);
        });

        // Reset input so same file can be re-selected if needed
        e.target.value = "";
    };

    const steps = [
        "Your Details",
        "Select Plan",
        "Add Services",
        "Business Details",
        "Payment",
        "Confirmation",
        "KYC",
    ];

    const isFormValid = uploadedDocs.length === requiredDocs.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1296px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={6} />

                {/* Content */}
                <div className="flex flex-col items-center w-full max-w-[1218px] h-[716px] mx-auto overflow-y-auto pb-8 hide-scrollbar">
                    {/* Header */}
                    <div className="text-center w-[978px] h-[88px] mx-auto mb-10">
                        <h1 className="text-[32px] md:text-[40px] font-[700] text-[#2D3748] mb-2 tracking-tight">
                            Upload Your Documents
                        </h1>
                        <p className="text-[#4A5568] text-base md:text-[18px] font-[400] max-w-[800px] mx-auto">
                            Upload all required documents in one place — we&apos;ll organize them for you automatically
                        </p>
                    </div>

                    {/* Required Documents Section */}
                    <div className="w-full max-w-[1040px] mb-8">
                        <h2 className="text-[20px] font-[700] text-[#2D3748] mb-4">Required Documents</h2>
                        <div className="bg-[#F0F4F8] rounded-[24px] px-10 py-8 min-h-[160px] flex items-center">
                            <div className="grid grid-cols-2 w-full gap-x-12 gap-y-5">
                                {requiredDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-4">
                                        {uploadedDocs.includes(doc.id) ? (
                                            <div className="bg-[#00D15D] rounded-full w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-white stroke-[3.5px]" />
                                            </div>
                                        ) : uploadingDocs.includes(doc.id) ? (
                                            <div className="flex-shrink-0">
                                                <Loader2 className="w-[20px] h-[20px] text-blue-500 animate-spin" />
                                            </div>
                                        ) : (
                                            <div className="bg-[#4A5568] rounded-full w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                                                <AlertCircle className="w-4 h-4 text-white fill-[#4A5568] stroke-[2.5px]" />
                                            </div>
                                        )}
                                        <span className={`text-[16px] font-medium transition-colors ${uploadedDocs.includes(doc.id) ? "text-[#4A5568]" : "text-[#718096]"}`}>
                                            {doc.label} <span className="text-red-500 ml-0.5">*</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                    />
                    <div
                        onClick={handleUploadClick}
                        className="w-full max-w-[1040px] border-2 border-dashed border-[#CBD5E0] rounded-[24px] py-10 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer mb-8 group"
                    >
                        <div className="p-4 rounded-full mb-2 group-hover:-translate-y-1 transition-transform">
                            <Upload className="w-10 h-10 text-[#4A5568]" />
                        </div>
                        <p className="text-[17px] text-[#4A5568] font-medium text-center">
                            Drag & drop files here or <span className="font-bold">click to upload</span> <span className="text-[#A0AEC0] font-normal ml-1">Upload multiple files at once (PDF, JPG, PNG)</span>
                        </p>
                    </div>

                    {/* Uploaded Files List */}
                    <div className="w-full max-w-[1040px] space-y-4 mb-10">
                        {/* Dynamic Uploaded Files List */}
                        {uploadedDocs.map((doc) => (
                            <div key={doc} className="border border-[#E2E8F0] rounded-[24px] p-6 flex items-center gap-5 bg-white shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex-shrink-0">
                                    <FileText className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-[700] text-[#2D3748] text-[17px]">{doc}.pdf</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[#718096] text-[14px] font-medium">Verified Document</span>
                                        <span className="text-[#CBD5E0] text-[14px]">|</span>
                                        <div className="flex items-center gap-1.5 text-[#48B02C]">
                                            <div className="bg-[#48B02C] rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[4px]" /></div>
                                            <span className="text-[14px] font-bold tracking-tight">Completed</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUploadedDocs(prev => prev.filter(d => d !== doc));
                                        setDocEntries(prev => prev.filter(d => d.id !== doc));
                                        setFileObjects(prev => {
                                            const updated = { ...prev };
                                            delete updated[doc];
                                            return updated;
                                        });
                                    }}
                                    className="p-3 hover:bg-red-50 rounded-xl transition-colors text-slate-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}

                        {/* Uploading Files List */}
                        {uploadingDocs.map((doc) => (
                            <div key={doc} className="border border-[#E2E8F0] rounded-[24px] p-6 flex items-center gap-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex-shrink-0">
                                    <FileText className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-[700] text-[#2D3748] text-[17px]">{doc}.pdf</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[#718096] text-[14px] font-medium">Processing...</span>
                                        <span className="text-[#CBD5E0] text-[14px]">|</span>
                                        <div className="flex items-center gap-2 text-[#718096]">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-[14px] font-semibold">Uploading...</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-3 hover:bg-red-50 rounded-xl transition-colors text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* LinkedIn Profile */}
                    <div className="w-full max-w-[1040px] mb-12">
                        <label className="block text-[19px] font-[700] text-[#2D3748] mb-4">LinkedIn Profile <span className="text-slate-400 font-normal text-[16px] ml-1">(Optional)</span></label>
                        <input
                            type="text"
                            placeholder="Enter your LinkedIn profile URL"
                            value={linkedInProfile}
                            onChange={(e) => setLinkedInProfile(e.target.value)}
                            className="w-full px-6 py-5 bg-[#F8FAFC] rounded-[20px] border-2 border-transparent focus:border-[#193D6620] focus:bg-white transition-all outline-none text-slate-800 text-[16px] shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* Action Button */}
                    <div className="w-full max-w-[480px]">
                        <button
                            onClick={async () => {
                                if (!isFormValid || isSubmitting) return;

                                setIsSubmitting(true);
                                try {
                                    const formDataPayload = new FormData();
                                    formDataPayload.append("linkedInProfile", linkedInProfile);

                                    // Map document IDs to backend field names
                                    const fieldMap: Record<string, string> = {
                                        "Passport": "passport",
                                        "PAN Card": "panCard",
                                        "Driving License": "drivingLicense",
                                        "Office Address Proof": "addressProof",
                                        "Aadhaar Card": "aadhaarCard",
                                        "Utility Bill": "utilityBill"
                                    };

                                    // Append all selected files to formData
                                    Object.entries(fileObjects).forEach(([docId, file]) => {
                                        const fieldName = fieldMap[docId];
                                        if (fieldName) {
                                            formDataPayload.append(fieldName, file);
                                        }
                                    });

                                    const response = await fetch('/api/onboarding/kyc', {
                                        method: 'POST',
                                        body: formDataPayload
                                        // Fetch will automatically set correct boundary and multipart/form-data header
                                    });

                                    if (!response.ok) {
                                        const errData = await response.json();
                                        throw new Error(errData.message || "Failed to upload KYC documents");
                                    }

                                    const kycResult = await response.json();

                                    // Save doc entries to localStorage so Document page can read them
                                    const email = localStorage.getItem('user_email') || 'guest';
                                    const existing = JSON.parse(localStorage.getItem(`user_documents_${email}`) || '[]');
                                    const merged = [
                                        ...existing.filter((d: DocEntry) => !docEntries.find(e => e.id === d.id)),
                                        ...docEntries,
                                    ];
                                    localStorage.setItem(`user_documents_${email}`, JSON.stringify(merged));

                                    // Complete and proceed
                                    onNext({ linkedInProfile, uploadedDocs, docUrls: kycResult });
                                } catch (error: any) {
                                    console.error("KYC upload error:", error);
                                    toast.error(error.message || "Failed to upload documents. Please try again.");
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                            disabled={!isFormValid || isSubmitting}
                            className={`w-full py-5 px-10 rounded-full font-[700] text-[20px] transition-all transform active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 ${
                                isFormValid && !isSubmitting
                                ? "bg-[#0266FF] text-white hover:bg-[#3B87FA] shadow-[#193D66]/20 cursor-pointer" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    Uploading Documents...
                                </>
                            ) : (
                                "Complete Verification"
                            )}
                        </button>
                        {!isFormValid && (
                            <p className="text-center text-slate-400 text-[14px] mt-4 flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Please upload all required documents to proceed.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kyc;
