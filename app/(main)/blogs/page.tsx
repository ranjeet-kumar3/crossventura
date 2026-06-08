import React from 'react';
import { blogs } from '@/data/blogs';
import BlogCard from '@/components/blogs/BlogCard';

export const metadata = {
  title: 'Blogs - CrossVentura',
  description: 'Learn about US business formation, compliance, and growth with our expert-led blogs.',
};

export default function BlogsPage() {
  return (
    <main 
      className="min-h-screen bg-white"
      itemScope 
      itemType="https://schema.org/Blog"
    >
      <div className="max-w-[1260px] mx-auto px-6 py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-[48px] font-bold text-[#1A202C] mb-4" itemProp="name">
            Blogs
          </h1>
          <div className="w-20 h-1 bg-[#0266FF] mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
            Expert insights and guides to help you navigate US business formation and global growth.
          </p>
        </header>

        {/* Blog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </section>
      </div>
    </main>
  );
}