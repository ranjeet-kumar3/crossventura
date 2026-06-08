"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "sonner";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


interface YourDetailsProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    user?: {
        name?: string;
        email?: string;
        phone?: string;
    };
}

const getCountryISO = (countryName: string) => {
    if (!countryName) return 'us';
    const mapping: Record<string, string> = {
        "india": "in",
        "united states": "us",
        "united kingdom": "gb",
        "canada": "ca",
        "australia": "au",
        "germany": "de",
        "france": "fr",
        "singapore": "sg",
        "japan": "jp",
        "south korea": "kr",
        "korea, south": "kr",
        "united arab emirates": "ae",
        "italy": "it",
        "spain": "es",
    };
    return mapping[countryName.toLowerCase()] || 'us';
};

const YourDetails: React.FC<YourDetailsProps> = ({ onNext, onBack, user }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        country: "",
        timezone: "",
        businessType: "",
        businessName: "",
        website: "",
    });

    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");

    const countries = [
        "United States", "India", "United Kingdom", "Canada", "United Arab Emirates",
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    const getTimezoneByCountry = (countryName: string) => {
        const lowerName = countryName.toLowerCase();
        if (lowerName === "india") return "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi";
        if (lowerName === "united states" || lowerName === "usa" || lowerName === "canada") return "(GMT-05:00) Eastern Time (US & Canada)";
        if (lowerName === "united kingdom") return "(GMT+00:00) London";
        if (lowerName === "united arab emirates" || lowerName === "qatar") return "(GMT+04:00) Dubai, Abu Dhabi";
        if (lowerName === "singapore") return "(GMT+08:00) Singapore, Hong Kong";
        if (lowerName === "australia") return "(GMT+10:00) Sydney, Melbourne";
        if (lowerName === "germany" || lowerName === "france" || lowerName === "italy" || lowerName === "spain") return "(GMT+01:00) Paris, Berlin, Rome";
        if (lowerName === "japan" || lowerName === "korea, south" || lowerName === "south korea") return "(GMT+09:00) Tokyo, Seoul";
        return "";
    };

    const filteredCountries = countries.filter(c =>
        c.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handleCountrySelect = (country: string) => {
        let timezone = formData.timezone;

        // Auto-select timezone based on country
        if (country === "India") {
            timezone = "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi";
        } else if (country === "United States" || country === "USA" || country === "Canada") {
            timezone = "(GMT-05:00) Eastern Time (US & Canada)";
        } else if (country === "United Kingdom") {
            timezone = "(GMT+00:00) London";
        } else if (country === "United Arab Emirates" || country === "Qatar") {
            timezone = "(GMT+04:00) Dubai, Abu Dhabi";
        } else if (country === "Singapore") {
            timezone = "(GMT+08:00) Singapore, Hong Kong";
        } else if (country === "Australia") {
            timezone = "(GMT+10:00) Sydney, Melbourne";
        } else if (country === "Germany" || country === "France" || country === "Italy" || country === "Spain") {
            timezone = "(GMT+01:00) Paris, Berlin, Rome";
        } else if (country === "Japan" || country === "Korea, South") {
            timezone = "(GMT+09:00) Tokyo, Seoul";
        }

        setFormData({ ...formData, country, timezone });
        setIsCountryOpen(false);
        setCountrySearch("");
    };

    // Auto-fill user data
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name || "",
                email: prev.email || user.email || "",
                phoneNumber: "", // Keep phone input empty by default
            }));
        }
    }, [user]);

    const steps = [
        "Your Details",
        "Select Plan",
        "Add Services",
        "Business Details",
        "Payment",
        "Confirmation",
        "KYC",
    ];

    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        // Validation logic
        if (!formData.fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }
        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
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
        if (!formData.businessType) {
            toast.error("Please select a business type");
            return;
        }
        if (!formData.businessName.trim()) {
            toast.error("Business Name is required");
            return;
        }

        setIsLoading(true);
        try {
            localStorage.setItem('user_email', formData.email);
            const response = await fetch('/api/onboarding/your-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Something went wrong');
            }

            onNext(formData);
            toast.success("Details saved!");
        } catch (err: any) {
            toast.error(err.message);
            console.error('Onboarding save error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed  inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onBack}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1280px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12  z-10 animate-in fade-in zoom-in duration-300">
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
                <div className="flex flex-col items-center w-full max-w-[1196px] mx-auto overflow-y-auto max-h-[calc(100vh-260px)] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl md:text-[40px] font-[700]  text-[#1A202C] mb-3">
                            Tell us about you
                        </h1>
                        <p className="text-[#4A5568] text-[18px]">
                            This helps us set up your business the right way.
                        </p>
                    </div>

                    <div className="w-full max-w-[1140px]  space-y-3">
                        {/* Start a New Business Section */}
                        <div className=" max-w-[870px]  mx-auto ">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Start a New Business</h2>
                            <div className="space-y-2 ">
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        placeholder="Full Name*"
                                        className="w-full px-6 py-4 bg-[#193D66]/4 rounded-[32px] border-2 border-[#193D66]/8 focus:border-[#193D6614] focus:bg-white transition-all outline-none text-slate-800 text-[16px]"
                                        value={formData.fullName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, fullName: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        className="w-full px-6 py-4 bg-[#193D66]/4 rounded-[32px] border-2 border-[#E2E8F0] focus:border-[#193D6614] focus:bg-white transition-all outline-none text-slate-800 text-[16px]"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                        }}
                                    />
                                </div>
                                <p className="text-[13px] text-[#4285F4] px-1 font-medium">
                                    We&apos;ll send important account information here.
                                </p>
                                <div className="phone-input-container space-y-2">
                                    <PhoneInput
                                        country={getCountryISO(formData.country)}
                                        value={formData.phoneNumber}
                                        onChange={(phone, countryData: any) => {
                                            const rawCountryName = countryData?.name || "";
                                            const matchedCountry = countries.find(c => c.toLowerCase() === rawCountryName.toLowerCase()) || rawCountryName;
                                            const mappedTimezone = getTimezoneByCountry(matchedCountry);

                                            setFormData(prev => ({
                                                ...prev,
                                                phoneNumber: phone,
                                                country: matchedCountry || prev.country,
                                                timezone: mappedTimezone || prev.timezone
                                            }));
                                        }}
                                        placeholder="International Number*"
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            autoFocus: false
                                        }}
                                        containerClass="w-full"
                                        inputClass="w-full"
                                    />

                                    {/* Searchable Country Select */}
                                    <div className="relative">
                                        <div
                                            className={`w-full px-6 py-[18px] bg-[#193D66]/4 rounded-[32px] border-2 border-[#193D66]/8 transition-all cursor-pointer flex justify-between items-center ${isCountryOpen ? "border-[#3B87FA] bg-white" : ""}`}
                                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                                        >
                                            <span className={formData.country ? "text-[#1e293b] font-medium" : "text-slate-400"}>
                                                {formData.country || "Country*"}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[#3E4246] transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                                        </div>

                                        {isCountryOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-[24px] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="p-3 border-b border-[#F1F5F9]">
                                                    <input
                                                        type="text"
                                                        placeholder="Search country..."
                                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-full outline-none focus:border-[#3B87FA] transition-all text-[14px] text-black"
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                                    {filteredCountries.length > 0 ? (
                                                        filteredCountries.map((c) => (
                                                            <div
                                                                key={c}
                                                                className={`px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors text-[15px] font-medium ${formData.country === c ? "text-[#3B87FA] bg-blue-50/50" : "text-[#4A5568]"}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCountrySelect(c);
                                                                }}
                                                            >
                                                                {c}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-6 py-4 text-center text-slate-400 text-[14px]">
                                                            No countries found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timezone Select */}
                                    <div className="relative">
                                        <select
                                            className="w-full px-6 py-[18px] bg-[#193D66]/4 rounded-[32px] border-2 border-[#193D66]/8 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none text-[#1e293b] font-medium appearance-none cursor-pointer text-[16px]"
                                            value={formData.timezone || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, timezone: e.target.value });
                                            }}
                                        >
                                            <option value="" disabled>Timezone*</option>
                                            <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                                            <option value="(GMT-06:00) Central Time (US & Canada)">(GMT-06:00) Central Time (US & Canada)</option>
                                            <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                                            <option value="(GMT+00:00) London">(GMT+00:00) London</option>
                                            <option value="(GMT+01:00) Paris, Berlin, Rome">(GMT+01:00) Paris, Berlin, Rome</option>
                                            <option value="(GMT+04:00) Dubai, Abu Dhabi">(GMT+04:00) Dubai, Abu Dhabi</option>
                                            <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                            <option value="(GMT+08:00) Singapore, Hong Kong">(GMT+08:00) Singapore, Hong Kong</option>
                                            <option value="(GMT+09:00) Tokyo, Seoul">(GMT+09:00) Tokyo, Seoul</option>
                                            <option value="(GMT+10:00) Sydney, Melbourne">(GMT+10:00) Sydney, Melbourne</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E4246] pointer-events-none" />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Business Context Section */}
                        <div className="max-w-[870px] mx-auto  ">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Business Context</h2>
                            <div className="space-y-2">
                                <div className="relative">
                                    <select
                                        className="w-full px-6 py-4 bg-[#F8FAFC] rounded-[32px] border-2 border-[#193D66]/8 focus:border-[#193D6614] focus:bg-white transition-all outline-none text-[#1e293b] appearance-none cursor-pointer text-[15px]"
                                        value={formData.businessType}
                                        onChange={(e) => {
                                            setFormData({ ...formData, businessType: e.target.value });
                                        }}
                                    >
                                        <option value="" disabled>What type of business are you starting?</option>
                                        <option value="IT & Staffing">IT & Staffing</option>
                                        <option value="Import/Export">Import/Export</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="EdTech">EdTech</option>
                                        
                                        
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3E4246] pointer-events-none" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Business Name*"
                                    className="w-full px-6 py-4 bg-[#193D66]/4 rounded-[32px] border-2 border-[#193D66]/8 focus:border-[#193D6614] focus:bg-white transition-all outline-none text-slate-800 text-[16px]"
                                    value={formData.businessName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, businessName: e.target.value });
                                    }}
                                />
                                <input
                                    type="url"
                                    placeholder="Website (e.g., https://www.crossventura.com)"
                                    className="w-full px-6 py-4 bg-[#193D66]/4 rounded-[32px] border-2 border-[#193D66]/8 focus:border-[#193D6614] focus:bg-white transition-all outline-none text-slate-800 text-[16px]"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* Continue Button */}
                        <div className="pt-4 max-w-[480px] mx-auto">
                            <button
                                onClick={handleContinue}
                                disabled={isLoading}
                                className="w-full py-4  cursor-pointer px-8  bg-[#3B87FA] text-[#ffffff] rounded-full font-[400] text-[18px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
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

export default YourDetails;
