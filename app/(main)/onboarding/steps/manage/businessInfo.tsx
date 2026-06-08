"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import { MANAGE_FLOW_STEPS } from "../../config/steps";

interface BusinessInfoProps {
    onNext?: (data: Record<string, unknown>) => void;
    onBack?: () => void;
    formData?: Record<string, any>;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ onNext, onBack, formData }) => {
    const [businessType, setBusinessType] = useState(formData?.businessCategory || "");
    const [description, setDescription] = useState(formData?.businessDescription || formData?.description || "");
    const [isLoading, setIsLoading] = useState(false);

    // Static file representation as per the design
    const [files, setFiles] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea logic
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [description]);

    // Sync with formData if it changes
    useEffect(() => {
        if (formData?.businessCategory) {
            setBusinessType(formData.businessCategory);
        }
        if (formData?.businessDescription) {
            setDescription(formData.businessDescription);
        }
    }, [formData]);

    useEffect(() => {
        const savedData = localStorage.getItem("onboarding_business_info");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setBusinessType(parsed.businessType || "");
                setDescription(parsed.description || "");
                setFiles(parsed.files || []);
            } catch (e) {
                console.error("Failed to parse saved onboarding data", e);
            }
        }
    }, []);

    useEffect(() => {
        const dataToSave = { businessType, description, files };
        localStorage.setItem("onboarding_business_info", JSON.stringify(dataToSave));
    }, [businessType, description, files]);

    const addFiles = async (newFiles: File[]) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));

        const processedFiles = await Promise.all(
            validFiles.map(file => {
                return new Promise<any>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            name: file.name,
                            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB / ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                            status: "Completed",
                            content: reader.result // Base64 content for local preview/storage
                        });
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        setFiles(prev => {
            const combined = [...prev, ...processedFiles];
            return combined.slice(0, 2); // Keep only the first 2 files
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleContinue = async () => {
        // 1. Validation for Business Type
        if (!businessType) {
            toast.error("Please select a business type");
            return;
        }

        // 2. Validation for Description
        if (!description.trim()) {
            toast.error("Please describe your business");
            return;
        }

        // 3. Validation for Required Documents (Exactly 2 required: EIN and Registration)
        if (files.length < 2) {
            toast.error("Please upload both required documents: EIN Letter and Registration Certificate");
            return;
        }


        setIsLoading(true);
        try {
            const response = await fetch("/api/onboarding/manage-business-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    businessType,
                    description,
                    documentUrls: files.map(f => ({
                        name: f.name,
                        content: f.content
                    }))
                }),
            });

            if (response.ok) {
                if (onNext) {
                    onNext({ businessType, description, files });
                }
            } else {
                console.error("Failed to save business info");
                toast.error("Something went wrong while saving. Please try again.");
            }
        } catch (error) {
            console.error("Error saving business info:", error);
            toast.error("Connection error. Please check your internet.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onBack}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Container */}
            <div className="w-full max-w-[1280px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors z-20"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar (Index 4 maps to Business Details in MANAGE_FLOW_STEPS) */}
                <ProgressBar steps={MANAGE_FLOW_STEPS} currentStepIndex={4} />

                <div className="flex flex-col items-center w-full max-w-[870px] mx-auto overflow-y-auto max-h-[calc(100vh-268px)] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Header */}
                    <div className="text-center mb-8 w-full mt-4">
                        <h1 className="text-3xl md:text-[40px] font-[800] text-[#2D3748] mb-3 tracking-tight">
                            Tell Us About Your Business
                        </h1>
                        <p className="text-[#718096] text-[18px] font-medium">
                            This helps us tailor services and pricing for you
                        </p>
                    </div>

                    <div className="w-full space-y-7">
                        {/* Business Type */}
                        <div className="space-y-3">
                            <label className="text-[18px] font-semibold text-[#3E4246]">Business Type*</label>
                            <div className="relative">
                                <select
                                    className="w-full px-6 py-4 bg-[#193D66]/4 rounded-[32px] border border-[#193D66]/8 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-slate-500 appearance-none cursor-pointer text-[15px] font-medium"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                >
                                    <option className="text-[#3E4246] font-[500] " value="" disabled>Select Business Type</option>
                                    <option value="it_staffing">IT & Staffing</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="import_export">Import/Export</option>
                                    <option value="digital_marketing">Digital Marketing</option>
                                    <option value="saas">SaaS</option>
                                    <option value="edtech">EdTech</option>

                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E4246] pointer-events-none" />
                            </div>
                        </div>

                        {/* Describe your business */}
                        <div className="min-h-[85px] space-y-1">
                            <label className="text-[18px] font-semibold text-[#3E4246]">Describe your business</label>
                            <textarea
                                ref={textareaRef}
                                placeholder="Briefly explain what your business does..."
                                className="w-full px-5 py-[18px] bg-[#193D66]/4 rounded-[24px] border border-[#193D66]/8 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-slate-700 text-[15px] resize-none font-medium placeholder-slate-400 overflow-hidden"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Required Documents */}
                        <div className="space-y-4">
                            <label className="text-[16px] font-[800] text-[#2D3748]">Required Documents*</label>

                            {/* Info Banner */}
                            <div className="bg-[#F0F4F8] rounded-[24px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 sm:gap-16 px-8 transition-all duration-500">
                                <div className="flex items-center gap-4 group">
                                    {files.length >= 1 ? (
                                        <div className="bg-[#00C853] rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-green-500/20 animate-in zoom-in duration-300">
                                            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                                            <span className="text-[#94A3B8] text-[12px] font-bold">!</span>
                                        </div>
                                    )}
                                    <span className={`text-[15px] font-[600] transition-colors duration-500 flex items-center gap-2 ${files.length >= 1 ? "text-[#00C853]" : "text-[#4A5568]"}`}>
                                        EIN Letter (SS-4 / IRS document)
                                        {files.length >= 1 && <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    {files.length >= 2 ? (
                                        <div className="bg-[#00C853] rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-green-500/20 animate-in zoom-in duration-300">
                                            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 bg-[#E2E8F0] rounded-full flex items-center justify-center">
                                            <span className="text-[#94A3B8] text-[12px] font-bold">!</span>
                                        </div>
                                    )}
                                    <span className={`text-[15px] font-[600] transition-colors duration-500 flex items-center gap-2 ${files.length >= 2 ? "text-[#00C853]" : "text-[#4A5568]"}`}>
                                        Business Registration Certificate
                                        {files.length >= 2 && <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />}
                                    </span>
                                </div>
                            </div>

                            {/* Dropzone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-[#CBD5E0] rounded-[16px] py-12 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-[#0266FF] hover:bg-blue-50/30 transition-colors"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <Upload className="w-8 h-8 text-[#4A5568] mb-4" strokeWidth={1.5} />
                                <div className="flex items-center gap-2 text-center flex-wrap justify-center px-4">
                                    <span className="text-[16px] text-[#2D3748] font-[800]">
                                        Drag & drop files here or click to upload
                                    </span>
                                    <span className="text-[15px] text-[#A0AEC0] font-medium">
                                        Upload the 2 required documents (PDF, JPG, PNG)
                                    </span>
                                </div>
                            </div>

                            {/* File List */}
                            {files.map((file, idx) => (
                                <div key={idx} className="border border-[#E2E8F0] rounded-[12px] p-4 flex items-center justify-between bg-white shadow-sm">
                                    <div className="flex items-center gap-4">
                                        {/* Custom PDF Icon matching the design */}
                                        <div className="w-12 h-12 flex items-center justify-center relative">
                                            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.8 0C2.14903 0 0 2.14903 0 4.8V43.2C0 45.851 2.14903 48 4.8 48H35.2C37.851 48 40 45.851 40 43.2V14.4L25.6 0H4.8Z" fill="white" stroke="#FC8181" strokeWidth="2" />
                                                <path d="M25.6 0V14.4H40" fill="#FC8181" />
                                                <path d="M25.6 0V14.4H40" stroke="#FC8181" strokeWidth="2" />
                                                <rect x="8" y="24" width="24" height="4" rx="1" fill="#FC8181" />
                                                <rect x="8" y="32" width="16" height="4" rx="1" fill="#FC8181" />
                                                <text x="6" y="20" fill="#E53E3E" fontSize="10" fontWeight="900" fontFamily="sans-serif">PDF</text>
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[15px] font-[800] text-[#2D3748]">{file.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] text-[#718096] font-medium">{file.size}</span>
                                                <span className="text-[13px] text-[#718096]">•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="bg-[#22C55E] rounded-full p-[1px]">
                                                        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[13px] font-[700] text-[#22C55E]">{file.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFile(idx)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-2">
                                        <Trash2 className="w-5 h-5 text-[#A0AEC0]" strokeWidth={2} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Continue Button (Hidden in screenshot, but required for flow) */}
                        <div className="pt-2 pb-4 flex justify-center">
                            <button
                                onClick={handleContinue}
                                disabled={isLoading}
                                className="w-full max-w-[480px] cursor-pointer py-4 bg-[#0266FF] text-white rounded-full font-[400] text-[18px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

export default BusinessInfo;
