'use client';
import React, { useState } from 'react';
import Image from 'next/image';

function Section3() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Enter Your Details",
      desc: "Share basic info so we understand your business needs",
      bg: "from-[#9D76F9] to-[#8A5CF5]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(157,118,249,0.7)]",
      icon: (
        <Image src="/img/Group (1).svg" alt="Details" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 2,
      title: "Choose Your Plan",
      desc: "Pick a package that fits your goals",
      bg: "from-[#4CE3FF] to-[#1CB9FA]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(60,224,255,0.7)]",
      icon: (
        <Image src="/img/Group (2).svg" alt="Plan" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 3,
      title: "Submit Business Info",
      desc: "Provide company details like name, type, and ownership",
      bg: "from-[#F5A9EB] to-[#E883DB]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(241,162,230,0.7)]",
      icon: (
        <Image src="/img/Group (3).svg" alt="Info" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 4,
      title: "Make payment",
      desc: "Complete your order securely with transparent pricing",
      bg: "from-[#FBBF24] to-[#F59E0B]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(245,158,11,0.7)]",
      icon: (
        <Image src="/howitworkicon/Group00.svg" alt="Verification" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 5,
      title: "Complete KYC",
      desc: "Verify your identity with quick and simple documentation",
      bg: "from-[#34D399] to-[#10B981]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(16,185,129,0.7)]",
      icon: (
        <Image src="/howitworkicon/Group02.svg" alt="Processing" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 6,
      title: "We Handle Setup",
      desc: "We process everything and set up your U.S. entity",
      bg: "from-[#60A5FA] to-[#3B82F6]",
      shadow: "shadow-[0_15px_30px_-10px_rgba(59,130,246,0.7)]",
      icon: (
        <Image src="/howitworkicon/Group03.svg" alt="Tax ID" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    },
    {
      id: 7,
      title: "Launch & Track",
      desc: "Get updates and track progress until your business is ready",
      bg: "from-[#FB7185] to-[#F43F5E]",
      shadow: "shadow-[0_15px_30px_-10_rgba(244,63,94,0.7)]",
      icon: (
        <Image src="/howitworkicon/Group5.svg" alt="Launch" width={50} height={50} style={{ width: '35px', height: '35px' }} />
      )
    }
  ];

  return (
    <section id="how-it-works" className="w-full h-auto lg:h-[662px] 2xl:h-[800px] 3xl:h-[1000px] py-16 lg:py-0 flex flex-col justify-center items-center bg-white relative overflow-hidden">
      <div className="max-w-[1260px] xl:max-w-[1380px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

        {/* Header */}
        <div className="mb-16 lg:mb-20 2xl:mb-16 w-full max-w-[1260px] h-auto lg:h-[92px] mx-auto">
          <h2 className="text-3xl md:text-[47px] lg:text-[36px] xl:text-[45px] 2xl:text-[56px] font-[700] text-[#3E4246] mb-4 xl:mb-2 2xl:mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] text-[#3E4246]/70 font-[400] w-full mx-auto">
            Simple, fast, and fully managed — launch your U.S. business with ease
          </p>
        </div>

        {/* Slider Container */}
        <div className="w-full max-w-[1260px] xl:max-w-[1380px] 2xl:max-w-[1600px] mx-auto h-[360px] ">
          <div
            onScroll={(e) => {
              const container = e.currentTarget;
              const firstItem = container.children[0] as HTMLElement;
              if (!firstItem) return;

              const style = window.getComputedStyle(container);
              const gap = parseInt(style.columnGap || '0');
              const itemWidth = firstItem.offsetWidth + gap;

              const scrollLeft = container.scrollLeft;
              const index = Math.round(scrollLeft / itemWidth);
              if (index >= 0 && index < steps.length && index !== activeStep) {
                setActiveStep(index);
              }
            }}
            className="flex overflow-x-auto snap-x snap-mandatory gap-65 pb-8 pt-4 px-4 md:px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="w-[300px] md:w-[280px] xl:w-[280px] 2xl:w-[340px] lg:h-[300px] h-[340px] shrink-0 snap-center flex flex-col items-center text-center relative"
              >
                {/* Connecting Line from center to next center with dynamic colored dots */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-[45px] lg:top-[100px] xl:top-[110px] 2xl:top-[140px]   left-[calc(50%+45px)] xl:left-[calc(50%+150px)] lg:left-[calc(50%+150px)] 2xl:left-[calc(50%+185px)] w-[232px] items-center z-0 hidden md:flex">
                    <div className={`w-[10px] h-[10px] rounded-full bg-gradient-to-br flex-shrink-0 ${step.bg}`}></div>
                    <div
                      className="flex-1  mx-1 h-[2px]"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #E2E8F0 60%, rgba(255,255,255,0) 0%)',
                        backgroundPosition: 'center',
                        backgroundSize: '16px 2px',
                        backgroundRepeat: 'repeat-x',
                        borderRadius: '50px'
                      }}
                    ></div>
                    <div className={`w-[10px] h-[10px] rounded-full bg-gradient-to-br flex-shrink-0 ${steps[index + 1].bg}`}></div>
                  </div>
                )}

                <div className={`relative z-10 w-[90px] h-[90px]  2xl:w-[120px] 2xl:h-[120px] rounded-[20px] bg-gradient-to-br ${step.bg} ${step.shadow} flex items-center justify-center mb-10 xl:mb-6`}>
                  <div className="scale-110 2xl:scale-135">
                    {step.icon}
                  </div>
                </div>
                <div className="w-full flex flex-col items-center" >
                  <h3 className="text-[18px] md:text-[22px] 2xl:text-[32px] font-[700] text-[#3E4246] mb-2 whitespace-nowrap px-2">
                    {step.title}
                  </h3>
                  <p className="text-[14px] md:text-[17px] 2xl:text-[19px] text-[#3E4246]/60 font-[400] leading-relaxed px-2 max-w-[280px] 2xl:max-w-[310px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pager Dots */}
        <div className="mt-4 lg:mt-3 2xl:mt-8 flex items-center justify-center gap-2">
          {steps.map((_, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={index}
                className={`h-[8px] rounded-full transition-all duration-300 ${isActive ? 'w-[16px] bg-[#3E4246]' : 'w-[4px] bg-[#E2E8F0]'
                  }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Section3;