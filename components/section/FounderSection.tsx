import React from 'react';

function FounderSection() {
    const features = [
        {
            title: "100% Transparent Pricing",
            desc: "No hidden fees — all costs shown upfront"
        },
        {
            title: "7-Day Filing",
            desc: "Fast, state-dependent processing"
        },
        {
            title: "Global-Ready",
            desc: "Built for founders worldwide"
        },
        {
            title: "One-Sitting Process",
            desc: "Complete everything in one go"
        },
        {
            title: "End-to-End Support",
            desc: "From formation to compliance"
        },
        {
            title: "Order Tracking",
            desc: "Track status with clear updates"
        }
    ];

    return (
        <section className="w-full bg-[#FFFDC9] flex flex-col justify-center items-center h-auto lg:h-[532px] xl:h-[700px] 2xl:h-[850px] py-20 lg:py-0 px-4">
            <div className="w-full max-w-[1260px]  2xl:max-w-[1740px] mx-auto text-center flex flex-col justify-start pt-16 lg:pt-28 2xl:pt-36 h-full">

                {/* Header Content */}
                <div className="mb-20 md:mb-22 lg:mb-12 xl:mb-22 2xl:mb-32 w-full max-w-[1260px] 2xl:max-w-[1400px] h-auto lg:h-[92px] mx-auto">
                    <h2 className="text-3xl md:text-[48px] lg:text-[36px] xl:text-[45px] 2xl:text-[56px] font-[700] text-[#000000] mb-5 tracking-tight">
                        Why founders trust CrossVentura
                    </h2>
                    <p className="text-[16px] md:text-[18px] lg:text-[16px] xl:text-[20px] 2xl:text-[22px] text-[#1A1A1A]/90 font-[400] w-full mx-auto">
                        Transparent, self-service, and built for global entrepreneurs — complete your U.S. company formation in one seamless flow.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 w-full max-w-[1260px] 2xl:max-w-[1740px] h-auto md:grid-cols-2 lg:grid-cols-3 gap-y-20 lg:gap-y-12 xl:gap-y-20 2xl:gap-y-28 gap-x-8 2xl:gap-x-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center px-4 w-full max-w-[395px] 2xl:max-w-[500px] mx-auto">
                            <h3 className="text-[20px] md:text-[32px] lg:text-[24px] xl:text-[32px] 2xl:text-[42px] font-[800] text-[#000000] mb-6 lg:mb-4 xl:mb-6 2xl:mb-10 tracking-tight whitespace-nowrap">
                                {feature.title}
                            </h3>
                            <p className="text-[15px] md:text-[17px] lg:text-[14px] xl:text-[17px] 2xl:text-[22px] text-[#1A1A1A]/90 font-[400] leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default FounderSection;