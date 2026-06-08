import React from 'react';
import Image from 'next/image';

interface BlogHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ title, subtitle, description, image }) => {
  return (
    <header className="flex flex-col max-w-[1100px] lg:max-w-[1200px] xl:max-w-[1240px] 2xl:max-w-[1380px] 3xl:max-w-[1520px] mx-auto items-center">
      <div className="text-center mb-10 max-w-[1260px] lg:max-w-[1360px] xl:max-w-[1440px] 2xl:max-w-[1460px] 3xl:max-w-[1600px]">
        <h1 
          itemProp="headline"
          className="text-[32px] md:text-[48px] font-[700] text-[#1A202C] mb-4 leading-tight"
        >
          {subtitle || title}
        </h1>
        <p 
          itemProp="description"
          className="text-[#64748B] text-[18px] md:text-[22px] font-[400]"
        >
          {description}
        </p>
      </div>

      <div className="relative w-full max-w-[1000px] xl:max-w-[1200px] mx-auto h-[350px] md:h-[500px] rounded-[32px] overflow-hidden mb-16 shadow-2xl shadow-slate-200/50" style={{ height: '500px' }}>
        <Image
          src={image}
          alt={title}
          fill
          itemProp="image"
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </div>
    </header>
  );
};

export default BlogHero;
