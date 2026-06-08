'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ChevronLeft, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';

interface ForgotPasswordFormProps {
    onBack?: () => void;
    isModal?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, isModal = false }) => {
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess("If an account exists, a reset code has been sent.");
            setStep('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);

        if (password.length < minLength) return "Password must be at least 8 characters long";
        if (!hasUpper) return "Password must contain at least one uppercase letter";
        if (!hasLower) return "Password must contain at least one lowercase letter";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecial) return "Password must contain at least one special character (@$!%*?&)";
        
        return null;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                if (onBack) {
                    onBack();
                } else {
                    window.location.href = '/login';
                }
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formContent = (
        <div className="w-full max-w-[500px] mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-[32px] md:text-[40px] font-[700] text-[#1e293b] mb-2 tracking-tight">
                    {step === 'email' ? "Forgot Password?" : "Reset Password"}
                </h1>
                <p className="text-[#64748b] text-[16px] md:text-[18px]">
                    {step === 'email' 
                        ? "Enter your email to receive a reset code" 
                        : `We've sent a code to ${email}`}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-[16px] text-sm font-medium">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-[16px] text-sm font-medium">
                    {success}
                </div>
            )}

            {step === 'email' ? (
                <form onSubmit={handleSendCode} className="space-y-6">
                    <div className="space-y-2 text-start">
                        <label className="text-[18px] font-[700] text-[#1e293b] ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="w-full pl-14 pr-8 py-5 bg-[#f8fafc] border-[3px] border-[#193D66]/4 focus:border-[#193D66]/8 focus:bg-white transition-all outline-none rounded-full text-[#1e293b] text-[16px] font-medium"
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full py-5 bg-[#0266FF] hover:bg-[#3B87FA] text-white font-[700] rounded-full shadow-lg transition-all text-[18px] flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Send Reset Code"
                        )}
                    </button>

                    <div className="text-center">
                        {onBack ? (
                            <button 
                                type="button"
                                onClick={onBack}
                                className="text-[#f59e0b] font-bold hover:underline transition-all"
                            >
                                Back to login
                            </button>
                        ) : (
                            <Link href="/login" className="text-[#f59e0b] font-bold hover:underline transition-all">
                                Back to login
                            </Link>
                        )}
                    </div>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-4">
                        {/* OTP Code */}
                        <div className="space-y-2 text-start">
                            <label className="text-[14px] font-[700] text-[#1e293b] ml-1">Reset Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                className="w-full px-8 py-4 bg-[#f8fafc] border border-transparent focus:border-slate-100 focus:bg-white transition-all outline-none rounded-full text-[#1e293b] text-center text-[24px] font-bold tracking-[0.5em]"
                            />
                        </div>

                        {/* New Password */}
                        <div className="space-y-2 text-start">
                            <label className="text-[14px] font-[700] text-[#1e293b] ml-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="********"
                                className="w-full px-8 py-4 bg-[#f8fafc] border border-transparent focus:border-slate-100 focus:bg-white transition-all outline-none rounded-full text-[#1e293b]"
                            />
                            <p className="text-[11px] text-slate-400 ml-4">
                                Min. 8 characters, with Uppercase, Lowercase, Number & Special Char.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2 text-start">
                            <label className="text-[14px] font-[700] text-[#1e293b] ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="********"
                                className="w-full px-8 py-4 bg-[#f8fafc] border border-transparent focus:border-slate-100 focus:bg-white transition-all outline-none rounded-full text-[#1e293b]"
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full py-5 bg-[#0266FF] cursor-pointer  hover:bg-[#3B87FA] text-white font-[700] rounded-full shadow-lg transition-all text-[18px] flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    <button 
                        type="button"
                        onClick={() => setStep('email')}
                        className="w-full text-slate-400 font-medium hover:text-slate-600 transition-colors"
                    >
                        Try with different email
                    </button>
                </form>
            )}

            <div className="mt-8 flex items-center justify-center gap-3 text-[#94a3b8] text-[12px] font-bold uppercase tracking-tight">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure password recovery</span>
            </div>
        </div>
    );

    if (isModal) {
        return formContent;
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 py-12 overflow-hidden bg-[#F8FAFC]">
            {/* Background - Home Page Content (Blurred) */}
            <div className="fixed inset-0 z-0 blur-[8px] brightness-[0.7] scale-110 pointer-events-none select-none">
                <Hero />
                <div className="h-screen bg-[#1e293b]/20"></div>
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 bg-[#0f172a]/40 z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                className="relative w-full max-w-[1156px] min-h-[700px] bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 p-8 md:p-14 z-20 flex flex-col justify-center"
            >
                {/* Back Button */}
                <Link
                    href="/login"
                    className="absolute top-8 left-8 p-3  rounded-full hover:bg-slate-50 transition-all text-slate-800 border border-slate-100 shadow-sm group"
                >
                    <ChevronLeft className="w-7 h-7 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
                </Link>

                {formContent}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordForm;
