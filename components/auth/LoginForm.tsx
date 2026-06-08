'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { signIn } from "next-auth/react";
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';

interface LoginFormProps {
    onSwitch?: () => void;
    onForgotPassword?: () => void;
    isModal?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onForgotPassword, isModal = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Login with credentials
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }


            console.log('Login success:', data);
            window.location.href = '/';

        } catch (error: any) {
            console.error('Auth error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formContent = (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6 xl:mb-4">
                <h1 className="text-[32px] md:text-[40px] font-[700] text-[#334155] mb-2 tracking-tight">
                    Welcome to CrossVentura
                </h1>
                <p className="text-[#3E4246] text-[16px] md:text-[18px] mb-2 font-[400]">
                    Start and manage your global business — all in one place
                </p>
                <p className="text-[15px]">
                    <span className="text-[#3E4246] font-[400]">Don't have an account? </span>
                    {onSwitch ? (
                        <button
                            onClick={onSwitch}
                            className="text-[#f59e0b] font-[400] text-[18px] cursor-pointer hover:underline transition-all"
                        >
                            Sign up
                        </button>
                    ) : (
                        <Link href="/signup" className="text-[#f59e0b] font-[400] text-[18px] hover:underline transition-all">
                            Sign up
                        </Link>
                    )}
                </p>
            </div>

            <div className="max-w-[720px] xl:max-w-[480px] 2xl:max-w-[660px] mx-auto px-4 md:px-0">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-[12px] text-sm font-medium">
                        {error}
                    </div>
                )}

                <>
                    {/* Google Button */}
                    <button
                        onClick={() => signIn('google')}
                        type="button"
                        className="cursor-pointer w-full flex items-center justify-center gap-3 py-4 md:py-5 xl:py-4 bg-[#DEE5ED]/40 hover:bg-[#e2e8f0] transition-all rounded-[20px] text-[#334155] font-[500] text-[20px] mb-6 xl:mb-4 group"
                    >
                        <div className="w-6 h-6 relative group-hover:scale-110 transition-transform">
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
                    <div className="flex items-center gap-4 mb-10 xl:mb-6">
                        <div className="h-[1.5px] flex-1 bg-slate-200"></div>
                        <span className="text-[16px] text-[#94a3b8] font-[400] whitespace-nowrap px-4  tracking-tight">
                            Secure login • Your data is encrypted
                        </span>
                        <div className="h-[1.5px] flex-1 bg-slate-200"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-2 ">
                        <div className="space-y-4">
                            {/* Email Address */}
                            <div className="space-y-2 text-start">
                                <label className="text-[18px] font-[600] text-[#334155] ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email address"
                                    className="w-full px-8 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-transparent focus:border-[#193D66]/8 focus:bg-[#F2E4C9]/4 transition-all outline-none rounded-full text-[#334155] placeholder:text-slate-300 text-[16px] xl:text-[14px] 2xl:text-[16px] font-[400]"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2 text-start">
                                <label className="text-[18px] font-[600] text-[#334155] ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="********"
                                        className="w-full px-8 py-4 xl:py-3 2xl:py-[18px] bg-[#193D66]/4 border border-transparent focus:border-[#193D66]/8 focus:bg-[#F2E4C9]/4 transition-all outline-none rounded-full text-[#334155] placeholder:text-slate-300 text-[16px] xl:text-[14px] 2xl:text-[16px] font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 p-1 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-1.5 pt-1 ml-4 animate-in fade-in duration-500">
                                    <Lock className="w-3.5 h-3.5 text-green-500" />
                                    <p className="text-green-600/80 text-[12px] font-medium tracking-wide">
                                        Your password is secure and encrypted
                                    </p>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex justify-between items-center px-1">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={`w-6 h-6 border-2 rounded-[4px] transition-all flex items-center justify-center overflow-hidden ${rememberMe ? 'border-[#f59e0b] bg-[#f59e0b]' : 'border-slate-200 bg-[#f8fafc]'}`}>
                                        <motion.svg
                                            viewBox="0 0 24 24"
                                            className={`w-4 h-4 text-white fill-none stroke-current stroke-[4px] transition-all ${rememberMe ? 'scale-100' : 'scale-0'}`}
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </motion.svg>
                                    </div>
                                    <span className="text-[16px] cursor-pointer text-[#64748b] font-[400]">Remember me</span>
                                </button>
                                {onForgotPassword ? (
                                    <button
                                        type="button"
                                        onClick={onForgotPassword}
                                        className="text-[16px] cursor-pointer text-[#f59e0b] hover:underline font-[400] transition-all"
                                    >
                                        Forgot password
                                    </button>
                                ) : (
                                    <Link href="/forgot-password" className="text-[15px] cursor-pointer text-[#f59e0b] hover:underline font-bold transition-all">
                                        Forgot password
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Login Button */}
                        <div className="pt-2 flex flex-col items-center gap-2">
                            <button
                                disabled={isLoading}
                                className="w-full md:w-[480px] cursor-pointer py-4 xl:py-3.5 2xl:py-[18px] bg-gradient-to-r from-[#0266FF] to-[#3B87FA] hover:bg-[#132d4a] text-[#FFFFFF] font-[400] rounded-full shadow-lg transition-all text-[18px] xl:text-[16px] 2xl:text-[18px] flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                            {/* <span className="text-[16px] text-green-600/80 font-[400] tracking-tight flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Secure login • Your data is encrypted
                            </span> */}
                        </div>
                    </form>
                </>
            </div>
        </div>
    );


    if (isModal) {
        return formContent;
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 py-6 lg:py-6 xl:py-6 2xl:py-12 overflow-hidden bg-[#F8FAFC]">
            {/* Background - Home Page Content (Blurred) */}
            <div className="fixed inset-0 z-0 blur-[8px] brightness-[0.7] scale-110 pointer-events-none select-none">
                <Hero />
                <div className="h-screen bg-[#1e293b]/20"></div>
            </div>

            {/* Overlay Overlay */}
            <div className="fixed inset-0 bg-[#0f172a]/40 z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                className="relative w-full max-w-[1156px] xl:max-w-[860px] 2xl:max-w-[1156px] min-h-[820px] lg:min-h-[680px] xl:min-h-[680px] 2xl:min-h-[820px] bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 p-8 md:p-14 lg:p-10 xl:p-10 2xl:p-14 z-20 flex flex-col justify-center"
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

export default LoginForm;
