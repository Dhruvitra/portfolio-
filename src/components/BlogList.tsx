import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen } from 'lucide-react';
import frontMatter from 'front-matter';

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const loadBlogs = async () => {
      const modules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default' });
      const loadedBlogs = [];
      for (const path in modules) {
        const rawMd = await modules[path]() as string;
        const { attributes } = frontMatter(rawMd);
        const slug = path.split('/').pop()?.replace('.md', '');
        loadedBlogs.push({ ...attributes, slug });
      }
      setBlogs(loadedBlogs);
    };
    loadBlogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white text-slate-900 pb-20 pt-24 px-6"
    >
      <Helmet>
        <title>Engineering Blog | Dhruvik Vanol</title>
        <meta name="description" content="Read the latest insights on Full Stack Development, React, Next.js, Shopify, and enterprise SEO strategies." />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-4">
            Engineering <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Deep technical dives into modern web architecture, performance optimization, and enterprise SEO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.slug} className="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer bg-white" onClick={() => window.history.pushState(null, '', `/blog/${blog.slug}`)}>
              <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" /> {blog.category}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                {blog.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-slate-400 font-mono">{blog.readingTime}</span>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">Read Post <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
