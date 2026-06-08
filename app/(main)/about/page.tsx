import React from "react";
import { Metadata } from "next";
import { Gavel, HandCoins, Network, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
    title: "About Crossventura | Simplifying Global Business for Founders",
    description: "Learn how Crossventura, a division of Juris Consultants USA, helps international entrepreneurs establish a fully operational US business presence with ease and transparency.",
    keywords: "US business formation, global entrepreneurs, company formation USA, Juris Consultants USA, Crossventura mission",
    openGraph: {
        title: "About Crossventura | Simplifying Global Business for Founders",
        description: "Establishing a credible US presence for modern founders, simplified.",
        type: "website",
    },
};

const AboutPage = () => {
    return (
        <main className="min-h-screen flex flex-col font-sans">

            {/* Hero Section */}
            <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
                {/* Background Image with Tint Overlay */}
                <div className="absolute inset-0 z-0" role="img" aria-label="Modern office building representing global business growth">
                    <img
                        src="/about-img/abtheroimg.png"
                        alt="Modern office building representing global business growth"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Dark Tint Overlay to match the image precisely */}
                    <div className="absolute inset-0 bg-[#0F172A]/20 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/20 to-[#0F172A]/80" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 text-center px-6 max-w-[1200px] mx-auto">
                    <h1 className="text-[32px] sm:text-[40px] md:text-[56px] lg:text-[44px] xl:text-[46px] 2xl:text-[56px] font-[800] text-white mb-6 tracking-tighter leading-tight uppercase animate-in fade-in zoom-in duration-1000">
                        ABOUT CROSSVENTURA
                    </h1>

                    {/* <p className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] xl:text-[20px] text-slate-100 max-w-[800px] mx-auto font-[500] leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        Simplifying global business for modern founders
                    </p> */}

                    <p className="mt-6 text-[14px] sm:text-[16px] md:text-[26px] lg:text-[18px] 2xl:text-[20px] xl:text-[20px] text-white max-w-[1200px] mx-auto font-[400] leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                        CrossVentura is a specialized division of Juris Consultants USA, created to help entrepreneurs and businesses worldwide establish a trusted and fully operational presence in the United States — without needing to visit the US physically.
                    </p>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="min-h-[750px] 2xl:min-h-[850px] py-12 2xl:py-8 bg-[#FFFFFF] flex flex-col justify-center">
                <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1820px] mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="text-center max-w-[1260px] 2xl:max-w-[1560px] mx-auto mb-24 xl:mb-20 2xl:mb-20">
                        <h2 className="text-[40px] md:text-[48px] lg:text-[40px] xl:text-[54px] font-[800] text-[#1e293b] mb-2 tracking-tight">
                            Who We Are
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl lg:text-[18px] xl:text-[22px] 2xl:text-[26px] max-w-[1260px] 2xl:max-w-[1560px] mx-auto leading-relaxed font-[300]">
                          CrossVentura helps global founders confidently enter the US market through end-to-end business setup, compliance, banking, and operational support.We understand that expanding internationally can feel complex, especially with legal formalities, banking systems, and operational requirements. Our mission is to simplify the entire journey and make US business expansion seamless, transparent, and stress-free.

                        </p>
                    </div>

                    {/* Challenge Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-10 mb-20 xl:mb-20 2xl:mb-30">
                        <div className="lg:col-span-5  xl:col-span-4">
                            <h3 className="text-[32px] md:text-[48px] lg:text-[52px] xl:text-[48px] font-[700] leading-[1.1] text-[#1e293b]">
                                The Challenge We <br />
                                <span className="text-[#fbbf24]">Solve</span>
                            </h3>
                        </div>
                        <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 xl:gap-40 2xl:gap-52 items-start">
                            <p className="text-slate-600 text-[16px] md:text-lg lg:text-[18px] xl:text-[22px] 2xl:text-[26px] leading-relaxed max-w-[383px] 2xl:max-w-[450px]">
                                Entering the US market is one of the biggest growth opportunities for international businesses — but the process can often feel overwhelming..
                            </p>
                            <p className="text-slate-600 text-[16px] md:text-lg lg:text-[18px] xl:text-[22px] 2xl:text-[26px] leading-relaxed max-w-[383px] 2xl:max-w-[450px]">
                                From legal registration and compliance requirements to banking setup and operational logistics, businesses frequently struggle to manage everything remotely.
                            </p>
                        </div>
                    </div>

                    {/* Overlapping Images */}
                    <div className="relative mt-16 2xl:mt-24 mb-24 xl:mb-36 2xl:mb-48">
                        <div className="relative w-full h-[467px] 2xl:h-[620px]">
                            {/* Left Image */}
                            <div className="absolute left-0 top-0 w-[60%] h-full z-0">
                                <div className="w-full h-full rounded-[32px] xl:rounded-[48px] overflow-hidden ">
                                    <img
                                        src="/about-img/imageleft(1).png"
                                        alt="Crossventura team collaborating in a modern workspace"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Right Image (Overlapping) */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[85%] z-10">
                                <div className="w-full h-full relative bg-white p-1 md:p-2 xl:p-2 rounded-[32px] xl:rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                                    <div className="w-full h-full relative rounded-[28px] xl:rounded-[44px] overflow-hidden">
                                        <img
                                            src="/about-img/imageright(2).png"
                                            alt="Analytics and business growth strategy dashboard"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                                            <div className="w-16 h-16 md:w-20 md:h-20 xl:w-22 xl:h-22 bg-[#0266FF]  rounded-full flex items-center justify-center shadow-2xl  ">
                                                <span className="sr-only">Play introductory video about Crossventura</span>
                                                <div className="w-0 h-0 border-t-[10px] md:border-t-[16px] xl:border-t-[22px] border-t-transparent border-l-[18px] md:border-l-[28px] xl:border-l-[36px] border-l-white border-b-[10px] md:border-b-[16px] xl:border-b-[22px] border-b-transparent ml-1 md:ml-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Expertise Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-6">
                    {/* Top Decoration */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-[40px] md:text-[48px] lg:text-[40px] xl:text-[54px] font-[800] text-[#1e293b] mb-4 text-center">
                            Our Expertise
                        </h2>
                        {/* <p className="text-slate-500 text-lg md:text-xl text-center max-w-[600px] font-medium">
                            Deep expertise to support your U.S. business journey
                        </p> */}
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">

                        {/* Legal Expertise */}
                        <div className="bg-[#f8fafc] border border-slate-200/60 p-6 md:p-8 xl:p-10 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-100 group">
                            <div className="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-[20px] bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 transition-all duration-500">
                                <img src="/about-img/abticon4.svg" alt="Legal Expertise icon" className="w-7 h-7 md:w-8 md:h-8 xl:w-10 xl:h-10 brightness-0 invert" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h4 className="text-[20px] md:text-[22px] lg:text-[16px] xl:text-[26px] font-[800] text-[#1e293b] group-hover:text-blue-600 transition-colors duration-300">Legal Expertise</h4>
                                <p className="text-slate-500 text-[15px] md:text-[16px] lg:text-[16px] xl:text-[18px] leading-relaxed font-medium">
                                    Business formation and legal structuring handled by experienced professionals specializing in US corporate law.
                                </p>
                            </div>
                        </div>

                        {/* Financial & Compliance */}
                        <div className="bg-[#f8fafc] border border-slate-200/60 p-6 md:p-8 xl:p-10 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-100 group">
                            <div className="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-[20px] bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 transition-all duration-500">
                                <img src="/about-img/abticon2.svg" alt="Financial & Compliance icon" className="w-7 h-7 md:w-8 md:h-8 xl:w-10 xl:h-10 brightness-0 invert" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h4 className="text-[20px] md:text-[22px] xl:text-[26px] font-[800] text-[#1e293b] group-hover:text-blue-600 transition-colors duration-300">Financial & Compliance</h4>
                                <p className="text-slate-500 text-[15px] md:text-[16px] lg:text-[18px] xl:text-[18px] leading-relaxed font-medium">
                                    CPA-supported compliance, documentation, and financial guidance to keep your business secure and compliant.
                                </p>
                            </div>
                        </div>

                        {/* Corporate Structuring */}
                        <div className="bg-[#f8fafc] border border-slate-200/60 p-6 md:p-8 xl:p-10 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-100 group">
                            <div className="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-[20px] bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 transition-all duration-500">
                                <img src="/about-img/abticon3.svg" alt="Corporate Structuring icon" className="w-7 h-7 md:w-8 md:h-8 xl:w-10 xl:h-10 brightness-0 invert" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[20px] md:text-[22px] xl:text-[26px] font-[800] text-[#1e293b] group-hover:text-blue-600 transition-colors duration-300">Corporate Structuring</h4>
                                <p className="text-slate-500 text-[15px] md:text-[16px] lg:text-[18px] xl:text-[18px] leading-relaxed font-medium">
                                    Strategic company structuring tailored to your business goals, industry, and long-term expansion plans.
                                </p>
                            </div>
                        </div>

                        {/* Personalized Approach */}
                        <div className="bg-[#f8fafc] border border-slate-200/60 p-6 md:p-8 xl:p-10 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-100 group">
                            <div className="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-[20px] bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 transition-all duration-500">
                                <img src="/about-img/abticon1.svg" alt="Personalized Approach icon" className="w-7 h-7 md:w-8 md:h-8 xl:w-10 xl:h-10 brightness-0 invert" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h4 className="text-[20px] md:text-[22px] xl:text-[26px] font-[800] text-[#1e293b] group-hover:text-blue-600 transition-colors duration-300">Personalized Approach</h4>
                                <p className="text-slate-500 text-[15px] md:text-[16px] xl:text-[18px] leading-relaxed font-medium">
                                    Every business is different — we build customized solutions based on your specific needs and growth vision.
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Why Businesses Choose Us Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1720px] mx-auto px-6">
                    {/* Top Decoration */}
                    <div className="flex flex-col items-center mb-12">
                        {/* <div className="w-8 h-[2px] bg-blue-400 rounded-full mb-8" /> */}
                        <h2 className="text-[32px] md:text-[48px] lg:text-[40px] xl:text-[54px] 2xl:text-[56px] font-[800] text-[#1e293b] mb-4 text-center leading-tight">
                            Why Businesses Choose Us
                        </h2>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

                        {/* Card 1: Company Formation */}
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group h-full border border-slate-100/50">
                            <div className="h-[240px] 2xl:h-[300px] overflow-hidden shrink-0 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
                                    alt="Company Formation"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8 2xl:p-10 flex-1 flex flex-col items-center text-center">
                                <h4 className="text-[22px] 2xl:text-[28px] font-[800] text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                    Company Formation <br className="hidden xl:block" /> Done Right
                                </h4>
                                <p className="text-slate-500 text-[16px] 2xl:text-[18px] leading-relaxed font-medium">
                                    We help you establish a credible US business presence with the right structure and setup from day one.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Banking Made Simple */}
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group h-full border border-slate-100/50">
                            <div className="h-[240px] 2xl:h-[300px] overflow-hidden shrink-0 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
                                    alt="Banking Solutions"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8 2xl:p-10 flex-1 flex flex-col items-center text-center">
                                <h4 className="text-[22px] 2xl:text-[28px] font-[800] text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                    Banking <br className="hidden xl:block" /> Made Simple
                                </h4>
                                <p className="text-slate-500 text-[16px] 2xl:text-[18px] leading-relaxed font-medium">
                                    Secure business banking and virtual banking solutions designed for international founders.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Warehousing & Fulfilment */}
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group h-full border border-slate-100/50">
                            <div className="h-[240px] 2xl:h-[300px] overflow-hidden shrink-0 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                                    alt="Warehousing & Fulfilment"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8 2xl:p-10 flex-1 flex flex-col items-center text-center">
                                <h4 className="text-[22px] 2xl:text-[28px] font-[800] text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                    Warehousing & <br className="hidden xl:block" /> Fulfilment
                                </h4>
                                <p className="text-slate-500 text-[16px] 2xl:text-[18px] leading-relaxed font-medium">
                                    Setup support for warehousing, logistics, and fulfillment operations to streamline your business activities.
                                </p>
                            </div>
                        </div>

                        {/* Card 4: End-to-End Management */}
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group h-full border border-slate-100/50">
                            <div className="h-[240px] 2xl:h-[300px] overflow-hidden shrink-0 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                                    alt="End-to-End Management"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-8 2xl:p-10 flex-1 flex flex-col items-center text-center">
                                <h4 className="text-[22px] 2xl:text-[28px] font-[800] text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                    End-to-End <br className="hidden xl:block" /> Management
                                </h4>
                                <p className="text-slate-500 text-[16px] 2xl:text-[18px] leading-relaxed font-medium">
                                    From incorporation to compliance and operational setup, we manage every step on your behalf.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Mission Statement Section */}
            <section className="py-20 bg-[#FFFBEB] border-t border-amber-100/50">
                <div className="max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1720px] mx-auto px-6 text-center">
                    <p className="text-[#1e293b] text-[18px] md:text-[24px] lg:text-[25px] font-[700] leading-snug max-w-[1150px] mx-auto">
                        At CrossVentura, we believe geography should never limit ambition. Whether you are a founder in Mumbai, a trader in Dubai, or an entrepreneur in Lagos — the US market is within your reach, and we are here to help you get there.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;