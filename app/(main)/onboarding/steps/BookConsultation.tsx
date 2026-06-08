"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, CheckCircle2, Globe, Clock, ChevronDown, Search, X, Mail, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import ProgressBar from "@/components/ProgressBar";
import { MANAGE_FLOW_STEPS, START_FLOW_STEPS } from "../config/steps";
import { toast } from "sonner";

interface BookConsultationProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    steps?: string[];
    currentStepIndex?: number;
}

const BookConsultation: React.FC<BookConsultationProps> = ({ onNext, onBack, steps, currentStepIndex }) => {
    const { data: session } = useSession();
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedTimeZone, setSelectedTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
    const [timezoneSearch, setTimezoneSearch] = useState("");
    const [isBooked, setIsBooked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessLoading, setIsSuccessLoading] = useState(false);

    // Fallback if not provided by parent
    const displaySteps = steps || MANAGE_FLOW_STEPS;
    const displayIndex = currentStepIndex !== undefined ? currentStepIndex : 3;

    // Start live clock for timezone component
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second for smoother feel
        return () => clearInterval(timer);
    }, []);

    // Timezone List & Search
    const allTimezones = useMemo(() => {
        try {
            return (Intl as any).supportedValuesOf('timeZone');
        } catch (e) {
            return ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"];
        }
    }, []);

    const timezoneOptions = useMemo(() => {
        return allTimezones.map((tz: string) => {
            const date = new Date();
            const offsetParts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'longOffset'
            }).formatToParts(date);
            const offset = offsetParts.find(p => p.type === 'timeZoneName')?.value || "";

            const nameParts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'long'
            }).formatToParts(date);
            const longName = nameParts.find(p => p.type === 'timeZoneName')?.value || tz;

            // Add standard search keywords to make searching extremely easy!
            let extraKeywords = "";
            const tzLower = tz.toLowerCase();
            if (tzLower.startsWith("america/") || tzLower.startsWith("us/") || tzLower.includes("honolulu")) {
                extraKeywords = " us usa united states unitedstates america";
            } else if (tzLower.startsWith("asia/kolkata") || tzLower.includes("calcutta")) {
                extraKeywords = " india ind ist kolkata mumbai delhi chennai";
            } else if (tzLower.startsWith("europe/london") || tzLower.includes("london")) {
                extraKeywords = " uk united kingdom unitedkingdom gb gbr london bst gmt";
            } else if (tzLower.startsWith("europe/paris") || tzLower.startsWith("europe/berlin") || tzLower.startsWith("europe/rome")) {
                extraKeywords = " europe paris berlin rome cet cest";
            } else if (tzLower.startsWith("asia/dubai") || tzLower.includes("dubai")) {
                extraKeywords = " uae dubai abu dhabi abudhabi";
            } else if (tzLower.startsWith("asia/singapore") || tzLower.includes("singapore")) {
                extraKeywords = " singapore sg sgp";
            }

            return { value: tz, offset, longName, searchTerms: (tz + " " + longName + extraKeywords).toLowerCase(), label: tz.replace(/_/g, " ").split('/').pop() };
        });
    }, [allTimezones]);

    const filteredTimezones = useMemo(() => {
        const search = timezoneSearch.toLowerCase();
        return timezoneOptions.filter((tz: any) =>
            tz.searchTerms.includes(search)
        );
    }, [timezoneOptions, timezoneSearch]);

    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Dynamic Calendar Generation
    const { calendarDays, monthName, yearName } = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // JS getDay() -> 0: Sun, 1: Mon ... 6: Sat
        // We want 0: Mon ... 6: Sun
        let startDayIndex = firstDayOfMonth.getDay() - 1;
        if (startDayIndex === -1) startDayIndex = 6;

        const daysArr: (number | null)[] = [];
        for (let i = 0; i < startDayIndex; i++) daysArr.push(null);
        for (let i = 1; i <= daysInMonth; i++) daysArr.push(i);

        const mName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentMonth);
        const yName = currentMonth.getFullYear();

        return { calendarDays: daysArr, monthName: mName, yearName: yName };
    }, [currentMonth]);

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDateSelect = (day: number) => {
        setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    };

    const timeSlots = [
        "12:00 AM",
        "12:30 AM",
        "01:00 AM",
        "01:30 AM",
        "02:00 AM",
        "02:30 AM",
        "03:00 AM",
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM"
    ];

    const handleSetDate = () => {
        if (selectedDate) {
            toast.success(`Date confirmed: ${selectedDateInputStr}! Now please select a time slot.`);
        }
    };

    const handleContinue = async () => {
        if (!selectedTime || !selectedDate) {
            toast.error("Please select a date and time slot first.");
            return;
        }

        if (!isBooked) {
            setIsLoading(true);
            try {
                const response = await fetch("/api/onboarding/consultation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: selectedDateInputStr,
                        time: selectedTime,
                        timezone: selectedTimeZone,
                    }),
                });

                if (response.ok) {
                    setIsBooked(true);
                } else {
                    const data = await response.json();
                    toast.error(data.message || "Something went wrong. Please try again.");
                }
            } catch (error) {
                console.error("Booking Error:", error);
                toast.error("Failed to book consultation. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        } else {
            onNext({
                date: selectedDateInputStr,
                time: selectedTime,
                timezone: selectedTimeZone,
                type: 'consultation'
            });
        }
    };

    // Timezone Formatting for Display
    const formattedTime = currentTime
        ? new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: selectedTimeZone
        }).format(currentTime)
        : "--:--:-- --";

    const { tzOffsetStr, tzLong, tzAbbr } = useMemo(() => {
        const date = new Date();
        const partsLong = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimeZone, timeZoneName: 'long' }).formatToParts(date);
        const partsShort = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimeZone, timeZoneName: 'short' }).formatToParts(date);
        const partsOffset = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimeZone, timeZoneName: 'longOffset' }).formatToParts(date);

        return {
            tzLong: partsLong.find(p => p.type === 'timeZoneName')?.value || selectedTimeZone,
            tzAbbr: partsShort.find(p => p.type === 'timeZoneName')?.value || "",
            tzOffsetStr: partsOffset.find(p => p.type === 'timeZoneName')?.value || "UTC"
        };
    }, [selectedTimeZone]);

    const selectedDateStr = selectedDate
        ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDate)
        : "Select a date";

    const selectedDateInputStr = selectedDate
        ? `${String(selectedDate.getDate()).padStart(2, '0')} / ${String(selectedDate.getMonth() + 1).padStart(2, '0')} / ${selectedDate.getFullYear()}`
        : "Select Date";


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[1398px]  mx-auto h-[900px] bg-white rounded-[20px] shadow-2xl relative p-8 md:p-14 z-10 overflow-hidden"
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors z-20"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                <ProgressBar steps={displaySteps} currentStepIndex={displayIndex} />

                {!isBooked ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-[40px] font-[700] text-[#2D3748] mb-2 tracking-tight">
                                Book Your Consultation
                            </h1>
                            <p className="text-[#3E4246] text-[18px] max-w-[800px] mx-auto font-[400]">
                                Schedule a 30-minute session with our experts to set up your business bank account.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 max-w-[1260px] mx-auto items-center">
                            {/* Left: Details */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-[32px] font-[800] text-[#2D3748] leading-[1.1]">
                                        Select Timezone
                                    </h2>
                                    <div
                                        onClick={() => setIsTimezoneOpen(true)}
                                        className="bg-[#F8FAFC] border border-slate-100 rounded-[32px] p-5 flex items-center gap-4 w-[400px] h-[110px] relative group cursor-pointer hover:border-[#0266FF]/30 hover:bg-white hover:shadow-md transition-all active:scale-[0.99]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 shrink-0 relative  transition-colors">
                                            <Globe className="w-6 h-6 text-[#0266FF]" />
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <Clock className="w-3.5 h-3.5 text-[#0266FF]" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[14px] text-slate-500 font-medium">Timezone*</p>
                                                <p className="text-[13px] text-[#0266FF] font-semibold">{tzOffsetStr}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <h4 className="text-[16px] font-bold text-[#2D3748] truncate" title={tzLong}>
                                                    {tzAbbr ? `${tzAbbr} (${tzLong})` : tzLong}
                                                </h4>
                                                <p className="text-[13px] text-slate-400 font-medium tabular-nums">{formattedTime}</p>
                                            </div>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-slate-400 ml-1 shrink-0 group-hover:text-[#0266FF] transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Center: Calendar */}
                            <div className="lg:col-span-4 flex justify-center">
                                <div className="bg-white border border-slate-100 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 w-[318px] h-[420px]">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                            <ChevronLeft className="w-4 h-4 text-slate-400" />
                                        </button>
                                        <span className="font-bold text-[#2D3748] text-[17px]">{monthName} {yearName}</span>
                                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>

                                    {/* Day Headers */}
                                    <div className="grid grid-cols-7 text-center text-[12px] font-bold text-slate-400 mb-2">
                                        {days.map((day) => (
                                            <div key={day} className="py-1">{day}</div>
                                        ))}
                                    </div>

                                    {/* Dates Grid */}
                                    <div className="grid grid-cols-7 gap-y-1 ">
                                        {calendarDays.map((day, idx) => {
                                            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
                                            const isPast = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date(new Date().setHours(0, 0, 0, 0)) : false;

                                            return (
                                                <div key={idx} className="flex items-center justify-center">
                                                    {day !== null ? (
                                                        <button
                                                            disabled={isPast}
                                                            onClick={() => handleDateSelect(day)}
                                                            className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-bold transition-all
                                    ${isSelected
                                                                    ? "bg-[#0266FF] text-white shadow-md shadow-[#0266FF]/30 scale-105"
                                                                    : isPast ? "text-slate-300 cursor-not-allowed opacity-50" : "text-[#2D3748] hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    ) : (
                                                        <div className="w-9 h-9" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Calendar Footer Actions */}
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className="px-4 py-2 bg-[#F7FAFC] border border-slate-100 rounded-lg text-[#2D3748] font-medium text-[13px] flex-1 text-center">
                                            {selectedDateInputStr}
                                        </div>
                                        <button
                                            onClick={handleSetDate}
                                            className="px-5 py-2 bg-[#0266FF] text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-all shadow-md shadow-[#0266FF]/20"
                                        >
                                            Set Date
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Time Slots */}
                            <div className="lg:col-span-4 pl-4">
                                <h3 className="font-[600] text-[#2D3748] text-[16px] mb-4">
                                    {selectedDateStr}
                                </h3>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar hide-scrollbar  ">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`w-full py-3 rounded-full border text-[15px] font-medium transition-all flex items-center justify-center whitespace-nowrap
                            ${selectedTime === time
                                                    ? "bg-[#0266FF] text-white border-[#0266FF] shadow-lg shadow-[#0266FF]/10"
                                                    : "bg-[#F8FAFC] text-slate-400 border-slate-100 hover:border-slate-200 hover:bg-white"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Button */}
                        <div className="flex justify-center ">
                            <button
                                onClick={handleContinue}
                                disabled={isLoading}
                                className={`w-full max-w-[530px] py-[14px] bg-[#3B87FA] text-white rounded-full font-[400] text-[20px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-2xl shadow-[#193D66]/30 flex items-center justify-center gap-3 ${isLoading ? "opacity-80" : ""}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm Booking"
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center max-w-[1200px] mx-auto py-4">
                        {/* Success Icon */}
                        <div className="w-[72px] h-[72px] bg-[#22C55E] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100">
                            <Check className="w-12 h-12 text-white" strokeWidth={4} />
                        </div>

                        {/* Header */}
                        <h1 className="text-[24px] sm:text-[40px] lg:text-[40px] font-[700] text-[#2D3748] mb-1 text-center">Consultation Booked Successfully</h1>
                        <p className="text-[#3E4246] text-[20px] mb-6">Your session has been scheduled with our experts</p>

                        {/* Details Card */}
                        <div className="w-full bg-[#F8FAFC]/50 border border-slate-100 rounded-[32px] px-12 h-[132px] flex items-center justify-between mb-4 text-left">
                            <div className="flex-1">
                                <p className="text-slate-900 font-bold text-[20px] mb-1">Date: {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(selectedDate || new Date())}</p>
                                <p className="text-slate-500 text-[18px]">{new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(selectedDate || new Date())}</p>
                            </div>
                            <div className="flex-1 border-x border-slate-100/50 px-12 h-16 flex flex-col justify-center">
                                <p className="text-slate-900 font-bold text-[20px] mb-1">Time</p>
                                <p className="text-slate-500 text-[18px]">{selectedTime}</p>
                            </div>
                            <div className="flex-1 pl-12">
                                <p className="text-slate-900 font-bold text-[20px] mb-1">Duration</p>
                                <p className="text-slate-500 text-[18px]">30 minutes</p>
                            </div>
                        </div>

                        {/* Email strip */}
                        <div className="w-full bg-white border border-slate-100 rounded-[32px] px-6 h-[62px] flex items-center gap-4 mb-4 shadow-sm">
                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-slate-900 font-[800] text-[15px]">Confirmation Email Sent</p>
                                <p className="text-slate-500 text-[13px]">Check your inbox at <span className="font-bold text-[#3B87FA]">{session?.user?.email || "your email"}</span> for a reminder before your meeting.</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                setIsSuccessLoading(true);
                                onNext({
                                    date: selectedDateInputStr,
                                    time: selectedTime,
                                    timezone: selectedTimeZone,
                                    type: 'consultation'
                                });
                            }}
                            disabled={isSuccessLoading}
                            className={`w-full max-w-[480px] cursor-pointer py-[14px] bg-[#3B87FA] text-white rounded-full font-[400] text-[20px] transition-all shadow-xl shadow-blue-100 mb-2 flex items-center justify-center gap-2 ${
                                isSuccessLoading ? "opacity-80 cursor-wait" : "hover:bg-[#0266FF] active:scale-[0.98]"
                            }`}
                        >
                            {isSuccessLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Continue"
                            )}
                        </button>

                        <p className="text-[#3E4246] text-[16px] font-medium">Need help? <Link href="/contact" className="text-[#3B87FA] hover:underline cursor-pointer">Contact</Link>support anytime</p>
                    </div>
                )}
            </motion.div>

            {/* Timezone Selection Modal */}
            <AnimatePresence>
                {isTimezoneOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTimezoneOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-[24px] font-[800] text-[#2D3748]">Select Timezone</h3>
                                        <p className="text-slate-500 text-[14px]">Choose your preferred local time</p>
                                    </div>
                                    <button
                                        onClick={() => setIsTimezoneOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by city or country..."
                                        value={timezoneSearch}
                                        onChange={(e) => setTimezoneSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0266FF] focus:ring-4 focus:ring-[#0266FF]/5 transition-all text-[16px] text-[#1A1A1A] font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="space-y-1">
                                    {filteredTimezones.length > 0 ? (
                                        filteredTimezones.map((tz: any) => (
                                            <button
                                                key={tz.value}
                                                onClick={() => {
                                                    setSelectedTimeZone(tz.value);
                                                    setIsTimezoneOpen(false);
                                                    setTimezoneSearch("");
                                                }}
                                                className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group
                                                    ${selectedTimeZone === tz.value
                                                        ? "bg-[#F0F7FF] border-[#0266FF]/20 border shadow-sm"
                                                        : "hover:bg-slate-50 border border-transparent"
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <p className={`font-bold text-[16px] ${selectedTimeZone === tz.value ? "text-[#0266FF]" : "text-[#2D3748]"}`}>
                                                        {tz.value.split('/').pop().replace(/_/g, " ")}
                                                    </p>
                                                    <p className="text-[13px] text-slate-400">{tz.longName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-mono text-[14px] font-bold ${selectedTimeZone === tz.value ? "text-[#0266FF]" : "text-slate-500"}`}>
                                                        {tz.offset}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No timezones found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookConsultation;
