"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface WhoIsThisForProps {
  onNext: (data: { whoIsThisFor: string }) => void;
  onBack: () => void;
}

const WhoIsThisFor: React.FC<WhoIsThisForProps> = ({ onNext, onBack }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (selectedOption) {
      setIsLoading(true);
      onNext({ whoIsThisFor: selectedOption });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <style jsx global>{`
        body { overflow: hidden !important; }
      `}</style>
      {/* Backdrop */}
      <div
        onClick={onBack}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Content Container (Modal) */}
      <div className="w-full max-w-[1256px] max-h-[95vh] md:h-[914px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-4 sm:p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute left-4 top-4 md:left-8 md:top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors z-20"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
        </button>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center w-full max-w-[1218px] mx-auto pb-4">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-[700] text-[#1A202C] mb-2 sm:mb-4 mt-8 md:mt-0 text-center">
            Who is This For?
          </h1>
          <p className="text-[#3E4246] text-[15px] sm:text-[18px] lg:text-[18px] font-[400] leading-relaxed mb-8 md:mb-12 text-center px-2">
            Built for ambitious businesses and founders looking to start, expand, and operate in the U.S. seamlessly
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-[840px] xl:max-w-[740px] 2xl:max-w-[840px] w-full gap-4 sm:gap-6 px-2 sm:px-0">

            {/* Start a new business Card */}
            <div
              onClick={() => setSelectedOption("start")}
              className={`group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col bg-[#F8FAFC] w-full max-w-[400px] xl:max-w-[370px] 2xl:max-w-[400px] mx-auto h-auto sm:h-[450px] md:h-[500px] xl:h-[420px] 2xl:h-[500px] ${selectedOption === "start"
                ? "ring-1 ring-[#193D6614]"
                : "border-transparent hover:border-slate-200"
                }`}
            >
              <div className="absolute top-4 right-4 z-10">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOption === "start"
                  ? "bg-[#0266FF] border-[#0266FF]"
                  : "bg-white border-slate-300"
                  }`}>
                  {selectedOption === "start" && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
              <div className="w-full aspect-[4/3] sm:aspect-[4/3] md:h-[320px] xl:h-[280px] 2xl:h-[320px] relative bg-white flex items-center justify-center shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    src="/onboarding/image1.png"
                    alt="Start a new business"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-4 xl:pt-2 2xl:pt-4 flex-grow flex flex-col items-center">
                <h3 className="text-[20px] sm:text-[20px] xl:text-[20px] 2xl:text-[24px] font-bold text-[#1A202C] mb-2 sm:mb-2 text-center">
                  Start a new business
                </h3>
                <p className="text-[#3E4246] text-[15px] xl:text-[18px] 2xl:text-[18px] sm:text-[16px] leading-relaxed text-center">
                  Register a new company, choose your structure, and get everything set up from scratch.
                </p>
              </div>
            </div>

            {/* Manage an existing business Card */}
            <div
              onClick={() => setSelectedOption("manage")}
              className={`group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col bg-[#F8FAFC] w-full max-w-[400px] xl:max-w-[370px] 2xl:max-w-[400px] mx-auto h-auto sm:h-[450px] md:h-[500px] xl:h-[420px] 2xl:h-[500px] ${selectedOption === "manage"
                ? "ring-1 ring-[#193D6614]"
                : "border-transparent hover:border-slate-200"
                }`}
            >
              <div className="absolute top-4 right-4 z-10">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOption === "manage"
                  ? "bg-[#0266FF] border-[#0266FF]"
                  : "bg-white border-slate-300"
                  }`}>
                  {selectedOption === "manage" && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
              <div className="w-full aspect-[4/3] sm:aspect-[4/3] md:h-[320px] xl:h-[280px] 2xl:h-[320px] relative bg-white flex items-center justify-center shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    src="/onboarding/image2.png"
                    alt="Manage an existing business"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-4 xl:pt-2 2xl:pt-4 flex-grow flex flex-col items-center">
                <h3 className="text-[20px] sm:text-[20px] xl:text-[20px] 2xl:text-[24px] font-bold text-[#1A202C] mb-2 sm:mb-2 text-center">
                  Manage an existing business
                </h3>
                <p className="text-[#3E4246] text-[15px] xl:text-[18px] 2xl:text-[18px] sm:text-[16px] leading-relaxed text-center">
                  Get help with compliance, taxes, bookkeeping, or legal support for your current company.
                </p>
              </div>
            </div>

          </div>

          {/* Continue Button */}
          <div className="w-full max-w-[480px] pt-8 md:pt-8 px-4 sm:px-0 mt-auto md:mt-0 pb-4 md:pb-0">
            <button
              onClick={handleContinue}
              disabled={!selectedOption || isLoading}
              className={`w-full py-3 sm:py-4 text-white rounded-full font-[400] text-[16px] sm:text-[18px] transition-all transform flex items-center justify-center gap-2 ${selectedOption
                ? `bg-[#3B87FA] shadow-lg shadow-blue-900/20 ${isLoading ? "cursor-wait opacity-80" : "cursor-pointer hover:bg-[#0266FF] active:scale-[0.98]"}`
                : "bg-slate-300 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoIsThisFor;
