"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronDown, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { MANAGE_FLOW_STEPS } from "../../config/steps";
import TimezoneSelect from 'react-timezone-select';

const countryToTimezone: Record<string, string> = {
    "India": "Asia/Kolkata",
    "United States": "America/New_York",
    "United Kingdom": "Europe/London",
    "Canada": "America/Toronto",
    "Australia": "Australia/Sydney",
    "Singapore": "Asia/Singapore",
    "Germany": "Europe/Berlin",
    "France": "Europe/Paris",
    "UAE": "Asia/Dubai",
};

interface PersonalProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    user?: {
        name?: string;
        email?: string;
    } | null;
}

const timezoneSelectStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#ffffff' : '#F8FAFC',
        borderRadius: '32px',
        borderColor: state.isFocused ? '#0266FF' : '#E2E8F0',
        padding: '2px 14px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#0266FF' : '#E2E8F0'
        },
        minHeight: '58px',
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 8px',
    }),
    input: (provided: any) => ({
        ...provided,
        color: '#2D3748',
        fontSize: '15px',
        margin: '0',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#2D3748',
        fontSize: '15px',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: '#94a3b8',
        fontSize: '15px',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: '#94a3b8',
        padding: '8px',
        '&:hover': {
            color: '#64748b',
        }
    }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: '16px',
        overflow: 'hidden',
        zIndex: 50,
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        fontSize: '15px',
        backgroundColor: state.isSelected ? '#0266FF' : state.isFocused ? '#eff6ff' : '#ffffff',
        color: state.isSelected ? '#ffffff' : '#2D3748',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: '#0266FF',
        }
    }),
};

const SUPPORTED_REG_COUNTRIES = [
    "United States",
];

const SUPPORTED_US_STATES = [
    "Delaware",
    "Wyoming",
    "Florida",
    "Texas",
    "Nevada",
    "New York",
    "California",
    "New Mexico",
    "Washington",
];

