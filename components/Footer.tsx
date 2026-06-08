"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Footer() {
  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we are already on the homepage, smoothly scroll to the section
    if (window.location.pathname === "/") {
      e.preventDefault();
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="w-full bg-[#202021] text-white flex flex-col justify-center items-center h-auto lg:h-[513px] xl:h-[550px] 2xl:h-[600px] py-16 lg:py-0">
      <div className="w-full max-w-[1260px] xl:max-w-[1360px] 2xl:max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full justify-center">

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 2xl:gap-16 mb-8 lg:mb-10 xl:mb-12 mt-0 lg:mt-8">

          {/* Column 1: Brand & About */}
          <div className="lg:col-span-5 flex flex-col pr-0 lg:pr-12 xl:pr-20 2xl:pr-24">
            <div className="mb-0 flex flex-col items-start">
              {/* Logo / Globe Icon */}
              <div className="relative w-[100px] h-[100px] lg:w-[107px] lg:h-[107px] xl:w-[130px] xl:h-[130px] 2xl:w-[130px]  2xl:h-[130px] flex items-center justify-center ">
                <Image
                  src="/logoscross.png"
                  alt="CrossVentura Logo"
                  width={160}
                  height={160}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>

              {/* <span className="text-[20px] font-[700] tracking-tight leading-none mb-1">CrossVentura</span> */}
              {/* <span className="text-[8px] text-white/60 uppercase tracking-widest">Where Ventures Cross Borders</span> */}
            </div>

            <p className="text-[14px] 2xl:text-[20px] leading-[1.8] text-[#E2E8F0]">
              CrossVentura is a self-service platform for U.S.<br className="hidden lg:block" />
              business formation.<br />
              Start and manage your company seamlessly with<br className="hidden lg:block" />
              transparent pricing, fast processing, and end-to-end<br className="hidden lg:block" />
              support — from formation to banking and compliance
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[16px] 2xl:text-[18px] font-[700] mb-6 2xl:mb-8">Quick Links</h4>
            <ul className="flex flex-col space-y-3.5 2xl:space-y-5 text-[14px] 2xl:text-[16px] text-[#E2E8F0]">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li>
                <Link 
                  href="/#how-it-works" 
                  onClick={handleHowItWorksClick} 
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-[16px] 2xl:text-[18px] font-[700] mb-6 2xl:mb-8">Services</h4>
            <ul className="flex flex-col space-y-3.5 2xl:space-y-5 text-[14px] 2xl:text-[16px] text-[#E2E8F0]">
              <li><Link href="#" className="hover:text-white transition-colors">Company Formation (LLC, C-Corp, S-Corp)</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">EIN & Tax Registration</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Registered Agent Services</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Virtual Address & Mailbox</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Banking Assistance</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Accounting & Bookkeeping</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Warehousing & Fulfilment</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[16px] 2xl:text-[18px] font-[700] mb-6 2xl:mb-8">Legal</h4>
            <ul className="flex flex-col space-y-3.5 2xl:space-y-5 text-[14px] 2xl:text-[16px] text-[#E2E8F0]">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="w-full border-t border-white/20 mb-8 mt-6"></div>

        {/* Copyright */}
        <div className="text-center text-[14px] 2xl:text-[16px] text-white/70">
          © 2026 CrossVentura. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;