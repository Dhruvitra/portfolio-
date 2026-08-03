import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import frontMatter from 'front-matter';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { EEATSchema, AuthorProfile } from './EEAT';

export default function BlogPage({ slug }: { slug: string }) {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const modules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default' });
        const filePath = `/src/content/blog/${slug}.md`;
        if (modules[filePath]) {
          const rawMd = await modules[filePath]() as string;
          const { attributes, body } = frontMatter(rawMd);
          setMetadata(attributes);
          setContent(body);
        } else {
          setContent('# 404 Not Found');
        }
      } catch (err) {
        setContent('# Error Loading Blog');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-24 px-6"
    >
      <Helmet>
        <title>{metadata.title || 'Blog'} | Dhruvik Vanol</title>
        <meta name="description" content={metadata.description || 'Web development insights.'} />
        {/* Dynamic JSON-LD for Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": metadata.title,
            "description": metadata.description,
            "author": {
              "@type": "Person",
              "name": metadata.author
            },
            "datePublished": metadata.date
          })}
        </script>
      </Helmet>

      <EEATSchema type="Article" data={metadata} />
      <EEATSchema type="BreadcrumbList" data={{
        breadcrumbs: [
          { name: 'Home', url: 'https://dhruvikvanol.com' },
          { name: 'Blog', url: 'https://dhruvikvanol.com/blog' },
          { name: metadata.title, url: `https://dhruvikvanol.com/blog/${slug}` }
        ]
      }} />

      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => window.history.pushState(null, '', '/blog')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{metadata.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {metadata.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {metadata.readingTime}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-bold">{metadata.category}</span>
          </div>
        </div>

        <div className="prose prose-slate prose-blue max-w-none prose-headings:font-black prose-a:text-blue-600">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        
        <AuthorProfile />

        {/* Social Sharing */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex items-center gap-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Share Article</span>
          <button className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
