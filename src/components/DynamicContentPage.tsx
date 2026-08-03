import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import frontMatter from 'front-matter';
import { ArrowLeft } from 'lucide-react';

interface Props {
  slug: string;
  type: 'services' | 'locations' | 'case-studies' | 'authority';
}

export default function DynamicContentPage({ slug, type }: Props) {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let modules: Record<string, () => Promise<any>>;
        if (type === 'services') {
          modules = import.meta.glob('/src/content/services/*.md', { query: '?raw', import: 'default' });
        } else if (type === 'locations') {
          modules = import.meta.glob('/src/content/locations/*.md', { query: '?raw', import: 'default' });
        } else if (type === 'case-studies') {
          modules = import.meta.glob('/src/content/case-studies/*.md', { query: '?raw', import: 'default' });
        } else {
          modules = import.meta.glob('/src/content/authority/*.md', { query: '?raw', import: 'default' });
        }
        
        const filePath = `/src/content/${type}/${slug}.md`;
        
        if (modules[filePath]) {
          const rawMd = await modules[filePath]();
          const { attributes, body } = frontMatter(rawMd);
          setMetadata(attributes);
          setContent(body);
        } else {
          setContent('# 404 Not Found');
        }
      } catch (err) {
        setContent('# Error Loading Content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug, type]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-24 px-6"
    >
      <Helmet>
        <title>{metadata.title || 'Dhruvik Vanol'}</title>
        <meta name="description" content={metadata.description || 'Premium web development services.'} />
        {/* Dynamic JSON-LD based on Type */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'services' ? "Service" : type === 'locations' ? "LocalBusiness" : "Article",
            "name": metadata.title,
            "description": metadata.description,
            "provider": {
              "@type": "Person",
              "name": "Dhruvik Vanol"
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.pushState(null, '', '/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="prose prose-slate prose-blue max-w-none prose-headings:font-black prose-a:text-blue-600">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          
          {/* Universal CTA for these landing pages */}
          <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <h3 className="text-xl font-black text-slate-900 mb-2">Ready to transform your digital presence?</h3>
            <p className="text-sm text-slate-600 mb-6">Let's discuss how we can achieve exceptional results for your business.</p>
            <button 
              onClick={() => {
                window.history.pushState(null, '', '/');
                setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 100);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Start a Conversation
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
