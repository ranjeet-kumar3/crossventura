'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Mock admin login logic
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Admin login failed');
            }

            // Redirect to admin dashboard
            window.location.href = '/admin';

        } catch (error: any) {
            console.error('Admin Auth error:', error);
            setError(error.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Soft Ambient Background Elements - Premium Mesh Gradient Feel */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/30 to-indigo-300/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-violet-200/40 to-indigo-100/30 rounded-full blur-[120px]" />
            <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-sky-200/20 rounded-full blur-[90px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="w-full max-w-[460px] z-10 animate-in fade-in zoom-in-95 duration-500"
            >
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ rotate: -8, scale: 0.85 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 180, damping: 15 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-[#0266FF] to-[#4F46E5] rounded-[28px] mb-6 shadow-xl shadow-blue-500/20 border border-white/20"
                    >
                        <ShieldCheck className="w-12 h-12 text-white drop-shadow-md" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Login</h1>
                    <p className="text-slate-500 font-semibold text-[15px] tracking-wide">Secure Management Access</p>
                </div>

                {/* Main Login Card - Premium Glass-like Card Style */}
                <div className="bg-white/90 backdrop-blur-xl border border-slate-100/80 rounded-[20px] p-8 md:p-12 shadow-[0_30px_60px_rgba(15,23,42,0.06)] relative overflow-hidden">
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0266FF] via-blue-500 to-[#4F46E5]" />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4.5 bg-red-50/70 border border-red-100 text-red-600 rounded-2xl text-[13px] font-bold flex items-center gap-3"
                        >
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@crossventura.com"
                                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200/80 focus:border-[#0266FF] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none rounded-[32px] text-slate-900 placeholder:text-slate-400 font-semibold text-[15px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"> Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200/80 focus:border-[#0266FF] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none rounded-[32px] text-slate-900 placeholder:text-slate-400 font-semibold text-[15px] pr-14"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0266FF] transition-colors p-2.5 rounded-xl hover:bg-slate-100/50 active:scale-95"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-4.5 bg-gradient-to-r from-[#0266FF] to-[#4F46E5] hover:from-[#0055DD] hover:to-[#3F37C9] text-white font-bold rounded-[32px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-base tracking-wide">Login </span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-slate-900 text-sm font-bold transition-colors inline-flex items-center gap-2 group"
                        >
                            <span className="group-hover:-translate-x-1.5 transition-transform">←</span>
                            <span>Return to Hub</span>
                        </Link>
                    </div>
                </div>

                {/* System Badges */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-full shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] select-none">System Status: Operational</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-semibold tracking-wide select-none">
                        &copy; {new Date().getFullYear()} CrossVentura Security Portal. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
