"use client";

import React, { useState, useEffect } from "react";
import { Info, Circle, ChevronLeft, Upload, Trash2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";

interface StarterPlanProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
}

const StarterPlan: React.FC<StarterPlanProps> = ({ onNext, onBack }) => {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [einStep, setEinStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dbServices, setDbServices] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch('/api/packages');
                if (res.ok) {
                    const data = await res.json();
                    setDbServices(data);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };
        fetchPackages();
    }, []);

    const getServiceData = (id: string, defaultTitle: string, defaultPrice: string, defaultDesc: string) => {
        const pkg = dbServices.find(p => p.name.toLowerCase().includes(defaultTitle.toLowerCase()));
        return {
            price: pkg?.price || defaultPrice,
            title: pkg?.name || defaultTitle,
            description: pkg?.category || defaultDesc // Using category field for description in this context
        };
    };

    React.useEffect(() => {
        const email = localStorage.getItem('user_email') || 'guest';
        const existingDocsJson = localStorage.getItem(`user_documents_${email}`);
        if (existingDocsJson) {
            const docs = JSON.parse(existingDocsJson);
            if (docs.length > 0) {
                setEinStep(4);
                // We show the last uploaded file in the "File Status Card" for the UI feedback
                setUploadedFile({ name: docs[docs.length - 1].name, size: 0 } as any);
            }
        }
    }, []);

    const handleFileUpload = async (file: File) => {
        if (file && file.type === "application/pdf") {
            try {
                const email = localStorage.getItem('user_email') || 'guest';
                const existingDocsJson = localStorage.getItem(`user_documents_${email}`);
                const existingDocs = existingDocsJson ? JSON.parse(existingDocsJson) : [];

                const newDoc = {
                    id: Date.now().toString(),
                    name: file.name,
                    url: "",
                    date: `Uploaded on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`
                };

                const formData = new FormData();
                formData.append("einLetter", file);

                const response = await fetch('/api/onboarding/kyc', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const resData = await response.json();
                    newDoc.url = resData.einLetterUrl || "";

                    const updatedDocs = [...existingDocs, newDoc];
                    localStorage.setItem(`user_documents_${email}`, JSON.stringify(updatedDocs));

                    setUploadedFile(file);
                    setEinStep(4);
                    toast.success("EIN Letter signed and uploaded successfully!");
                } else {
                    const err = await response.json();
                    toast.error(err.message || "Failed to upload file to server.");
                }
            } catch (e) {
                console.error("EIN upload error:", e);
                toast.error("An error occurred during file upload.");
            }
        } else {
            toast.error("Please upload a PDF file.");
        }
    };

    const handleContinue = async () => {
        // Production-level validation: If EIN Letter is selected, it MUST be uploaded
        if (selectedServices.includes("ein-letter") && einStep < 4) {
            toast.error("Please complete all steps for the EIN Letter (Download, Sign, and Upload the SS-4 form) before continuing.", {
                style: { borderRadius: '16px', padding: '16px' }
            });
            return;
        }

        setIsLoading(true);
        try {
            await onNext({ addOnServices: selectedServices });
        } catch (error) {
            toast.error("Failed to save selection. Please try again.");
        } finally {
            setIsLoading(false);
        }
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

    const services = [
        {
            id: "ein-letter",
            ...getServiceData("ein-letter", "EIN Letter", "$80", "( for the application SS4 form will be required, and it will be emailed to the registered email ID after company formation)"),
            billing: "One-time fee",
        },
        {
            id: "virtual-mailbox",
            ...getServiceData("virtual-mailbox", "Virtual Mailbox", "$25", "Yearly Renewal"),
            billing: "Per month",
        },
        {
            id: "virtual-bank",
            ...getServiceData("virtual-bank", "Virtual Bank Account Setup", "$100", "One-time fee; assistance only — approval at partner's discretion"),
            billing: "One-time fee",
        },
        {
            id: "boir-filing",
            ...getServiceData("boir-filing", "BOIR Filing (if required)", "$200", "One-time fee; filed when required by law"),
            billing: "One-time fee",
        },
        {
            id: "operating-agreement",
            ...getServiceData("operating-agreement", "Operating Agreement for LLC", "$150", "One-time fee; custom operating agreement"),
            billing: "One-time fee",
        },
        {
            id: "bookkeeping",
            ...getServiceData("bookkeeping", "Bookkeeping & Accounting", "$200", "Monthly bookkeeping services"),
            billing: "Per month",
        },
        {
            id: "physical-address",
            title: "Physical office address for verifications (suggestion while selecting the virtual bank setup as per the new policies of these platforms)",
            description: "Per month basis",
            price: "$200",
            billing: "Per month",
        },
    ];

    const toggleService = (id: string) => {
        setSelectedServices((prev: string[]) =>
            prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex  items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container (Modal) */}
            <div className="w-full  max-w-[1256px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>
                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={2} />

                <div className="w-full max-w-[900px] mx-auto py-4 ">
                    <h2 className="text-[32px] font-[700] text-[#1A202C] text-center mb-10">Add-On Services</h2>
                    {/* container */}
                    <div className="space-y-4 max-h-[596px] overflow-y-auto pr-2 hide-scrollbar">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="relative rounded-[16px] p-6 bg-[#193D66]/4 transition-all duration-300"
                            >
                                {/* Selection Circle */}
                                <div
                                    onClick={() => toggleService(service.id)}
                                    className="absolute top-6 right-6 cursor-pointer z-10"
                                >
                                    {selectedServices.includes(service.id) ? (
                                        <div className="w-6 h-6  rounded-full bg-[#193D66] flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white stroke-[3]" />
                                        </div>
                                    ) : (
                                        <Circle className="w-6 h-6 text-slate-300" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pr-12  ">
                                    <h3 className="text-[18px] font-[600] text-slate-800 mb-1">{service.title}</h3>
                                    <p className="text-[16px] text-slate-400 font-medium leading-relaxed mb-3 max-w-[650px]">
                                        {service.description}
                                    </p>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-[24px] font-[800] text-[#193D66]">{service.price}</span>
                                        <span className="text-[14px] text-slate-400 font-medium">{service.billing}</span>
                                    </div>

                                    {/* EIN Letter Specific Workflow with Smooth Height Animation */}
                                    {service.id === "ein-letter" && (
                                        <div className={`grid transition-all duration-700 ease-in-out ${selectedServices.includes(service.id) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
                                            <div className="overflow-hidden">
                                                <div className="mt-0 bg-[#FFFFFF] rounded-[20px] p-8 space-y-2 w-full max-w-[858px] mx-auto">
                                                    {/* Step 1 */}
                                                    <div className="flex gap-6 relative w-[758px] h-[81px] items-center">
                                                        <div className={`absolute left-[20px] top-[40px] bottom-[-40px] w-[1px] ${einStep > 1 ? "bg-green-500" : "bg-slate-200"}`} />
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm z-10 shrink-0 transition-colors duration-300 ${einStep > 1 ? "bg-green-500 text-white" : "bg-white text-slate-400"
                                                            }`}>
                                                            {einStep > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : "1"}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className={`text-[18px] font-bold transition-colors ${einStep >= 1 ? "text-slate-800" : "text-slate-400"}`}>Download SS-4 Form</h4>
                                                            <a
                                                                href="/fss4.pdf"
                                                                download="ss-4-form.pdf"
                                                                onClick={() => setEinStep(Math.max(einStep, 3))}
                                                                className={`px-28 py-3 rounded-full font-bold transition-all inline-block text-center ${einStep > 1
                                                                    ? "bg-green-50 text-green-600 border border-green-200"
                                                                    : "bg-[#193D66] text-white hover:bg-[#132d4a]"
                                                                    }`}
                                                            >
                                                                {einStep > 1 ? "Downloaded" : "Download PDF"}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Step 2 */}
                                                    <div className="flex gap-6 relative w-[758px] h-[81px] items-center">
                                                        <div className={`absolute left-[20px] top-[40px] bottom-[-40px] w-[1px] ${einStep > 2 ? "bg-green-500" : "bg-slate-200"}`} />
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm z-10 shrink-0 transition-all duration-300 ${einStep > 2 ? "bg-green-500 text-white" : einStep === 2 ? "bg-[#193D66] text-white scale-110" : "bg-white text-slate-400"
                                                            }`}>
                                                            {einStep > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : "2"}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className={`text-[18px] font-bold transition-colors ${einStep >= 2 ? "text-slate-800" : "text-slate-400"}`}>Sign the Form</h4>
                                                            <p className="text-slate-400 text-[14px]">Fill out the required information and sign the downloaded document.</p>
                                                        </div>
                                                    </div>
                                                    {/* Step 3 */}
                                                    <div className="flex gap-6 ">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 transition-all duration-300 ${einStep > 3 ? "bg-green-500 text-white" : einStep === 3 ? "bg-[#193D66] text-white scale-110" : "bg-white text-slate-400"
                                                            }`}>
                                                            {einStep > 3 ? <Check className="w-5 h-5 stroke-[3]" /> : "3"}
                                                        </div>
                                                        <div className="space-y-4 flex-1">
                                                            <div className="space-y-1">
                                                                <h4 className={`text-[18px] font-bold transition-colors ${einStep >= 3 ? "text-slate-800" : "text-slate-400"}`}>Upload Signed Form</h4>
                                                                <p className="text-slate-400 text-[14px]">Fill out the required information and sign the downloaded document.</p>
                                                            </div>

                                                            {/* Upload Area / Uploaded Button */}
                                                            {einStep > 3 ? (
                                                                <div className="flex flex-col gap-4">
                                                                    <button
                                                                        onClick={() => {
                                                                            // Allow re-upload by resetting to step 3
                                                                            setUploadedFile(null);
                                                                            setEinStep(3);
                                                                        }}
                                                                        className="px-28 py-3 bg-green-50 text-green-600 border border-green-200 rounded-full font-bold transition-all text-center"
                                                                    >
                                                                        Uploaded
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                                    onDragLeave={() => setIsDragging(false)}
                                                                    onDrop={(e) => {
                                                                        e.preventDefault();
                                                                        setIsDragging(false);
                                                                        const file = e.dataTransfer.files[0];
                                                                        handleFileUpload(file);
                                                                    }}
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = 'application/pdf';
                                                                        input.onchange = (e: any) => {
                                                                            const file = e.target.files[0];
                                                                            handleFileUpload(file);
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className={`w-full h-40 border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-500 group relative overflow-hidden ${einStep < 3 ? "opacity-50 pointer-events-none" : ""
                                                                        } ${isDragging
                                                                            ? "border-[#193D66] bg-blue-50/50 scale-[1.02] shadow-inner"
                                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                                        }`}
                                                                >
                                                                    <div className={`transition-transform duration-500 transform ${isDragging ? "scale-125 -translate-y-1" : "group-hover:-translate-y-1"}`}>
                                                                        <Upload className={`w-8 h-8 transition-colors duration-500 ${isDragging ? "text-[#193D66]" : "text-slate-300 group-hover:text-slate-400"}`} />
                                                                    </div>
                                                                    <span className={`font-bold transition-colors duration-500 ${isDragging ? "text-[#193D66]" : "text-slate-700"}`}>
                                                                        {isDragging ? "Drop the file here" : "Drag & drop here or click to upload"}
                                                                    </span>

                                                                    {isDragging && (
                                                                        <div className="absolute inset-0 border-4 border-[#193D66]/20 rounded-[16px] animate-ping pointer-events-none" />
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* File Status Card */}
                                                            {uploadedFile && (
                                                                <div className="flex items-center justify-between p-4 bg-white rounded-[16px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                                                            <div className="text-red-500 font-bold text-[10px] border-2 border-red-500 rounded p-0.5">PDF</div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <h5 className="text-[14px] font-bold text-slate-800">{uploadedFile.name}</h5>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[12px] text-slate-400 font-medium">
                                                                                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB / {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                                                </span>
                                                                                <div className="flex items-center gap-1 text-[12px] text-green-500 font-bold">
                                                                                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                                                                        <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                                                                                    </div>
                                                                                    Completed
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const email = localStorage.getItem('user_email') || 'guest';
                                                                            localStorage.removeItem(`ein_letter_pdf_${email}`);
                                                                            localStorage.removeItem(`ein_letter_name_${email}`);
                                                                            setUploadedFile(null);
                                                                            setEinStep(3);
                                                                        }}
                                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info Icon */}
                                {(service.id === "ein-letter" || service.id === "virtual-bank") && (
                                    <div
                                        className={`absolute right-6  cursor-pointer ${service.id === "ein-letter" && selectedServices.includes(service.id)
                                            ? "bottom-6"
                                            : "top-[120px]"
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (selectedServices.includes(service.id)) {
                                                toggleService(service.id);
                                            }
                                            setActiveInfoId(activeInfoId === service.id ? null : service.id);
                                        }}
                                    >
                                        <Info className={`w-5 h-5 transition-colors ${activeInfoId === service.id ? "text-red-500" : "text-slate-400 hover:text-slate-600"}`} />
                                    </div>
                                )}

                                {/* Disclaimer Section*/}
                                <div className={`grid transition-all duration-500 ease-in-out ${activeInfoId === service.id
                                    ? "grid-rows-[1fr] opacity-100 mt-6"
                                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="p-6 rounded-[12px] bg-[#FEF2F2] border border-[#FEE2E2]">
                                            <h4 className="text-[16px] font-[700] text-[#3E4246] mb-2">Disclaimers</h4>
                                            <p className="text-[14px] text-[#EF4444] leading-relaxed font-medium">
                                                EIN issuance by the IRS routinely takes at least 4 weeks and that this timeline is outside our control. Any marketing language suggesting fast EIN turnaround is unacceptable.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Button */}
                        <div className="flex justify-center pt-8 pb-6">
                            <button
                                onClick={handleContinue}
                                disabled={isLoading}
                                className={`w-[480px] py-4 bg-[#3B87FA] cursor-pointer text-white rounded-full font-bold text-[18px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default StarterPlan;
