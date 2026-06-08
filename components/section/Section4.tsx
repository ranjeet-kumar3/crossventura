'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Jayesh Patel",
        role: "Founder, TechSolutions",
        quote: "CrossVentura helped us save over 40 hours a month and significantly increased our document accuracy. A game-changer for our firm..",
        video: "/videos/vidssave.com Jayesh Patel Testimonial 480P (1).mp4",
        bgColor: "#C5A27D"
    },
    {
        id: 2,
        name: "Parikh Kashyap",
        role: "CPA, Bright Accounting",
        quote: "CrossVentura helped us save over 40 hours a month and significantly increased our document accuracy. A game-changer for our firm..",
        video: "/videos/vidssave.com Kashyap Parikh Testimonial 480P.mp4",
        bgColor: "#193D66"
    },
    {
        id: 3,
        name: "Sorabh",
        role: "Senior Attorney, Lee & Co.",
        quote: "CrossVentura helped us save over 40 hours a month and significantly increased our document accuracy. A game-changer for our firm..",
        video: "/videos/vidssave.com Sorabh Testimonial 480P.mp4",
        bgColor: "#193D66"
    }
];

const Section4 = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="w-full bg-[#F8FAFC] py-16 lg:py-0 flex flex-col items-center justify-center overflow-hidden h-auto lg:h-[780px] xl:h-[871px]">
            <div className="max-w-[1440px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-10 max-w-[1260px] 2xl:max-w-[1440px] w-full mx-auto">
                    <h2 className="text-4xl md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[56px] font-[700] text-[#3E4246] mb-4 leading-tight">
                        Built for Founders.<br />
                        Loved by Founders.
                    </h2>
                    <p className="text-[16px] md:text-[18px] lg:text-[16px] xl:text-[20px] 2xl:text-[22px] text-[#3E4246]/70 font-[400] sm:whitespace-nowrap whitespace-normal px-4">
                        Simple, fast, and fully managed — launch your U.S. business with ease
                    </p>
                </div>

                {/* Desktop Testimonials Grid (lg screens and up) */}
                <div className="hidden lg:block">
                    <LayoutGroup id="testimonials_group">
                        <div className="flex flex-row gap-4 xl:gap-6 2xl:gap-8 items-stretch justify-center w-full lg:w-[980px] xl:w-[1260px] 2xl:w-[1440px] 3xl:w-[1600px] h-[390px] xl:h-[443px] 2xl:h-[500px] mx-auto">
                            {testimonials.map((testimonial, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <motion.div
                                        key={testimonial.id}
                                        layout
                                        onClick={() => setActiveIndex(index)}
                                        className="h-full cursor-pointer rounded-[20px] overflow-hidden relative shadow-none shrink-0 border border-[#E2E8F0] bg-white select-none"
                                        animate={{
                                            width: isActive
                                                ? (typeof window !== 'undefined' ? (window.innerWidth >= 2000 ? 1000 : window.innerWidth >= 1536 ? 900 : window.innerWidth >= 1280 ? 780 : 640) : 780)
                                                : (typeof window !== 'undefined' ? (window.innerWidth >= 2000 ? 280 : window.innerWidth >= 1536 ? 250 : window.innerWidth >= 1280 ? 220 : 150) : 220)
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 40,
                                            damping: 18,
                                            mass: 1
                                        }}
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        <AnimatePresence>
                                            {isActive ? (
                                                /* Expanded Layout */
                                                <motion.div
                                                    key="expanded"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute inset-0 flex h-full w-full"
                                                >
                                                    {/* Background Structure: Sidebar and White Area */}
                                                    <div className="w-[200px] xl:w-[307px] 2xl:w-[350px] bg-[#3E4246]/80 h-full flex flex-col p-8 relative shrink-0">
                                                        <div className="absolute top-4 left-4 xl:left-6 z-[10]">
                                                            <Image
                                                                src="/img/Vector1.svg"
                                                                alt="Quote Open"
                                                                width={80}
                                                                height={60}
                                                                className="opacity-90 w-[50px] xl:w-[80px]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 bg-white h-full"></div>

                                                    {/* Content Area */}
                                                    <div className="absolute inset-0 flex border-[#193D6633] left-[-30px] flex-row items-center p-8 gap-6 xl:gap-14 2xl:gap-16 z-10">
                                                        {/* Image/Video Container */}
                                                        <motion.div
                                                            layoutId={`image-${testimonial.id}`}
                                                            className="relative w-[200px] xl:w-[300px] 2xl:w-[350px] h-[300px] xl:h-[377px] 2xl:h-[430px] rounded-[20px] overflow-hidden shrink-0 ml-[30px] lg:ml-[80px] xl:ml-[100px] 2xl:ml-[120px]"
                                                            style={{ backgroundColor: testimonial.bgColor }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 40,
                                                                damping: 18,
                                                                mass: 1
                                                            }}
                                                        >
                                                            <video
                                                                src={testimonial.video}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </motion.div>

                                                        {/* Text Content */}
                                                        <div className="flex-1 flex flex-col justify-center py-4 pr-4">
                                                            <motion.p
                                                                initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                                                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                                                transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                                className="text-[14px] xl:text-[20px] 2xl:text-[24px] text-[#3E4246] font-[400] leading-relaxed mb-4 xl:mb-6"
                                                            >
                                                                <span className="font-[700]">CrossVentura</span> {testimonial.quote}
                                                            </motion.p>

                                                            <motion.div
                                                                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                                                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                                                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                                className="mb-4 relative"
                                                            >
                                                                {/* Decorative Line from Image */}
                                                                <div className="absolute left-[-20px] xl:left-[-80px] 2xl:left-[-108px] top-[35px] w-[15px] xl:w-[70px] 2xl:w-[90px] h-[3px] bg-gradient-to-b from-[#ffffff] to-[#9EA0A2]"></div>

                                                                <h4 className="text-[16px] xl:text-[20px] 2xl:text-[24px] font-[700] text-[#3E4246]">{testimonial.name}</h4>
                                                                <p className="text-[13px] xl:text-[16px] 2xl:text-[18px] text-[#3E4246]/60">{testimonial.role}</p>
                                                            </motion.div>

                                                            {/* Bottom Quote Icon */}
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.7, filter: "blur(5px)" }}
                                                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                                                transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                                className="absolute bottom-7 left-[50%] lg:left-[50%] xl:left-[60%] 2xl:left-[55%] h-8 xl:h-10 flex items-center scale-75 xl:scale-100"
                                                            >
                                                                <Image
                                                                    src="/img/Vector.svg"
                                                                    alt="Quote Close"
                                                                    width={80}
                                                                    height={60}
                                                                    className="opacity-90 w-[50px] xl:w-[80px]"
                                                                />
                                                            </motion.div>

                                                            {/* Control Buttons Placeholder */}
                                                            <div className="absolute bottom-8 right-6 xl:right-14 flex gap-2">
                                                                <div className="w-[24px] h-[24px] 2xl:w-[30px] 2xl:h-[30px] bg-[#3E4246] rounded-[4px] flex items-center justify-center"></div>
                                                                <div className="w-[24px] h-[24px] 2xl:w-[30px] 2xl:h-[30px] bg-[#3E4246] rounded-[4px] flex items-center justify-center"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                /* Collapsed Layout */
                                                <motion.div
                                                    key="collapsed"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute inset-0 h-full w-full group"
                                                >
                                                    <motion.div
                                                        layoutId={`image-${testimonial.id}`}
                                                        className="absolute inset-0"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 40,
                                                            damping: 18,
                                                            mass: 1
                                                        }}
                                                    >
                                                        <video
                                                            src={testimonial.video}
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                    <div className="absolute inset-0 bg-[#193D66]/40 group-hover:bg-[#193D66]/20 transition-colors duration-300"></div>
                                                    <div className="absolute bottom-[68px] 2xl:bottom-[80px] left-[35px] xl:left-[56px] 2xl:left-[65px] right-0 px-6 transform -rotate-90 origin-left translate-x-14 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-[800] text-[18px] xl:text-[20px] 2xl:text-[24px]">{testimonial.name}</span>
                                                            <span className="text-white/80 text-[14px] xl:text-[16px] 2xl:text-[18px] font-[400]">{testimonial.role}</span>
                                                        </div>
                                                    </div>
                                                    {/* Vertical Decorative Line */}
                                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[2px] h-[60px] 2xl:h-[80px] bg-gradient-to-b from-[#ffffff] to-[#9EA0A2] opacity-80"></div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </LayoutGroup>
                </div>

                {/* Mobile/Tablet Testimonials Grid (below lg screens) */}
                <div className="block lg:hidden w-full max-w-[1260px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col gap-6"
                            >
                                {/* Video Container */}
                                <div
                                    className="relative w-full aspect-video rounded-[15px] overflow-hidden shrink-0"
                                    style={{ backgroundColor: testimonial.bgColor }}
                                >
                                    <video
                                        src={testimonial.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="flex flex-col justify-between flex-grow gap-4">
                                    <p className="text-[15px] md:text-[16px] text-[#3E4246] font-[400] leading-relaxed">
                                        <span className="font-[700]">CrossVentura</span> {testimonial.quote}
                                    </p>

                                    <div>
                                        <h4 className="text-[18px] font-[700] text-[#3E4246]">{testimonial.name}</h4>
                                        <p className="text-[14px] text-[#3E4246]/60">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Section4;
