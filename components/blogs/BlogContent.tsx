import React from 'react';

interface BlogContentProps {
  title: string;
  introduction: string;
  sectionTitle?: string;
  sections: {
    title: string;
    content: string;
  }[];
}

const BlogContent: React.FC<BlogContentProps> = ({ title, introduction, sectionTitle, sections }) => {
  return (
    <section className="w-full   lg:max-w-[1000px] xl:max-w-[1440px] 2xl:max-w-[1580px] 3xl:max-w-[1740px] mx-auto mb-10 bg-white p-4">
      <h2 className="text-[28px] md:text-[40px] font-bold text-[#1A202C] mb-12 text-center font-inter ">
        {sectionTitle || `Benefits of ${title.split('=')[0].trim()}`}
      </h2>

      <div itemProp="articleBody" className="space-y-16 font-serif max-w-[1200px] mx-auto">
        <div className="relative">
          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#0266FF]/20 rounded-full hidden md:block"></div>
          <p className="text-[#1A202C] text-[20px] md:text-[22px] leading-[1.8] font-medium  text-slate-800">
            {introduction}
          </p>
        </div>

        {sections.map((section, index) => (
          <section key={index} className="space-y-6">
            <h3 className="text-[26px] md:text-[32px] font-bold text-[#1A202C] tracking-tight">
              {section.title}
            </h3>
            <div className="text-[#334155] text-[18px] md:text-[20px] leading-[1.8] whitespace-pre-wrap font-normal">
              {section.content.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className={paragraph.startsWith('•') ? 'pl-6 -indent-6 mb-4' : 'mb-6'}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default BlogContent;
