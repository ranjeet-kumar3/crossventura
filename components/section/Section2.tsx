import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


async function Section2() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let cards: {
    title: string;
    description: string;
    imageBg: string;
    imageUrl: string;
  }[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/cards`, { cache: 'no-store' });
    if (res.ok) {
      cards = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch cards:", error);
  }
  return (
    <section className="w-full py-20 lg:py-28 bg-[#F8F9FA]">
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Area */}
        <div className="text-center mb-16 w-full max-w-[1260px] 2xl:max-w-[1400px] h-auto lg:h-[92px] mx-auto">
          <h2 className="text-2xl md:text-[47px] lg:text-[36px] xl:text-[45px] 2xl:text-[56px] font-[700] text-[#3E4246] mb-4 tracking-tight">
            Who is This For?
          </h2>
          <p className="text-[16px] md:text-[18px] lg:text-[18px] xl:text-[20px] 2xl:text-[20px] text-[#3E4246] font-[400] w-full mx-auto">
            Built for ambitious businesses and founders looking to start, expand, and operate in the U.S. seamlessly
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-4 xl:gap-10 2xl:gap-12 w-full max-w-[1260px] 2xl:max-w-[1540px] h-auto mx-auto">
          {cards.map((card, index) => (
            <Link 
              href="/onboarding"
              key={index}
              className="flex flex-col w-full max-w-[287px] lg:max-w-[280px] xl:max-w-[310px] 2xl:max-w-[360px] h-[441px] lg:h-[400px] xl:h-[441px] 2xl:h-[480px] mx-auto rounded-[20px] overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
            >
              {/* Top Image Container */}
              <div className={`relative w-full h-[240px] lg:h-[200px] xl:h-[240px] 2xl:h-[280px] ${card.imageBg} overflow-hidden`}>
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
              </div>

              {/* Bottom Content Container */}
              <div className="p-8 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-[18px] md:text-[22px] 2xl:text-[24px] font-[700] text-[#3E4246] mb-3 whitespace-nowrap truncate">
                  {card.title}
                </h3>
                <p className="text-[16px] md:text-[17px] 2xl:text-[18px] text-[#3E4246]/70 text-center font-[400] leading-relaxed line-clamp-3">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Section2;