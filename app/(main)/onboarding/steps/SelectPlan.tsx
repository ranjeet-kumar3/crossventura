"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, Check } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "sonner";

interface SelectPlanProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
}

const SelectPlan: React.FC<SelectPlanProps> = ({ onNext, onBack }) => {
    const [selectedPlan, setSelectedPlan] = useState("");
    const [bookConsultationGlobal, setBookConsultationGlobal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [starterState, setStarterState] = useState("");
    const [premiumState, setPremiumState] = useState("");
    const [globalState, setGlobalState] = useState("");
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch('/api/packages');
                if (res.ok) {
                    const data = await res.json();
                    setPackages(data);
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };
        fetchPackages();
    }, []);

    const getPlanPrice = (planName: string) => {
        const pkg = packages.find(p => p.name.toLowerCase().includes(planName.toLowerCase()));
        return pkg?.price || (planName === "starter" ? "$249" : planName === "premium" ? "$849" : "$49");
    };

    const getStateFee = (state: string) => {
        // Hardcoded default fees (always reliable)
        const defaultFees: Record<string, number> = {
            "delaware": 160,
            "wyoming": 103.75,
            "florida": 125,
            "texas": 310,
            "nevada": 425,
            "new york": 205,
            "california": 90,
            "new mexico": 50,
            "washington": 200
        };

        const pkg = packages.find(p =>
            p.state?.toLowerCase() === state.toLowerCase()
        );

        if (pkg?.stateFee) {
            const fee = parseFloat(String(pkg.stateFee).replace('$', '').trim());
            if (!isNaN(fee) && fee > 0) return fee;
        }

        return defaultFees[state.toLowerCase()] ?? 0;
    };

    const getSupportedStates = (planName: string, defaultStates: string[]): string[] => {
        const pkg = packages.find(p => p.name.toLowerCase().includes(planName.toLowerCase()));
        if (pkg?.supportedStates && pkg.supportedStates.length > 0) {
            return pkg.supportedStates;
        }
        return defaultStates;
    };

    const handleContinue = async () => {
        if (!selectedPlan && !bookConsultationGlobal) {
            toast.error("Please select a plan to continue.");
            return;
        }

        let selectedState = "";
        if (selectedPlan === "starter") selectedState = starterState;
        if (selectedPlan === "premium") selectedState = premiumState;
        if (selectedPlan === "global") selectedState = globalState;

        // Mandatory state selection validation for chosen plans
        if (selectedPlan && !selectedState) {
            toast.error(`Please select a state for your ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan.`);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/onboarding/select-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    state: selectedState,
                    bookConsultation: bookConsultationGlobal
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Something went wrong');
            }

            onNext({
                plan: selectedPlan,
                state: selectedState,
                bookConsultation: bookConsultationGlobal
            });
            toast.success("Plan selected successfully!");
        } catch (err: any) {
            toast.error(err.message);
            console.error('Onboarding plan save error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                onClick={onBack}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            <div className="w-full max-w-[1256px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                <ProgressBar steps={[
                    "Your Details",
                    "Select Plan",
                    "Add Services",
                    "Business Details",
                    "Payment",
                    "Confirmation",
                    "KYC",
                ]} currentStepIndex={1} />

                <div className="flex flex-col items-center w-full max-w-[1218px] mx-auto h-[716px] pb-4">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-[40px] font-[700] text-[#1A202C] mb-3">
                            Choose your plan
                        </h1>
                        <p className="text-[#4A5568] text-[18px]">
                            Transparent pricing — no hidden fees. State fees calculated separately.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3  gap-8 w-full max-w-[1218px] h-[532px] mx-auto px-4 mb-2 items-center justify-items-center">

                        {/* Starter Plan Card */}
                        <div
                            onClick={() => {
                                setSelectedPlan("starter");
                                setBookConsultationGlobal(false);
                            }}
                            className={`relative rounded-[20px] p-8 border-[2.5px] flex flex-col h-[500px] w-full max-w-[360px] cursor-pointer transition-all duration-300 ${selectedPlan === "starter" ? "bg-[#ffffff] border-[#3B82F6]" : "bg-[#ffffff] border-[#DEE5ED]"
                                }`}

                        >
                            <div className="absolute top-6 right-6 cursor-pointer z-30">
                                <div className={`w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedPlan === "starter" ? "bg-[#3B82F6] border-[#3B82F6]" : "bg-white border-slate-300"
                                    }`}>
                                    {selectedPlan === "starter" && <Check className="w-[18px] h-[18px] text-white stroke-[3.5]" />}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className={`text-[28px] font-[700] mb-1 transition-colors ${selectedPlan === "starter" ? "text-[#3B82F6]" : "text-slate-800"}`}>Starter Plan</h3>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-[32px] font-[800] text-[#1A202C]">{getPlanPrice("starter")}</span>
                                    <span className="text-[16px] text-slate-500 mt-2">
                                        {starterState ? `+ $${getStateFee(starterState)} State Fee` : "+ State Filing Fees"}
                                    </span>
                                </div>
                                <div className="text-[16px] text-slate-500">Timeline : ~7 business days</div>
                            </div>
                            <div className="space-y-2.5 mb-6 overflow-hidden">
                                {["Name availability check (LLC)", "Articles of organization", "Basic operating agreement", "State filing", "Email support"].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className="w-4 h-4 mt-0.5 text-[#0266FF]" strokeWidth={3.5} />
                                        <span className="text-[16px] text-[#3E4246] font-[400] leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto">
                                <div className="text-[18px] font-semibold mb-2 text-[#3E4246]">Supported States :</div>
                                <div className="relative group">
                                    <select
                                        value={starterState}
                                        onChange={(e) => setStarterState(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-5 py-2.5 rounded-[32px] bg-[#193D66]/4 text-slate-600 border border-slate-100 outline-none appearance-none cursor-pointer focus:border-[#193D6614] transition-all"
                                    >
                                        <option value="" disabled>Select State</option>
                                        {getSupportedStates("starter", ["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"]).map(state => (
                                            <option key={state} value={state.toLowerCase()}>{state}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Premium Plan Card */}
                        <div
                            onClick={() => {
                                setSelectedPlan("premium");
                                setBookConsultationGlobal(false);
                            }}
                            className={`relative rounded-[20px] p-8 border-[2.5px] flex flex-col h-[532px] w-full max-w-[398px] overflow-hidden cursor-pointer transition-all duration-300 ${selectedPlan === "premium"
                                ? "bg-white border-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.12)]"
                                : "bg-white border-slate-200 "
                                }`}
                        >

                            <div className="absolute top-6 right-6 z-30 cursor-pointer">
                                <div className={`w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedPlan === "premium" ? "bg-[#3B82F6] border-[#3B82F6]" : "bg-transparent border-slate-300"
                                    }`}>
                                    {selectedPlan === "premium" && <Check className="w-[18px] h-[18px] text-white stroke-[3.5]" />}
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4">
                                    <h3 className={`text-[28px] font-[700] mb-0 transition-colors ${selectedPlan === "premium" ? "text-[#3B82F6]" : "text-[#1A202C]"}`}>Premium Plan</h3>
                                    <div className="flex items-baseline gap-1 ">
                                        <span className="text-[32px] font-[700] text-[#1A202C]">{getPlanPrice("premium")}</span>
                                        <span className="text-[16px] text-slate-500 font-[400] ml-1 mt-2">
                                            {premiumState ? `+ $${getStateFee(premiumState)} State Fee` : "+ State Filing Fees"}
                                        </span>
                                    </div>
                                    <div className="text-[16px] font-[300]  tracking-[0.1em] text-[#3E4246]">Badge : Recommended</div>
                                </div>

                                <div className="space-y-2.5 mb-6">
                                    {["Name availability check for C-corp", "C-Corp formation", "Bylaws & certificates", "Articles of incorporation", "Registered agent (1 year)", "EIN included", "State filing (7 days)"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <Check className="w-[18px] h-[18px] text-[#0266FF]" strokeWidth={3.5} />
                                            </div>
                                            <span className="text-[16px] leading-tight text-[#3E4246] font-[400] whitespace-nowrap">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <div className="text-[17px] font-semibold mb-2 text-slate-800">Supported States :</div>
                                    <div className="relative group">
                                        <select
                                            value={premiumState}
                                            onChange={(e) => setPremiumState(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-5 py-3 rounded-[32px] border border-slate-200 bg-slate-50 text-slate-700 outline-none appearance-none cursor-pointer focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/10 transition-all font-medium"
                                        >
                                            <option value="" disabled className="text-slate-400">Select State</option>
                                            {getSupportedStates("premium", ["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"]).map(state => (
                                                <option key={state} value={state.toLowerCase()}>{state}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Global Plan Card */}
                        <div
                            onClick={() => {
                                setSelectedPlan("global");
                                setBookConsultationGlobal(true);
                            }}
                            className={`relative rounded-[20px] p-8 border-[2.5px] flex flex-col h-[500px] w-full max-w-[360px] cursor-pointer transition-all duration-300 ${selectedPlan === "global" ? "bg-[#DEE5ED1F] border-[#3B82F6]" : "bg-[#DEE5ED1F] border-[#DEE5ED]"
                                }`}

                        >
                            <div className="absolute top-6 right-6 cursor-pointer z-30">
                                <div className={`w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedPlan === "global" ? "bg-[#3B82F6] border-[#3B82F6]" : "bg-white border-slate-300"
                                    }`}>
                                    {selectedPlan === "global" && <Check className="w-[18px] h-[18px] text-white stroke-[3.5]" />}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className={`text-2xl font-[700] mb-1 transition-colors ${selectedPlan === "global" ? "text-[#3B82F6]" : "text-slate-800"}`}>Global Plan</h3>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-[32px] font-[700] text-[#1A202C]">{getPlanPrice("global")}</span>
                                </div>
                                <div className="text-[16px] font-[300]  tracking-[0.1em] text-[#3E4246] ">Timeline : ~7 business days</div>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#0266FF]" strokeWidth={3.5} />
                                    <span className="text-[16px] font-[400] text-[#3E4246]">Warehousing in NY, Texas, CA</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-[#0266FF]" strokeWidth={3.5} />
                                    <span className="text-[16px] font-[400] text-[#3E4246]">Order processing & fulfilment</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className={`flex items-start gap-3 group ${selectedPlan === "global" ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={(e) => {
                                    e.stopPropagation();
                                    // Consultation is mandatory for Global Plan — cannot uncheck
                                    if (selectedPlan === "global") return;
                                    const newValue = !bookConsultationGlobal;
                                    setBookConsultationGlobal(newValue);
                                    if (newValue && selectedPlan !== "global") {
                                        setSelectedPlan("");
                                    }
                                }}>
                                    <div className={`mt-1 w-8 h-8 rounded-[6px] border-2 flex items-center justify-center transition-all ${bookConsultationGlobal ? "bg-[#4F8FFF] border-[#4F8FFF]" : "border-slate-100 bg-[#F7FAFC]"
                                        }`}>
                                        {bookConsultationGlobal && <Check className="w-5 h-5 text-white" strokeWidth={4} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[17px] font-[700] text-[#2D3748]">Book a Consultation</h4>
                                            {selectedPlan === "global" && (
                                                <span className="text-[11px] font-[600] text-white bg-[#4F8FFF] px-2 py-0.5 rounded-full">Required</span>
                                            )}
                                        </div>
                                        <p className="text-[#3E4246]/60 text-[14px]">30 mins | $49.00 One-time fee</p>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-auto">
                                <div className="text-[18px] font-semibold mb-2 text-[#3E4246]">Supported States :</div>
                                <div className="relative group">
                                    <select
                                        value={globalState}
                                        onChange={(e) => setGlobalState(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-5 py-2.5 rounded-[32px] bg-[#193D66]/4 text-slate-600 border border-slate-100 outline-none appearance-none cursor-pointer focus:border-[#193D6614] transition-all"
                                    >
                                        <option value="" disabled>Select State</option>
                                        {getSupportedStates("global", ["New York", "Texas", "California"]).map(s => (
                                            <option key={s} value={s.toLowerCase()}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="w-full max-w-[480px] mx-auto pt-6 pb-4">
                        <button
                            onClick={handleContinue}
                            disabled={isLoading || (!selectedPlan && !bookConsultationGlobal)}
                            className={`w-full py-4 text-white cursor-pointer rounded-full font-bold text-[18px] transition-all transform flex items-center justify-center gap-2 ${selectedPlan || bookConsultationGlobal ? "bg-[#3B87FA] hover:bg-[#0266FF] active:scale-[0.98] shadow-lg shadow-blue-900/20" : "bg-slate-300 cursor-not-allowed"
                                } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                        >
                            {isLoading ? "Saving..." : "Continue"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectPlan;
