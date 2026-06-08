'use client';
import React, { useState, useEffect } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const FaqSection: React.FC = () => {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faqitem');
        const data = await response.json();
        setFaqData(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#ffffff] py-16 px-6 md:px-12">
      <div className="max-w-[1260px] 2xl:max-w-[1640px] mx-auto">
        <h2 className="text-center text-[28px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[56px] font-semibold text-[#3b3b3b] mb-12 2xl:mb-16">
          Frequently Asked Questions.
        </h2>

        <div className="space-y-0">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen 
                    ? "bg-[#0266FF]/80 rounded-[20px] mb-4 shadow-xl scale-[1.01]" 
                    : "border-b border-[#d9d9d9] hover:bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between text-left outline-none cursor-pointer group transition-all duration-500 ${
                    isOpen ? "pt-8 pb-3 2xl:pt-10 2xl:pb-4" : "py-8 2xl:py-10"
                  }`}
                >
                  <div className="flex-1">
                    <span className={`text-[16px] md:text-[24px] 2xl:text-[28px] ml-4  font-[700] px-10  transition-colors duration-500 ${
                      isOpen ? "text-white" : "text-[#3E4246] group-hover:text-[#1c3a5e]"
                    }`}>
                      {item.question}
                    </span>
                  </div>

                  <div className="px-8 mr-6flex items-center justify-center">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <div className={`absolute w-5 h-[2px] transition-all duration-500 transform ${
                        isOpen ? "bg-white rotate-0" : "bg-[#4a4a4a] rotate-0"
                      }`} />
                      <div className={`absolute w-5 h-[2px] transition-all duration-500 transform ${
                        isOpen ? "bg-white rotate-0 opacity-0" : "bg-[#4a4a4a] rotate-90 opacity-100"
                      }`} />
                    </div>
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows]  duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`text-[15px] md:text-[20px] 2xl:text-[22px] font-[400] ml-4 px-10 pr-10 pb-8 2xl:pb-8 leading-relaxed transition-all duration-500 ${
                      isOpen ? "text-white/90 opacity-100 translate-y-0" : "text-[#666] opacity-0 -translate-y-2"
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;