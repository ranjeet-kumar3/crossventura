import React from 'react';
import { notFound } from 'next/navigation';
import { blogs } from '@/data/blogs';
import BlogHero from '@/components/blogs/BlogHero';
import BlogContent from '@/components/blogs/BlogContent';
import RealWorldExamples from '@/components/blogs/RealWorldExamples';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blogs */}
      <div className="max-w-[1260px] lg:max-w-[1200px] xl:max-w-[1240px] 2xl:max-w-[1380px] 3xl:max-w-[1520px] mx-auto  px-6 pt-16">
        <Link
          href="/blogs"
          className="inline-flex text-[16px] md:text-[18px] items-center gap-2 text-slate-500 hover:text-[#0266FF] transition-colors font-medium"
        >
          <ChevronLeft className="w-6 h-6" />
          Back to Blogs
        </Link>
      </div>

      <article className="max-w-[1260px]  xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[2000px] mx-auto px-6 mt-10">
        <BlogHero
          title={blog.title}
          subtitle={blog.subtitle}
          description={blog.description}
          image={blog.image}
        />

        <BlogContent
          title={blog.title}
          introduction={blog.content.introduction}
          sectionTitle={blog.content.sectionTitle}
          sections={blog.content.sections}
        />

        {blog.content.examples && (
          <RealWorldExamples examples={blog.content.examples} />
        )}
      </article>

      {/* Conclusion Section */}
      {blog.content.conclusion && (
        <div className="w-full mt-16 ">
          <div className="bg-[#FEF9C3]  py-20 md:py-28 px-6 text-center">
            <h2 className="text-[14px] md:text-[48px] font-[700]  text-[#3E4246] uppercase tracking-[0.2em] mb-10 opacity-60">
              Conclusion
            </h2>

            <div className="max-w-[900px] mx-auto text-left">
              <h3 className="text-[24px] md:text-[28px] font-bold text-[#1A202C] mb-4 leading-tight">
                {blog.content.conclusion.title}
              </h3>
              <p className="text-[#3E4246] text-[16px] md:text-[18px] leading-[1.8] whitespace-pre-wrap">
                {blog.content.conclusion.content}
              </p>

              {/* <div className="mt-12 text-center md:text-left">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 bg-[#193D66] text-white px-8 py-4 rounded-full font-bold text-[16px] md:text-[18px] hover:bg-[#0266FF] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                >
                  Start Your US Journey
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* {!blog.content.conclusion && (
        <div className="max-w-[1000px] mx-auto px-6 mt-20 mb-0">
          <div className="bg-[#193D66] rounded-[32px] p-12 text-center text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-[28px] md:text-[36px] font-bold mb-4">Ready to start your US business?</h3>
              <p className="text-white/80 text-[18px] mb-10 max-w-[500px] mx-auto">
                Get expert assistance for your US incorporation and manage everything seamlessly.
              </p>
              <Link
                href="/onboarding"
                className="inline-block bg-white text-[#193D66] px-10 py-4 rounded-full font-bold text-[18px] hover:bg-slate-100 transition-all active:scale-[0.98]"
              >
                Start Formation Now
              </Link>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}