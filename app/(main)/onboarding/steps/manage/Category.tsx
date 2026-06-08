"use client";

import React, { useState } from "react";
import { ChevronLeft, CheckCircle2, ChevronDown } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { MANAGE_FLOW_STEPS } from "../../config/steps";
import { toast } from "sonner";

interface CategoryProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
}

const Category: React.FC<CategoryProps> = ({ onNext, onBack }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [serviceStates, setServiceStates] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const US_STATES = [
        "Wyoming", "Delaware", "Nevada", "Texas", "Florida", "California", "New York", "New Mexico", "Washington",
    ];

    const steps = MANAGE_FLOW_STEPS;

    const categories = [
        {
            id: "scaling",
            title: "Post Business Setup & Scaling",
            description: "Enhance your business setup with our essential scaling services.",
            services: [
                { id: "google_verification", title: "Google Verification", price: "$299 (Upfront)", numericPrice: 299 },
                { id: "board_flex", title: "Board Flex", price: "$500 (Upfront)", numericPrice: 500 },
                { id: "physical_office", title: "Physical Office Address", price: "$200/month ($2,400/yr)", numericPrice: 200, type: 'monthly' },
                { id: "virtual_office", title: "Virtual Office Address", price: "$35/month ($420/yr)", numericPrice: 35, type: 'monthly' },
                { id: "warehousing", title: "Warehousing & Logistics", price: "$49 (one time)", numericPrice: 49 }
            ]
        },
        {
            id: "payments",
            title: "Payment Solutions",
            description: "Securely accept online payments, manage transactions, and streamline global payment processing.",
            services: [
                { id: "physical_bank", title: "Physical Bank Account", price: "$49 Consultation (30 mins)", numericPrice: 49 },
                { id: "payment_gateway", title: "Payment Gateway & Merchant Solutions", price: "$49 Consultation (30 mins)", numericPrice: 49 }
            ]
        },
        {
            id: "compliances",
            title: "Compliances",
            description: "Stay compliant with regulations, manage filings, and ensure your business meets all legal requirements.",
            services: [
                { id: "tax_guidance", title: "Annual Taxation Guidance", price: "$49 Consultation (30 mins)", numericPrice: 49 }
            ]
        }
    ];

    const toggleService = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Card expand/collapse na ho
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        if (selectedCategories.length > 0) {
            // Validate that all selected services have a state selected
            const incompleteServices = selectedServices.filter(id => !serviceStates[id]);

            if (incompleteServices.length > 0) {
                toast.error("Please select a state for all selected services before continuing.");
                return;
            }

            // State match validation: physical_office state must match google_verification/board_flex/warehousing
            const stateLinkedServices = ["google_verification", "board_flex", "warehousing"];
            const selectedStateLinked = stateLinkedServices.filter(id => selectedServices.includes(id));
            const isPhysicalOfficeSelected = selectedServices.includes("physical_office");

            // If 2+ of the state-linked services are selected, their states must all be the same
            if (selectedStateLinked.length >= 2) {
                const states = selectedStateLinked.map(id => serviceStates[id]);
                const allSame = states.every(s => s === states[0]);
                if (!allSame) {
                    toast.error(
                        `Google Verification, Board Flex, and Warehousing & Logistics must all have the same state selected.`
                    );
                    return;
                }
            }

            if (isPhysicalOfficeSelected && selectedStateLinked.length > 0) {
                // Get the state from any one of the state-linked services (they all share same options)
                const referenceState = serviceStates[selectedStateLinked[0]];
                const physicalOfficeState = serviceStates["physical_office"];

                if (physicalOfficeState !== referenceState) {
                    toast.error(
                        `Physical Office Address state must match the state selected for ${selectedStateLinked.map(id =>
                            categories[0].services.find(s => s.id === id)?.title || id
                        ).join(", ")} (${referenceState}).`
                    );
                    return;
                }
            }

            setIsLoading(true);

            const hasWarehousing = selectedServices.includes("warehousing");

            // Calculate total based on selected services
            const selectedServicesDetails = categories
                .flatMap(c => c.services)
                .filter(s => selectedServices.includes(s.id));

            const totalAmount = selectedServicesDetails.reduce((sum, s) => sum + s.numericPrice, 0);

            const needsConsultation = selectedServices.some(id =>
                ["physical_bank", "payment_gateway", "tax_guidance"].includes(id)
            );

            const activeCategories = categories.filter(c => selectedCategories.includes(c.id));
            const categoryTitles = activeCategories.map(c => c.title).join(", ");

            onNext({
                categories: selectedCategories,
                categoryTitle: categoryTitles,
                selectedServices,
                selectedServicesDetails,
                totalAmount,
                serviceStates,
                bookConsultation: needsConsultation,
                plan: hasWarehousing ? "global" : undefined
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
                onClick={onBack}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            <div className="w-full max-w-[1298px] h-[min(1100px,95vh)] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-4 sm:p-6 md:p-10 lg:p-12 z-10 animate-in fade-in zoom-in duration-300 flex flex-col">
                <button
                    onClick={onBack}
                    className="absolute left-4 top-4 md:left-8 md:top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors z-20"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
                </button>

                <div className="mt-8 md:mt-0">
                    <ProgressBar steps={steps} currentStepIndex={1} />
                </div>

                <div className="flex-1 flex flex-col items-center w-full max-w-[1218px] mx-auto overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="text-center mb-6 w-full px-2">
                        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-[700] text-[#1A202C] mb-2 leading-tight">
                            Choose What You Need Help With
                        </h1>
                        <p className="text-[#4A5568] text-[15px] sm:text-[18px]">
                            Select a category to explore services
                        </p>
                    </div>

                    <div className="w-full max-w-[1200px] space-y-4 md:space-y-6 mb-4 px-2 sm:px-0">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className={`rounded-[16px] md:rounded-[24px] border-2 transition-all duration-500 cursor-pointer overflow-hidden group ${selectedCategories.includes(cat.id)
                                    ? "border-[#DEE5ED] bg-[#F8FAFC]  ring-1 ring-[#0266FF]/20"
                                    : "border-[#E2E8F0] hover:border-[#CBD5E0] bg-[#F8FAFC]/50"
                                    }`}
                            >
                                {/* Category Header */}
                                <div className="p-5 sm:p-6 md:p-8 flex items-center justify-between gap-4">
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className={`text-xl sm:text-2xl font-bold transition-colors ${selectedCategories.includes(cat.id) ? "text-[#3E4246]" : "text-[#3E4246]"
                                            }`}>
                                            {cat.title}
                                        </h3>
                                        <p className="text-[#3E4246] text-[14px] sm:text-[16px] max-w-[1218px] leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedCategories.includes(cat.id) ? "border-[#334155] bg-[#334155]" : "border-[#CBD5E0] bg-white"
                                            }`}>
                                            {selectedCategories.includes(cat.id) && (
                                                <svg width="12" height="9" className="sm:w-[14px] sm:h-[10px]" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Services List (Shown when Expanded) */}
                                <div className={`grid transition-all duration-500 ease-in-out ${selectedCategories.includes(cat.id) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}>
                                    <div className="overflow-hidden">
                                        <div className="p-4 sm:p-6 md:p-8 pt-2 sm:pt-4 space-y-0 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] ">
                                            {cat.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    onClick={(e) => toggleService(service.id, e)}
                                                    className="py-4 sm:py-6 flex items-center gap-4 sm:gap-6 cursor-pointer hover:bg-blue-50/30 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl transition-colors"
                                                >
                                                    <div className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedServices.includes(service.id)
                                                        ? "border-[#334155] bg-[#334155]"
                                                        : "border-[#CBD5E0] bg-white"
                                                        }`}>
                                                        {selectedServices.includes(service.id) && (
                                                            <svg width="12" height="9" className="sm:w-[14px] sm:h-[10px]" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-[15px] sm:text-[17px] font-bold ${selectedServices.includes(service.id) ? "text-[#3E4246]" : "text-[#3E4246]"}`}>
                                                            {service.title}
                                                        </span>
                                                        <span className="text-[#3E4246] text-[13px] sm:text-[15px] mt-0.5 sm:mt-0">{service.price}</span>
                                                    </div>

                                                    {/* State Selection Dropdown */}
                                                    <div className="ml-auto">
                                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                            <select
                                                                className="w-[180px] sm:w-[260px] px-6 py-3 bg-[#193D66]/4 rounded-[32px] border border-[#193D66]/8 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#718096] appearance-none cursor-pointer text-[14px] font-medium"
                                                                value={serviceStates[service.id] || ""}
                                                                onChange={(e) => setServiceStates(prev => ({ ...prev, [service.id]: e.target.value }))}
                                                            >
                                                                <option value="" className="text-black" disabled>Select State</option>
                                                                {(service.id === "warehousing" || service.id === "google_verification" || service.id === "board_flex"
                                                                    ? ["New York", "California", "Texas"]
                                                                    : (service.id === "physical_bank" || service.id === "payment_gateway")
                                                                        ? ["Texas"]
                                                                        : US_STATES
                                                                ).map(state => (
                                                                    <option key={state} value={state}>{state}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096] pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full max-w-[480px] px-4 sm:px-0 mt-4">
                        <button
                            onClick={handleContinue}
                            disabled={selectedCategories.length === 0 || isLoading}
                            className={`w-full py-4 sm:py-4 rounded-full font-bold cursor-pointer text-[16px] sm:text-[18px] transition-all transform flex items-center justify-center gap-2 ${selectedCategories.length > 0
                                ? `bg-[#0266FF] text-white shadow-lg shadow-blue-900/10 ${isLoading ? "opacity-80 cursor-wait" : "hover:bg-[#0052cc] active:scale-[0.98]"}`
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;
