import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/data/blogs';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group h-full block">
      <article 
        itemScope 
        itemType="https://schema.org/BlogPosting"
        className="bg-white rounded-[24px] border border-slate-200 overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            itemProp="image"
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-semibold text-[#193D66]">
            {blog.category}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 
            itemProp="headline"
            className="text-[20px] font-bold text-[#1A202C] mb-3 leading-tight group-hover:text-[#0266FF] transition-colors"
          >
            {blog.title}
          </h3>
          <p 
            itemProp="description"
            className="text-slate-500 text-[14px] leading-relaxed mb-6 line-clamp-3"
          >
            {blog.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Organization">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                 <Image src="/favicon.ico" alt="Author" width={16} height={16} className="opacity-50" />
              </div>
              <span className="text-[13px] text-slate-400 font-medium" itemProp="name">CrossVentura</span>
            </div>
            <span className="text-[13px] text-slate-400 font-medium">
              {blog.readTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
