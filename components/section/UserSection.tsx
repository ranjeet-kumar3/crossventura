import React from 'react'
import Image from 'next/image'

function UserSection() {
  const logos = [
    '/img/image 12.svg',
    '/img/image 14.svg',
    '/img/image 15.svg',
    '/img/image 16.svg',
    '/img/image 13.svg'
  ];

  return (
    <section className="w-full h-[289px] flex flex-col items-center justify-center bg-white">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div>
          <p className="text-[14px] md:text-[18px] lg:text-[20px] 2xl:text-[22px] text-[#050038]/60 font-[400] mb-8 lg:mb-10">
            Trusted by 45M+ users
          </p>
        </div>
        <div className="flex flex-nowrap md:px-10 lg:px-15 xl:px-3 justify-between items-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 w-full max-w-[1070px] xl:max-w-[1074px] 2xl:max-w-[1400px] overflow-hidden">
          {logos.map((logo, index) => (
            <div key={index} className="relative h-8 w-28 sm:h-10  sm:w-32 md:h-12 md:w-40 lg:h-14 lg:w-44 xl:h-14 xl:w-44 2xl:h-20 2xl:w-52  cursor-pointer hover:opacity-80 transition-opacity">
              <Image 
                src={logo} 
                alt={`Trusted Partner ${index + 1}`} 
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UserSection