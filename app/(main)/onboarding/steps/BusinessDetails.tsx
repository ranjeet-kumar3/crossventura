"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown, Check, Search } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";

interface BusinessDetailsProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    initialBusinessName?: string;
    initialCountry?: string;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ onNext, onBack, initialBusinessName, initialCountry }) => {
    const [entityType, setEntityType] = useState("llc");
    const [regAgentType, setRegAgentType] = useState("included");
    const [formationState, setFormationState] = useState("");
    const [numMembers, setNumMembers] = useState<number | "">("");
    const [numShareholders, setNumShareholders] = useState<number | "">("");

    // Additional Form States
    const [businessName, setBusinessName] = useState(initialBusinessName || "");

    // Sync businessName and country with prop if it changes
    React.useEffect(() => {
        if (initialBusinessName) {
            setBusinessName(initialBusinessName);
        }
        if (initialCountry) {
            setCountry(initialCountry);
        }
    }, [initialBusinessName, initialCountry]);

    const [businessAddress, setBusinessAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState(initialCountry || "");
    const [countrySearch, setCountrySearch] = useState("");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryRef = useRef<HTMLDivElement>(null);
    const [regAgentName, setRegAgentName] = useState("");
    const [regAgentAddress, setRegAgentAddress] = useState("");

    const ALL_COUNTRIES = [
        "United States", "India", "United Kingdom", "Canada", "United Arab Emirates",
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    const filteredCountries = ALL_COUNTRIES.filter(c =>
        c.toLowerCase().includes(countrySearch.toLowerCase())
    );

    // Close country dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const steps = [
        "Your Details",
        "Select Plan",
        "Add Services",
        "Business Details",
        "Payment",
        "Confirmation",
        "KYC",
    ];

    const entities = [
        {
            id: "llc",
            title: "LLC",
            description: "For small businesses and more flexibility.",
        },
        {
            id: "c-corp",
            title: "C-Corporation",
            description: "For startups fundraising from investors.",
        },
        {
            id: "s-corp",
            title: "S-Corporation",
            description: "For startups fundraising from investors.",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1256px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={3} />

                {/* Content */}
                <div className="flex flex-col items-center w-full max-w-[1000px] mx-auto h-[716px] overflow-y-auto hide-scrollbar pb-8 px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-[40px] font-[700] text-[#1A202C] mb-2">
                            Business Formation
                        </h1>
                        <p className="text-[#4A5568] text-[18px]">
                            Warehousing Intake Form
                        </p>
                    </div>

                    {/* Entity Cards */}
                    <div className="flex flex-wrap justify-center gap-8 w-full max-w-[897px] mb-10">
                        {entities.map((entity) => (
                            <div
                                key={entity.id}
                                className={`relative rounded-[20px] w-full md:w-[273px] p-8 border-2 transition-all duration-300 flex flex-col h-[168px] ${entityType === entity.id
                                    ? "bg-[#0266FF] border-[#0266FF] text-white shadow-lg"
                                    : "bg-white border-slate-100 text-slate-800"
                                    }`}
                            >
                                <div
                                    onClick={() => setEntityType(entity.id)}
                                    className="absolute top-4 right-4 cursor-pointer z-20"
                                >
                                    {entityType === entity.id ? (
                                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <Check className="w-5 h-5 text-[#193D66] stroke-[3]" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full border-2 border-slate-200 bg-white" />
                                    )}
                                </div>
                                <h3 className="text-[28px] font-bold mb-3">{entity.title}</h3>
                                <p className={`text-[16px] md:text-[18px] leading-relaxed ${entityType === entity.id ? "text-slate-100" : "text-slate-500"}`}>
                                    {entity.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Form Fields */}
                    <div className="w-full max-w-[897px] space-y-8">
                        {/* State of formation Section */}
                        <div className="space-y-3">
                            <label className="text-[16px] md:text-[18px] font-[600] text-[#2D3748] px-2">State of formation</label>
                            <div className="relative">
                                <select
                                    value={formationState}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setFormationState(selected);
                                        // Auto-select Business Address state
                                        if (selected) setState(selected);
                                    }}
                                    className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] appearance-none focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                >
                                    <option value="" disabled>Search state...</option>
                                    {[
                                        "Delaware", "Wyoming", "Florida", "Texas", "Nevada", 
                                        "New York", "California", "New Mexico", "Washington"
                                    ].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096] pointer-events-none" />
                            </div>
                        </div>

                        {/* Business Name Section */}
                        <div className="space-y-3">
                            <label className="text-[16px] md:text-[18px] font-[600] text-[#2D3748] px-2">Business Name</label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Enter Business Name"
                                className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                            />
                        </div>

                        {/* Business Address Section */}
                        <div className="space-y-3">
                            <label className="text-[16px] md:text-[18px] font-[600] text-[#2D3748] px-2">Business Address</label>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={businessAddress}
                                    onChange={(e) => setBusinessAddress(e.target.value)}
                                    placeholder="Enter Business Address"
                                    className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                    />
                                    <div className="relative">
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] appearance-none focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                        >
                                            <option value="">State</option>
                                            {[
                                                "Delaware", "Wyoming", "Florida", "Texas", "Nevada", 
                                                "New York", "California", "New Mexico", "Washington"
                                            ].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E4246] pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value.slice(0, 12))}
                                        placeholder="ZIP Code"
                                        maxLength={12}
                                        className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                    />
                                    {/* Searchable Country Dropdown */}
                                    <div className="relative" ref={countryRef}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCountryDropdown(prev => !prev);
                                                setCountrySearch("");
                                            }}
                                            className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-left focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all flex items-center justify-between"
                                        >
                                            <span className={country ? "text-[#4A5568]" : "text-[#A0AEC0]"}>
                                                {country || "Country"}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[#3E4246] transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                                        </button>

                                        {showCountryDropdown && (
                                            <div className="absolute z-50 mt-2 w-full bg-white border border-[#E2E8F0] rounded-[20px] shadow-xl overflow-hidden">
                                                {/* Search Input */}
                                                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0]">
                                                    <Search className="w-4 h-4 text-[#A0AEC0] shrink-0" />
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        placeholder="Search country..."
                                                        className="flex-1 text-[14px] text-[#4A5568] placeholder-[#A0AEC0] outline-none bg-transparent"
                                                    />
                                                </div>
                                                {/* Country List */}
                                                <ul className="max-h-[200px] overflow-y-auto">
                                                    {filteredCountries.length > 0 ? filteredCountries.map(c => (
                                                        <li
                                                            key={c}
                                                            onClick={() => {
                                                                setCountry(c);
                                                                setShowCountryDropdown(false);
                                                                setCountrySearch("");
                                                            }}
                                                            className={`px-5 py-3 text-[14px] cursor-pointer hover:bg-[#EBF4FF] transition-colors ${
                                                                country === c ? "bg-[#EBF4FF] text-[#193D66] font-semibold" : "text-[#4A5568]"
                                                            }`}
                                                        >
                                                            {c}
                                                        </li>
                                                    )) : (
                                                        <li className="px-5 py-3 text-[14px] text-[#A0AEC0]">No results found</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ownership Details Section */}
                        <div className="space-y-4 pt-2">
                            <h2 className="text-[16px] md:text-[18px] font-[600] text-[#2D3748] px-2">Ownership Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative ">
                                    <input
                                        type="number"
                                        value={numMembers}
                                        onChange={(e) => setNumMembers(e.target.value === "" ? "" : parseInt(e.target.value))}
                                        placeholder="Number of Members"
                                        className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                                        <button
                                            onClick={() => setNumMembers(prev => (typeof prev === "number" ? prev + 1 : 1))}
                                            className="hover:text-[#193D66] transition-colors"
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#3E4246] rotate-180 -mb-1" />
                                        </button>
                                        <button
                                            onClick={() => setNumMembers(prev => (typeof prev === "number" ? Math.max(0, prev - 1) : 0))}
                                            className="hover:text-[#3E4246] transition-colors"
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#3E4246]" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={numShareholders}
                                        onChange={(e) => setNumShareholders(e.target.value === "" ? "" : parseInt(e.target.value))}
                                        placeholder="Number of Shareholders"
                                        className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                                        <button
                                            onClick={() => setNumShareholders(prev => (typeof prev === "number" ? prev + 1 : 1))}
                                            className="hover:text-[#193D66] transition-colors"
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#3E4246] rotate-180 -mb-1" />
                                        </button>
                                        <button
                                            onClick={() => setNumShareholders(prev => (typeof prev === "number" ? Math.max(0, prev - 1) : 0))}
                                            className="hover:text-[#193D66] transition-colors"
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#3E4246]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registered Agent Section */}
                        {/* <div className="space-y-4 pt-2">
                            <h2 className="text-[16px] md:text-[18px] font-[600] text-[#2D3748] px-2">Registered Agent</h2>
                            <div className="space-y-4">
                                <div
                                    onClick={() => setRegAgentType("included")}
                                    className="flex items-center space-x-3 cursor-pointer group px-2"
                                >
                                    {regAgentType === "included" ? (
                                        <div className="w-7 h-7 rounded-full bg-[#193D66] flex items-center justify-center shadow-sm">
                                            <Check className="w-5 h-5 text-white stroke-[3]" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full border-2 border-[#E2E8F0] transition-all group-hover:border-[#193D66]" />
                                    )}
                                    <span className={`text-[16px] transition-colors ${regAgentType === "included" ? "text-[#193D66] " : "text-[#4A5568]"}`}>
                                        Use included Registered Agent
                                    </span>
                                </div>
                                <div
                                    onClick={() => setRegAgentType("own")}
                                    className="flex items-center space-x-3 cursor-pointer group px-2"
                                >
                                    {regAgentType === "own" ? (
                                        <div className="w-7 h-7 rounded-full bg-[#193D66] flex items-center justify-center shadow-sm">
                                            <Check className="w-5 h-5 text-white stroke-[3]" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full border-2 border-[#E2E8F0] transition-all group-hover:border-[#193D66]" />
                                    )}
                                    <span className={`text-[16px] transition-colors ${regAgentType === "own" ? "text-[#193D66] " : "text-[#4A5568]"}`}>
                                        Provide my own Registered Agent
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <input
                                    type="text"
                                    value={regAgentName}
                                    onChange={(e) => setRegAgentName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                />
                                <input
                                    type="text"
                                    value={regAgentAddress}
                                    onChange={(e) => setRegAgentAddress(e.target.value)}
                                    placeholder="Address"
                                    className="w-full px-6 py-4 bg-[#193D66]/4 border border-[#E2E8F0] rounded-[32px] text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all"
                                />
                            </div>
                        </div> */}
                    </div>

                    {/* Continue Button */}
                    <div className="w-full max-w-[867px] flex justify-center pt-12 pb-6">
                        <button
                            onClick={() => {
                                // Production-level validation
                                if (!formationState) {
                                    toast.error("Please select a State of Formation");
                                    return;
                                }
                                if (!businessName.trim()) {
                                    toast.error("Business Name is required");
                                    return;
                                }
                                if (initialBusinessName && businessName.trim().toLowerCase() !== initialBusinessName.trim().toLowerCase()) {
                                    toast.error(`Business Name must match the name provided earlier: "${initialBusinessName}"`);
                                    return;
                                }
                                if (!businessAddress.trim()) {
                                    toast.error("Business Address is required");
                                    return;
                                }
                                if (!city.trim()) {
                                    toast.error("City is required");
                                    return;
                                }
                                if (!state) {
                                    toast.error("Please select a State");
                                    return;
                                }
                                if (!zipCode.trim()) {
                                    toast.error("ZIP Code is required");
                                    return;
                                }
                                if (!country) {
                                    toast.error("Please select a Country");
                                    return;
                                }

                                onNext({
                                    stateOfFormation: formationState,
                                    entityType,
                                    businessName,
                                    businessAddress,
                                    city,
                                    state,
                                    zipCode,
                                    country,
                                    numMembers: numMembers === "" ? 0 : numMembers,
                                    numShareholders: numShareholders === "" ? 0 : numShareholders,
                                    regAgentType,
                                    regAgentName,
                                    regAgentAddress
                                });
                            }}
                            className="w-full max-w-[480px] cursor-pointer py-4 bg-[#3B87FA] text-white rounded-full font-bold text-[18px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/10"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
