"use client";

import React from 'react';
import { Eye, Users, Headphones, Play } from 'lucide-react';

const Abtsection = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1296px] mx-auto px-6">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                    <div className="lg:col-span-5">
                        <h2 className="text-[40px] md:text-[52px] font-[800] text-[#2D3748] leading-[1.15] tracking-tight">
                            Your Partner for <br />
                            <span className="text-[#FFB800]">Global Growth</span>
                        </h2>
                    </div>
                    
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                        <p className="text-[#718096] text-[16px] md:text-[17px] leading-relaxed font-[450]">
                            CrossVentura is built to simplify the process of starting and managing a U.S. business from anywhere in the world. We combine technology with expert support to remove complexity and make global entrepreneurship accessible.
                        </p>
                        <p className="text-[#718096] text-[16px] md:text-[17px] leading-relaxed font-[450]">
                            From company formation to compliance, banking, and operations — we handle everything in one seamless flow. Our goal is to give founders clarity, speed, and confidence at every step.
                        </p>
                    </div>
                </div>

                {/* Feature Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {/* Transparent Pricing Card */}
                    <div className="bg-[#F7FAFC] rounded-[32px] p-10 flex items-center gap-6 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="bg-[#1A365D] p-4 rounded-[20px] flex-shrink-0 group-hover:bg-[#2D3748] transition-colors">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-[700] text-[#2D3748] mb-2">Transparent Pricing</h3>
                            <p className="text-[#718096] text-[15px] leading-snug">
                                No hidden fees — what you see is exactly what you pay.
                            </p>
                        </div>
                    </div>

                    {/* Expert Support Card */}
                    <div className="bg-[#F7FAFC] rounded-[32px] p-10 flex items-center gap-6 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="bg-[#1A365D] p-4 rounded-[20px] flex-shrink-0 group-hover:bg-[#2D3748] transition-colors">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-[700] text-[#2D3748] mb-2">Expert Support</h3>
                            <p className="text-[#718096] text-[15px] leading-snug">
                                Guidance from experienced professionals at every step.
                            </p>
                        </div>
                    </div>

                    {/* End-to-End Service Card */}
                    <div className="bg-[#F7FAFC] rounded-[32px] p-10 flex items-center gap-6 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                        <div className="bg-[#1A365D] p-4 rounded-[20px] flex-shrink-0 group-hover:bg-[#2D3748] transition-colors">
                            <Headphones className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-[700] text-[#2D3748] mb-2">End-to-End Service</h3>
                            <p className="text-[#718096] text-[15px] leading-snug">
                                From formation to banking and compliance — all in one place.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overlapping Images Section */}
                <div className="relative h-[450px] md:h-[650px] w-full max-w-[1100px] mx-auto">
                    {/* Back Image (The Team Discussion) */}
                    <div className="absolute left-0 top-0 w-[75%] h-[85%] z-0 animate-in fade-in slide-in-from-left-12 duration-1000">
                        <img 
                            src="/abt-team-1.png" 
                            alt="Our Team Collaborating" 
                            className="w-full h-full object-cover rounded-[32px] md:rounded-[48px] shadow-2xl"
                        />
                    </div>

                    {/* Front Image with Video Indicator (The Presentation) */}
                    <div className="absolute right-0 bottom-0 w-[55%] h-[75%] z-10 border-[10px] md:border-[15px] border-white rounded-[40px] md:rounded-[56px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                        <div className="relative w-full h-full overflow-hidden rounded-[32px] md:rounded-[48px]">
                            <img 
                                src="/abt-team-2.png" 
                                alt="Business Presentation" 
                                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/15 transition-colors cursor-pointer group">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1A365D] rounded-full flex items-center justify-center">
                                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Abtsection;
