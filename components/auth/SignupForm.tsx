'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, ChevronLeft, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { signIn } from "next-auth/react";
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';

interface SignupFormProps {
    onSwitch?: () => void;
    isModal?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitch, isModal = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showOtp && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOtp, timer]);

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...otpDigits];
        newDigits[index] = value.slice(-1);
        setOtpDigits(newDigits);
        setOtp(newDigits.join(''));

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsLoading(true);
        try {
            await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                })
            });
            setTimer(60);
            setCanResend(false);
            setOtpDigits(['', '', '', '', '', '']);
            setOtp('');
        } catch (err: any) {
            setError("Failed to resend code");
        } finally {
            setIsLoading(false);
        }
    };

    const [showCountryList, setShowCountryList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState({
        name: 'United States',
        code: '+1',
        flag: 'us'
    });

    const countries = [
        { name: 'India', code: '+91', flag: 'in', maxLength: 10 },
        { name: 'United States', code: '+1', flag: 'us', maxLength: 10 },
        { name: 'United Kingdom', code: '+44', flag: 'gb', maxLength: 10 },
        { name: 'United Arab Emirates', code: '+971', flag: 'ae', maxLength: 9 },
        { name: 'Canada', code: '+1', flag: 'ca', maxLength: 10 },
        { name: 'Australia', code: '+61', flag: 'au', maxLength: 9 },
        { name: 'Germany', code: '+49', flag: 'de', maxLength: 11 },
        { name: 'France', code: '+33', flag: 'fr', maxLength: 9 },
        { name: 'Singapore', code: '+65', flag: 'sg', maxLength: 8 },
        { name: 'Saudi Arabia', code: '+966', flag: 'sa', maxLength: 9 },
        { name: 'Qatar', code: '+974', flag: 'qa', maxLength: 8 },
        { name: 'Turkey', code: '+90', flag: 'tr', maxLength: 10 },
    ];

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Only allow numbers for phone field and enforce length
        if (name === 'phone') {
            if (!/^\d*$/.test(value)) return;
            const country = countries.find(c => c.code === selectedCountry.code);
            if (country && value.length > (country.maxLength || 15)) return;
        }
        if (name === 'password') {
            if (value.length > 0) {
                if (value.length < 8) {
                    setPasswordError("Password must be at least 8 characters long.");
                } else if (value.length > 32) {
                    setPasswordError("Password cannot be more than 32 characters long.");
                } else if (!/[A-Z]/.test(value)) {
                    setPasswordError("Password must contain at least one uppercase letter (A-Z).");
                } else if (!/[a-z]/.test(value)) {
                    setPasswordError("Password must contain at least one lowercase letter (a-z).");
                } else if (!/[0-9]/.test(value)) {
                    setPasswordError("Password must contain at least one number (0-9).");
                } else if (!/[\#\@\!\$\%\&\*]/.test(value)) {
                    setPasswordError("Password must contain at least one special character (# @ ! $ % & *).");
                } else if (/\s/.test(value)) {
                    setPasswordError("Password cannot contain spaces.");
                } else {
                    setPasswordError(null);
                }
            } else {
                setPasswordError(null);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!showOtp) {
            // Step 1: Signup
            const val = formData.password;
            let currentPasswordError = null;
            if (val.length < 8) {
                currentPasswordError = "Password must be at least 8 characters long.";
            } else if (val.length > 32) {
                currentPasswordError = "Password cannot be more than 32 characters long.";
            } else if (!/[A-Z]/.test(val)) {
                currentPasswordError = "Password must contain at least one uppercase letter (A-Z).";
            } else if (!/[a-z]/.test(val)) {
                currentPasswordError = "Password must contain at least one lowercase letter (a-z).";
            } else if (!/[0-9]/.test(val)) {
                currentPasswordError = "Password must contain at least one number (0-9).";
            } else if (!/[\#\@\!\$\%\&\*]/.test(val)) {
                currentPasswordError = "Password must contain at least one special character (# @ ! $ % & *).";
            } else if (/\s/.test(val)) {
                currentPasswordError = "Password cannot contain spaces.";
            }

            if (currentPasswordError) {
                setPasswordError(currentPasswordError);
                setError(currentPasswordError);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            const currentCountry = countries.find(c => c.name === selectedCountry.name);
            if (currentCountry && formData.phone.length !== (currentCountry.maxLength || 10)) {
                setError(`Please enter a valid ${currentCountry.maxLength}-digit phone number.`);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }

                setShowOtp(true);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Step 2: Verify OTP
            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        code: otp
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed');
                }

                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    if (onSwitch) {
                        onSwitch();
                    } else {
                        window.location.href = '/login';
                    }
                }, 2000);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const formContent = (
        <div className="w-full max-w-[1076px] xl:max-w-[800px] 2xl:max-w-[1100px] transition-all lg:mx-auto xl:mx-auto 2xl:mx-0">
            {/* Header */}
            <div className="text-center mb-8  md:mb-4">
                <h1 className="text-[32px] md:text-[40px] font-[700] text-[#1e293b] mb-2 tracking-tight">
                    {showOtp ? "Verify Your Number" : "Create your CrossVentura account"}
                </h1>
                <p className="text-[#64748b] text-[16px] md:text-[18px] font-[400] mb-2">
                    {showOtp ? "We've sent a 6-digit code to Email" : "Start your global business in minutes"}
                </p>
                {!showOtp && (
                    <p className="text-[14px] md:text-[16px]">
                        <span className="text-[#64748b]">Already have an account? </span>
                        {onSwitch ? (
                            <button
                                onClick={onSwitch}
                                className="text-[#f59e0b] cursor-pointer font-bold hover:underline transition-all"
                            >
                                Sign in
                            </button>
                        ) : (
                            <Link href="/login" className="text-[#f59e0b] font-bold hover:underline transition-all">
                                Sign in
                            </Link>
                        )}
                    </p>
                )}
            </div>

            <div className="max-w-[720px] xl:max-w-[540px] 2xl:max-w-[660px] mx-auto transition-all">
                {error && (
                    <div className="p-4 mb-4 bg-red-50 border border-red-100 text-red-600 rounded-[16px]  text-[14px] font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 mb-4 bg-green-50 border border-green-100 text-green-600 rounded-[16px] text-[14px] font-medium">
                        Email verified successfully! Redirecting to login...
                    </div>
                )}

                {!showOtp ? (
                    <>
                        {/* Google Button */}
                        <button
                            onClick={() => signIn('google')}
                            type="button"
                            className="w-full flex items-center cursor-pointer justify-center gap-3 py-[16px] bg-[#193D66]/4 hover:bg-[#e2e8f0] border border-slate-100 transition-all rounded-[20px] text-[#1e293b] font-[500] text-[20px] mb-4 group"
                        >
                            <div className="w-7 h-10  relative group-hover:scale-110 transition-transform">
                                <Image
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-[1px] flex-1 bg-slate-200"></div>
                            <span className="text-[16px] text-[#94a3b8] font-[400] whitespace-nowrap px-4 tracking-wider">or sign up with email</span>
                            <div className="h-[1px] flex-1 bg-slate-200"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 xl:gap-y-3.5 2xl:gap-y-5">
                                {/* Full Name */}
                                <div className="md:col-span-2 space-y-1.5 text-start">
                                    <label className="text-[18px] font-[600] text-[#1e293b] ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full px-6 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-slate-50 focus:border-slate-200 focus:bg-white transition-all outline-none rounded-[32px] text-[#1e293b] placeholder:text-[#3E4246]/60 text-[16px] xl:text-[14px] 2xl:text-[16px] font-[400]"
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="md:col-span-2 space-y-1.5 text-start">
                                    <label className="text-[18px] font-[600] text-[#1e293b] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email address"
                                        className="w-full px-6 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-slate-50 focus:border-slate-200 focus:bg-white transition-all outline-none rounded-[32px] text-[#1e293b] placeholder:text-[#3E4246]/60 text-[16px] xl:text-[14px] 2xl:text-[16px] font-[400]"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="md:col-span-2 space-y-1.5 text-start">
                                    <label className="text-[18px] font-[600] text-[#1e293b] ml-1">Phone Number</label>
                                    <div className="flex relative">
                                        {/* Country Selector - Stable Container */}
                                        <div className="relative flex-shrink-0">
                                            <div
                                                onClick={() => setShowCountryList(!showCountryList)}
                                                className="flex items-center gap-2 px-4 py-4 xl:py-3 2xl:py-[18px] bg-[#ffffff] rounded-r-[2px] rounded-[32px] border border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors min-w-[125px] xl:min-w-[110px] justify-center z-20"
                                            >
                                                <img
                                                    src={`https://flagcdn.com/${selectedCountry.flag}.svg`}
                                                    alt={selectedCountry.name}
                                                    className="w-6 h-4 xl:w-5 xl:h-3.5 rounded-[1px] object-cover"
                                                />
                                                <span className="text-[15px] xl:text-[13px] 2xl:text-[15px] font-bold text-slate-700">{selectedCountry.code}</span>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showCountryList ? 'rotate-180' : ''}`} />
                                            </div>

                                            {/* Upward Dropdown */}
                                            {showCountryList && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-30"
                                                        onClick={() => setShowCountryList(false)}
                                                    />
                                                    <div className="absolute bottom-full left-0 mb-3 w-[280px] bg-white rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-40 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 origin-bottom-left">
                                                        <div className="p-3 border-b border-slate-50">
                                                            <input
                                                                type="text"
                                                                placeholder="Search..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                autoFocus
                                                                className="w-full px-4 py-2 bg-slate-50 rounded-xl text-[14px] outline-none"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="max-h-[250px] overflow-y-auto py-1 custom-scrollbar">
                                                            {filteredCountries.map((country) => (
                                                                <div
                                                                    key={country.name}
                                                                    onClick={() => {
                                                                        setSelectedCountry(country);
                                                                        setShowCountryList(false);
                                                                        setSearchQuery('');
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                                                >
                                                                    <img
                                                                        src={`https://flagcdn.com/${country.flag}.svg`}
                                                                        alt={country.name}
                                                                        className="w-5 h-3 rounded-[1px] object-cover"
                                                                    />
                                                                    <span className="flex-1 text-[14px] font-medium text-slate-700">{country.name}</span>
                                                                    <span className="text-[14px] font-bold text-slate-400">{country.code}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter number"
                                            className="flex-1 px-6 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-slate-50 focus:border-slate-200 focus:bg-white transition-all outline-none rounded-l-[2px] rounded-[32px] text-[#1e293b] placeholder:text-[#3E4246]/60 text-[15px] xl:text-[14px] 2xl:text-[16px] font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[18px] font-[600] text-[#1e293b] ml-1">Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="********"
                                            className="w-full px-6 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-slate-50 focus:border-slate-200 focus:bg-white transition-all outline-none rounded-[32px] text-[#1e293b] placeholder:text-slate-400 text-[15px] xl:text-[14px] 2xl:text-[16px] font-medium pr-14"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#193D66] transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {passwordError ? (
                                        <p className="text-red-500 text-[12px] font-medium mt-1.5 ml-4 animate-in fade-in slide-in-from-top-1">
                                            {passwordError}
                                        </p>
                                    ) : formData.password.length > 0 ? (
                                        <p className="text-green-500 text-[12px] font-medium mt-1.5 ml-4 animate-in fade-in slide-in-from-top-1">
                                            Strong password
                                        </p>
                                    ) : null}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5 text-start">
                                    <label className="text-[18px] font-[600] text-[#1e293b] ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="********"
                                            className="w-full px-6 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-slate-50 focus:border-slate-200 focus:bg-white transition-all outline-none rounded-[32px] text-[#1e293b] placeholder:text-slate-400 text-[15px] xl:text-[14px] 2xl:text-[16px] font-medium pr-14"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#193D66] transition-colors p-1"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex  items-center gap-3 pt-1 ml-1">
                                <div className="relative flex items-center pt-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        required
                                        className="w-5 h-5 rounded-[4px] border-[#193D66]/8 text-[#193d66] focus:ring-[#193d66] cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="terms" className="text-[16px] md:text-[16px] text-slate-500 font-[400] leading-tight">
                                    I agree to <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#f59e0b] font-[400] hover:underline transition-all">Terms & Conditions</Link> and <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#f59e0b] font-[400] hover:underline transition-all">Privacy Policy</Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 max-w-[480px] mx-auto">
                                <button
                                    disabled={isLoading}
                                    className="w-full py-[16px] bg-gradient-to-r from-[#0266FF] to-[#3B87FA] cursor-pointer hover:bg-[#3B87FA] text-white font-[400] rounded-[32px] shadow-2xl shadow-blue-900/20 transition-all text-[18px] flex items-center justify-center gap-2 transform active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 ">
                        <div className="flex justify-between gap-2 max-w-[480px] mx-auto">
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 md:w-16 md:h-14 text-center text-2xl font-bold border border-slate-200 rounded-[16px] bg-[#f8fafc] text-[#1e293b] focus:border-[#193D66] focus:bg-white focus:ring-2 focus:ring-[#193D6614] outline-none transition-all shadow-xs"
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <span className="text-slate-500 text-[15px]">Didn't receive the code?</span>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend}
                                className={`text-[15px] font-bold transition-colors ${canResend ? "text-[#193D66] hover:underline" : "text-slate-400 cursor-not-allowed"}`}
                            >
                                Resend OTP {timer > 0 && <span className="font-medium">({`00:${timer.toString().padStart(2, '0')}`})</span>}
                            </button>
                        </div>

                        <div className="pt-4 flex flex-col items-center gap-6">
                            <button
                                disabled={isLoading || otp.length < 6}
                                className="w-full py-[18px] bg-[#0266FF] hover:bg-[#3B87FA] text-white font-[800] rounded-[32px] shadow-2xl shadow-blue-900/20 transition-all text-[18px] flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Verify & Continue"
                                )}
                            </button>

                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowOtp(false)}
                                    className="text-[#0266FF] font-bold hover:underline transition-all text-[15px]"
                                >
                                    Change E-mail
                                </button>
                                <p className="text-slate-400 text-[13px] font-medium">
                                    Your number is secure and used only for verification
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

    if (isModal) {
        return formContent;
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 py-12 lg:py-8 xl:py-10 2xl:py-12 overflow-hidden">
            {/* Background - Home Page Content (Blurred) */}
            <div className="fixed inset-0 z-0 blur-[8px]  brightness-[0.7] scale-110 pointer-events-none select-none">
                <Hero />
                <div className="h-screen bg-[#1e293b]/20"></div>
            </div>

            {/* Overlay Overlay */}
            <div className="fixed inset-0 bg-[#0f172a]/40 z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                className="relative w-full max-w-[1156px] min-h-[820px] lg:min-h-[700px] xl:min-h-[740px] 2xl:min-h-[820px] bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 p-8 md:p-14 lg:p-10 xl:p-12 2xl:p-14 z-20 flex flex-col justify-center overflow-y-auto"
            >
                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-8 left-8 p-3 rounded-full hover:bg-slate-50 transition-all text-slate-800 border border-slate-100 shadow-sm group"
                >
                    <ChevronLeft className="w-7 h-7 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
                </Link>

                {formContent}
            </motion.div>
        </div>
    );
};

export default SignupForm;