const Personal: React.FC<PersonalProps> = ({ onNext, onBack, user }) => {
    const { data: session } = useSession();
    const [countryRegOpen, setCountryRegOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        phoneCountryCode: "us", // tracks the ISO code selected in phone input
        country: "United States",
        timezone: "America/New_York",
        hasRegisteredCompany: true,
        businessName: "",
        countryOfRegistration: "",
        state: "",
        businessCategory: "",
        otherBusinessCategory: "",
        businessDescription: "",
    });

    // Auto-populate from session or user prop if available
    useEffect(() => {
        const userData = session?.user || user;
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || userData.name || "",
                email: prev.email || userData.email || "",
            }));
        }
    }, [session, user]);

    const steps = MANAGE_FLOW_STEPS;

    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        // 1. Basic Personal Detail Validation
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name");
            return;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 7) {
            toast.error("Please enter a valid phone number");
            return;
        }
        if (!formData.country) {
            toast.error("Please select your country");
            return;
        }
        if (!formData.timezone) {
            toast.error("Please select your timezone");
            return;
        }

        // 2. Business Information Validation
        if (formData.hasRegisteredCompany) {
            if (!formData.businessName.trim()) {
                toast.error("Please enter your business name");
                return;
            }

            const registrationCountry = formData.countryOfRegistration.trim().toLowerCase();
            const isUsaRegistration = registrationCountry === "united states";

            if (!isUsaRegistration) {
                toast.error("We currently only support business management for companies registered in the USA.");
                return;
            }

            // Mismatch check: Indian phone number cannot register a USA business
            if (formData.phoneCountryCode === "in") {
                toast.error("Your phone number is Indian (+91). You cannot register a USA business with an Indian number. Please use a US phone number.");
                return;
            }

            if (!formData.state.trim()) {
                toast.error("Please select the state of registration");
                return;
            }

            // US Supported States Validation
            const isSupportedState = SUPPORTED_US_STATES.some(s => s.toLowerCase() === formData.state.trim().toLowerCase());

            if (!isSupportedState) {
                toast.error("We currently only provide services in these US states: DE, WY, FL, TX, NV, NY, CA, NM, WA.");
                return;
            }
        }

        // 3. Business Context Validation
        if (!formData.businessCategory) {
            toast.error("Please select a business category");
            return;
        }
        if (formData.businessCategory === "other" && !formData.otherBusinessCategory.trim()) {
            toast.error("Please specify your business category");
            return;
        }


        setIsLoading(true);
        try {
            const response = await fetch('/api/onboarding/manage-business', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error("Failed to save manage business details");
                toast.error("Something went wrong while saving. Please try again.");
                setIsLoading(false);
                return;
            }

            if (!formData.hasRegisteredCompany) {
                toast.info("Redirecting to the 'Start a New Business' flow...");
                onNext({ ...formData, whoIsThisFor: "start" });
                return;
            }

            onNext(formData);
        } catch (error) {
            console.error("Error saving manage business details:", error);
            toast.error("Connection error. Please check your internet.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex  items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onBack}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1280px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={0} />

                {/* Content */}
                <div className="flex flex-col items-center w-full max-w-[1196px] mx-auto overflow-y-auto max-h-[calc(100vh-268px)] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-[40px] font-[700] text-[#1A202C] mb-2">
                            Tell Us About Your Business
                        </h1>
                        <p className="text-[#4A5568] text-[18px]">
                            This helps us understand your requirements before the consultation
                        </p>
                    </div>

                    <div className="w-full max-w-[870px] space-y-8">
                        {/* Personal Detail Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800">Personal Detail</h2>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Full Name*"
                                    autoComplete="name"
                                    className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border-2 border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] placeholder-slate-400"
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
                                        setFormData({ ...formData, fullName: value });
                                    }}
                                />
                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        autoComplete="email"
                                        className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border-2 border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] placeholder-slate-400"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value.toLowerCase() });
                                        }}
                                    />
                                    <p className="text-[13px] text-[#4285F4] px-1 font-medium">
                                        We&apos;ll send important account information here.
                                    </p>
                                </div>

                                <div className="phone-input-container">
                                    <PhoneInput
                                        country={'us'}
                                        value={formData.phoneNumber}
                                        onChange={(phone, data: any) => {
                                            // Get ISO country code (e.g. 'us', 'in')
                                            const isoCode: string = (data.countryCode || "").toLowerCase();

                                            // Get full country name from data.name
                                            let countryName = data.name ? data.name.split('(')[0].trim() : "";

                                            // Special mapping for abbreviated names
                                            const nameMapping: Record<string, string> = {
                                                'USA': 'United States',
                                                'UK': 'United Kingdom',
                                            };
                                            countryName = nameMapping[countryName] || countryName;

                                            if (countryName) {
                                                const timezone = countryToTimezone[countryName] || formData.timezone;
                                                setFormData({
                                                    ...formData,
                                                    phoneNumber: phone,
                                                    phoneCountryCode: isoCode,
                                                    country: countryName,
                                                    timezone: timezone,
                                                });
                                            } else {
                                                setFormData({ ...formData, phoneNumber: phone, phoneCountryCode: isoCode });
                                            }
                                        }}
                                        placeholder="International Number*"
                                        containerClass="w-full"
                                        inputClass="w-full"
                                        enableSearch={true}
                                        searchPlaceholder="Search country..."
                                        searchClass="phone-search-input"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <select
                                            className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] appearance-none cursor-pointer"
                                            value={formData.country}
                                            onChange={(e) => {
                                                const country = e.target.value;
                                                const timezone = countryToTimezone[country] || formData.timezone;
                                                setFormData({ ...formData, country, timezone });
                                            }}
                                        >
                                            <option value="" disabled>Country*</option>
                                            {/* Dynamic Option if phone input selected a country not in the list */}
                                            {formData.country && !["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "UAE", "Singapore", "Japan"].includes(formData.country) && (
                                                <option value={formData.country}>{formData.country}</option>
                                            )}
                                            <option value="India">India</option>
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Germany">Germany</option>
                                            <option value="France">France</option>
                                            <option value="UAE">United Arab Emirates</option>
                                            <option value="Singapore">Singapore</option>
                                            <option value="Japan">Japan</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <TimezoneSelect
                                            value={formData.timezone}
                                            onChange={(tz: any) => setFormData({ ...formData, timezone: tz.value })}
                                            styles={timezoneSelectStyles}
                                            placeholder="Timezone*"
                                            menuPlacement="top"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-[24px] font-[800] text-[#2D3748]">Business Information</h2>
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <p className="text-[#2D3748] font-[600] text-[18px]">Do you have a registered company?</p>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="registered"
                                                    className="peer appearance-none w-[22px] h-[22px] border border-slate-300 rounded-full checked:bg-[#2D3748] checked:border-[#2D3748] transition-all cursor-pointer"
                                                    checked={formData.hasRegisteredCompany === true}
                                                    onChange={() => setFormData({ ...formData, hasRegisteredCompany: true })}
                                                />
                                                <Check className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" strokeWidth={4} />
                                            </div>
                                            <span className="text-[#2D3748] font-medium text-[16px]">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="registered"
                                                    className="peer appearance-none w-[22px] h-[22px] border border-slate-300 rounded-full checked:bg-[#2D3748] checked:border-[#2D3748]  transition-all cursor-pointer"
                                                    checked={formData.hasRegisteredCompany === false}
                                                    onChange={() => setFormData({ ...formData, hasRegisteredCompany: false })}
                                                />
                                                <Check className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" strokeWidth={4} />
                                            </div>
                                            <span className="text-[#2D3748] font-medium text-[16px]">No</span>
                                        </label>
                                    </div>
                                </div>
 
                                {formData.hasRegisteredCompany === false && (
                                    <div className="mt-4 p-6 bg-blue-50/50 rounded-[24px] border border-blue-100/50 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <AlertCircle className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-[18px] font-bold text-blue-900 mb-1">Planning to start a new business?</h3>
                                                <p className="text-blue-700/80 text-[14px] leading-relaxed mb-4">
                                                    If you don&apos;t have a registered company yet, you should use our <span className="font-bold">&quot;Start a New Business&quot;</span> flow to help you with the formation process.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => onNext({ whoIsThisFor: "start" })}
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-[14px] font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                                >
                                                    Switch to Start Flow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.hasRegisteredCompany && (
                                    <div className="space-y-4 mt-2">
                                        {/* Business Name */}
                                        <input
                                            type="text"
                                            placeholder="Business Name*"
                                            className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] placeholder-slate-400"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        />

                                        {/* Country of Registration Dropdown */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => { setCountryRegOpen(p => !p); setStateOpen(false); }}
                                                className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] hover:bg-white transition-all outline-none text-[15px] flex items-center justify-between"
                                            >
                                                <span className={formData.countryOfRegistration ? "text-[#2D3748]" : "text-slate-400"}>
                                                    {formData.countryOfRegistration || "Country of Registration*"}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform duration-200 ${countryRegOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            {countryRegOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-[20px] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {SUPPORTED_REG_COUNTRIES.map((c) => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, countryOfRegistration: c, state: "" });
                                                                setCountryRegOpen(false);
                                                            }}
                                                            className="w-full px-6 py-4 text-left text-[15px] text-[#2D3748] hover:bg-[#F0F4F8] flex items-center justify-between transition-colors"
                                                        >
                                                            {c}
                                                            {formData.countryOfRegistration === c && <Check className="w-4 h-4 text-[#0266FF]" />}
                                                        </button>
                                                    ))}
                                                    <div className="px-6 py-3 border-t border-[#F0F4F8]">
                                                        <p className="text-[12px] text-slate-400">We currently support USA registrations only.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* State Dropdown — only shown when USA is selected */}
                                        {formData.countryOfRegistration === "United States" && (
                                            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                                                <button
                                                    type="button"
                                                    onClick={() => { setStateOpen(p => !p); setCountryRegOpen(false); }}
                                                    className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] hover:bg-white transition-all outline-none text-[15px] flex items-center justify-between"
                                                >
                                                    <span className={formData.state ? "text-[#2D3748]" : "text-slate-400"}>
                                                        {formData.state || "Select State*"}
                                                    </span>
                                                    <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform duration-200 ${stateOpen ? "rotate-180" : ""}`} />
                                                </button>
                                                {stateOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-[20px] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[280px] overflow-y-auto">
                                                        {SUPPORTED_US_STATES.map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData({ ...formData, state: s });
                                                                    setStateOpen(false);
                                                                }}
                                                                className="w-full px-6 py-4 text-left text-[15px] text-[#2D3748] hover:bg-[#F0F4F8] flex items-center justify-between transition-colors"
                                                            >
                                                                {s}
                                                                {formData.state === s && <Check className="w-4 h-4 text-[#0266FF]" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Business Context Section */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-[24px] font-[800] text-[#2D3748]">Business Context</h2>
                            <div className="space-y-4">
                                {formData.businessCategory === "other" ? (
                                    <div className="relative animate-in fade-in duration-300">
                                        <input
                                            type="text"
                                            placeholder="Type your business category"
                                            className="w-full px-6 py-[16px] bg-[#193D66]/4 rounded-[32px] border border-[#193D66]/4 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] placeholder-slate-400"
                                            value={formData.otherBusinessCategory}
                                            onChange={(e) => setFormData({ ...formData, otherBusinessCategory: e.target.value })}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, businessCategory: "", otherBusinessCategory: "" })}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] appearance-none cursor-pointer"
                                            value={formData.businessCategory}
                                            onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                        >
                                            <option value="" disabled>Business Category</option>
                                            <option value="ecommerce">E-Commerce</option>
                                            <option value="saas">SaaS</option>
                                            <option value="digital_marketing">Digital Marketing</option>
                                            <option value="import_export">Import/Export</option>
                                            <option value="it_staffing">IT & Staffing</option>
                                            <option value="edtech">EdTech</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 pointer-events-none" />
                                    </div>
                                )}


                                <input
                                    type="text"
                                    placeholder="Business Description (Optional)"
                                    className="w-full px-6 py-[16px] bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#2D3748] text-[15px] placeholder-slate-400"
                                    value={formData.businessDescription}
                                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div className="pt-4 max-w-[480px] mx-auto">
                            <button
                                onClick={handleContinue}
                                disabled={isLoading}
                                className="w-full py-4 cursor-pointer bg-[#3B87FA] text-white rounded-full font-[400] text-[18px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/10 disabled:opacity-70 flex items-center justify-center gap-2"
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

export default Personal;
