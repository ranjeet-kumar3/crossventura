"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./auth/AuthModal";


const Hero = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = ["/banner-1.png", "/bannner-2.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Re-fetch user when modal closes (user might have just logged in)
  useEffect(() => {
    if (!user && !isAuthModalOpen) {
      fetchUser();
    }
  }, [isAuthModalOpen]);

  const handleLaunchClick = (e: React.MouseEvent) => {
    // If auth is still loading, wait
    if (status === "loading") {
      e.preventDefault();
      return;
    }

    // Check both manual and NextAuth sessions
    const currentUser = user || session?.user;
    const isLoggedIn = !!currentUser;

    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section className="relative w-full md:h-[calc(100vh-80px)] md:min-h-[calc(100vh-80px)] xl:min-h-[calc(100vh-140px)] md:flex md:items-center py-16 lg:py-24 bg-[#FFFFFF] overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-40 lg:mt-6 xl:mt-16  md:scale-85 lg:scale-80  xl:scale-100 md:origin-center lg:origin-left xl:origin-center 2xl:scale-130 2xl:origin-center 3xl:scale-180 3xl:origin-center transition-transform duration-500">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 lg:ml-10 xl:ml-0 xl:gap-22 2xl:gap-24">

          {/* Left Content */}
          <div className="w-full lg:w-[591px] xl:w-[591px] h-auto lg:h-[480px] xl:h-[450px] flex-none text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <span className="px-5 py-2 rounded-full bg-[#193D66]/4 text-[#050038] text-[12px] font-[400] border border-[#F2F2F2]">
                Powered by Expert Talent
              </span>
              <span className="px-5 py-2 rounded-full bg-white text-[#050038] text-[12px] font-[400] border border-[#F2F2F2] ">
                Built for U.S. Firms
              </span>
            </div>

            <h1 className="text-4xl md:text-[46px] lg:text-[38px] xl:text-[40px] 2xl:text-[46px] font-[800] text-[#1A202C] leading-[1.2] mb-6 xl:mb-2 2xl:mb-6 tracking-tight">
              EVERYTHING YOU NEED <br className="hidden md:block" />
              TO START AND RUN <br className="hidden md:block" />
              YOUR U.S. BUSINESS
            </h1>

            <p className="text-[#4A5568] text-[16px] md:text-[18px] lg:text-[20px] xl:text-[17px] 2xl:text-[20px] font-[400] leading-relaxed mb-10 xl:mb-6 2xl:mb-10 max-w-[540px] mx-auto lg:mx-0">
              Dedicated legal and financial professionals supporting your firm&apos;s operations — efficiently and cost-effectively
            </p>

            <Link
              href="/onboarding"
              onClick={handleLaunchClick}
              className="group w-full lg:w-[501px] xl:w-[520px] 2xl:w-[561px]  h-[47px] py-5 bg-gradient-to-r from-[#0266FF] to-[#3B87FA] hover:bg-[#3B87FA]  cursor-pointer text-[#ffffff] rounded-full text-[16px] md:text-[20px] font-[300] flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#0266FF] mx-auto lg:mx-0"
            >
              Launch Your Company <ArrowRight strokeWidth={1.5} className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>


            {/* Trust Metrics Bar */}
            <div className="mt-8 w-full sm:w-[453px] h-auto sm:h-[60px] py-3 sm:py-0 bg-[#f8fafc] rounded-[12px] flex flex-col sm:flex-row items-center justify-between px-6 mx-auto lg:mx-0 gap-3 sm:gap-0">
              <div className="flex flex-col items-start justify-center">
                <div className="flex gap-[2px] mb-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-[14px] h-[14px] fill-[#FFC107] text-[#FFC107]" />
                  ))}
                  <Star className="w-[14px] h-[14px] fill-transparent text-[#FFC107]" />
                </div>
                <span className="text-[11px] font-[400] text-[#1e293b] leading-none">Based on 5149+ reviews:</span>
              </div>
              <span className="text-[13px] font-[700] text-[#0f172a]">30 Days Setup</span>
              <span className="text-[13px] font-[700] text-[#0f172a]">99% Success Rate</span>
            </div>
          </div>

          {/* Right Image Content - CSS Animated Slider */}
          <div className="flex-1 relative w-full lg:w-[510px] mt-12 xl:mt-2 2xl:mt-12  lg:mt-0">
            <div className="relative w-full h-[450px] lg:h-[510px] xl:h-[450px] 2xl:h-[510px]  rounded-[20px] overflow-hidden shadow-[0_10px_20px_rgba(2,102,255,0.10)]  bg-white border-2 border-white/20">
              <img
                src="/banner-1.png"
                alt="Banner 1"
                className={`banner-image rounded-[26px] ${currentBanner === 0 ? 'banner-visible' : 'banner-hidden'}`}
              />
              <img
                src="/bannner-2.png"
                alt="Banner 2"
                className={`banner-image rounded-[32px] ${currentBanner === 1 ? 'banner-visible' : 'banner-hidden'}`}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-30 -z-10" />

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  );
};

export default Hero;

