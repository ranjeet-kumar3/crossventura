import React from 'react';
import Image from 'next/image';
import { BlogExample } from '@/data/blogs';

interface RealWorldExamplesProps {
  examples: BlogExample[];
}

const RealWorldExamples: React.FC<RealWorldExamplesProps> = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <section className="w-full lg:max-w-[1060px] xl:max-w-[1440px] 2xl:max-w-[1580px] 3xl:max-w-[1740px] mx-auto mt-10 pb-20">
      <h2 className="text-[28px] md:text-[36px] font-bold text-[#1A202C] mb-12 text-center">
        Real-World Examples
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
        {examples.map((example, index) => (
          <li
            key={index}
            className="bg-[#F8FAFC] border border-slate-100 rounded-[20px] p-8 flex gap-6 hover:shadow-md transition-all duration-300"
          >
            <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm">
              <Image
                src={example.logo}
                alt={`${example.name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[18px] font-bold text-[#1A202C] mb-2">{example.name}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                {example.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RealWorldExamples;
