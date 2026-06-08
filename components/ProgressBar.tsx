"use client";

import React from "react";

interface ProgressBarProps {
  steps: string[];
  currentStepIndex: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full max-w-[1076px] mx-auto mb-8 mt-10">
      <div className="flex justify-between items-center max-w-[876px] mx-auto relative">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex flex-col items-center group relative">
            {/* Step Label */}
            <span className={`text-[16px] mb-6 whitespace-nowrap ${index <= currentStepIndex ? "text-slate-900 font-[400]" : "text-slate-400"
              }`}>
              {step}
            </span>

            {/* Step Marker Container */}
            <div className="w-full flex items-center justify-center relative h-1">
              {/* The Progress Bar Section */}
              <div className={`h-[8px] w-full mx-3 rounded-full transition-colors duration-500 ${index < currentStepIndex
                  ? "bg-[#0266FF]"
                  : index === currentStepIndex
                    ? "bg-linear-to-r from-[#0266FF] from-70% to-slate-100 to-50%"
                    : "bg-slate-100"
                }`} />

              {/* Dot */}
              <div className={`absolute -top-[25px] w-[6px] h-[6px] rounded-full z-10 ${index <= currentStepIndex ? "bg-[#193D66]" : "bg-slate-400"
                }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
